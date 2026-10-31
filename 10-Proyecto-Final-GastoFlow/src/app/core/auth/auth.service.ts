import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthError, Session } from '@supabase/supabase-js';

import { NOMBRE_ROL, PERMISOS_POR_ROL, Permiso, Rol } from '../models/rol.model';
import { SesionClaims } from '../models/sesion.model';
import { SupabaseService } from '../supabase/supabase.service';

/** Datos del formulario de registro. */
export interface DatosRegistro {
  nombre: string;
  email: string;
  departamento: string;
  password: string;
}

/**
 * Servicio CENTRAL de sesión (singleton, como un @Service de Spring).
 * Es el único que habla con Supabase Auth y el único que conoce el token.
 * Guards, interceptor, menú y páginas le PREGUNTAN; nadie más toca la sesión.
 *
 * Estado en signals -> la interfaz se actualiza sola al entrar o salir.
 * Supabase guarda la sesión en localStorage y renueva el token antes de que caduque.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService).client;

  private readonly _sesion = signal<SesionClaims | null>(null);
  private accessTokenActual: string | null = null;
  private refrescoEnCurso: Promise<boolean> | null = null;

  // ---- Lo que ve el resto de la app (solo lectura) ----
  public readonly sesion = this._sesion.asReadonly();
  public readonly estaAutenticado = computed(() => this._sesion() !== null);
  public readonly rol = computed<Rol | null>(() => this._sesion()?.rol ?? null);
  public readonly nombreRol = computed(() => {
    const rol = this.rol();
    return rol ? NOMBRE_ROL[rol] : '';
  });
  public readonly permisos = computed<readonly Permiso[]>(() => {
    const rol = this.rol();
    return rol ? PERMISOS_POR_ROL[rol] : [];
  });

  /**
   * Promesa que se cumple cuando ya se ha intentado recuperar la sesión guardada.
   * Los guards la esperan: así un F5 en /admin/dashboard no manda al login por error.
   */
  public readonly listo: Promise<void>;

  constructor() {
    this.listo = this.restaurarSesion();

    // Supabase avisa de cada cambio: renovación del token, cierre de sesión en otra pestaña...
    this.supabase.auth.onAuthStateChange((evento, session) => {
      this.accessTokenActual = session?.access_token ?? null;
      if (evento === 'SIGNED_OUT') {
        this._sesion.set(null);
      } else if (evento === 'TOKEN_REFRESHED' && session) {
        this._sesion.update((s) => (s ? { ...s, exp: session.expires_at ?? s.exp } : s));
      }
    });
  }

  /** Inicia sesión con email y contraseña. Lanza un Error con un mensaje para el usuario. */
  public async login(email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error || !data.session) {
      throw new Error(this.mensajeError(error));
    }
    await this.cargarSesion(data.session);
  }

  /**
   * Alta de un usuario nuevo. Supabase Auth crea la cuenta y un trigger de la base de datos
   * crea su perfil con rol 'empleado' (nadie puede registrarse como administrador).
   */
  public async registrar(datos: DatosRegistro): Promise<void> {
    const { data, error } = await this.supabase.auth.signUp({
      email: datos.email.trim().toLowerCase(),
      password: datos.password,
      options: { data: { nombre: datos.nombre.trim(), departamento: datos.departamento } },
    });
    if (error) {
      throw new Error(this.mensajeError(error));
    }
    if (!data.session) {
      throw new Error('Cuenta creada. Revisa tu correo para confirmarla y después inicia sesión.');
    }
    await this.cargarSesion(data.session);
  }

  /** Cierra la sesión en Supabase y en la app. */
  public async logout(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
    } finally {
      this.limpiarSesion();
    }
  }

  /** Borra la sesión local sin llamar al servidor (la usa el interceptor si el token ya no vale). */
  public limpiarSesion(): void {
    this.accessTokenActual = null;
    this._sesion.set(null);
  }

  /** Token de acceso actual (JWT). Solo lo usa el interceptor HTTP. */
  public accessToken(): string | null {
    return this.accessTokenActual;
  }

  /**
   * Pide un token nuevo con el refresh token. Si varias peticiones reciben 401 a la vez,
   * todas esperan a la MISMA renovación (no se lanzan varias en paralelo).
   */
  public refrescarSesion(): Promise<boolean> {
    this.refrescoEnCurso ??= (async () => {
      try {
        const { data, error } = await this.supabase.auth.refreshSession();
        if (error || !data.session) {
          return false;
        }
        await this.cargarSesion(data.session);
        return true;
      } catch {
        return false;
      } finally {
        this.refrescoEnCurso = null;
      }
    })();
    return this.refrescoEnCurso;
  }

  /** ¿Hay sesión y su token no ha caducado? */
  public haySesionValida(): boolean {
    const sesion = this._sesion();
    return sesion !== null && sesion.exp * 1000 > Date.now();
  }

  /** ¿El usuario actual tiene este permiso? (pregunta RBAC: por permiso, no por rol) */
  public tienePermiso(permiso: Permiso): boolean {
    return this.permisos().includes(permiso);
  }

  // ------------------------------------------------------------------ privados

  /** Al abrir la app: si el navegador guardaba una sesión, se recupera. */
  private async restaurarSesion(): Promise<void> {
    try {
      const { data } = await this.supabase.auth.getSession();
      if (data.session) {
        await this.cargarSesion(data.session);
      }
    } catch (error) {
      console.error('No se pudo recuperar la sesión guardada', error);
      this.limpiarSesion();
    }
  }

  /**
   * Convierte la sesión de Supabase en nuestros claims: del token salen sub, email y exp;
   * del perfil (tabla perfiles, protegida por RLS) salen nombre, departamento y ROL.
   * El rol se lee de la base de datos y no del cliente, así nadie puede "inventárselo".
   */
  private async cargarSesion(session: Session): Promise<void> {
    this.accessTokenActual = session.access_token;
    const { data: perfil, error } = await this.supabase
      .from('perfiles')
      .select('nombre, departamento, rol')
      .eq('id', session.user.id)
      .single();

    if (error || !perfil) {
      this.limpiarSesion();
      throw new Error('Tu usuario no tiene perfil en GastoFlow. Contacta con administración.');
    }

    this._sesion.set({
      sub: session.user.id,
      email: session.user.email ?? '',
      nombre: perfil.nombre as string,
      departamento: perfil.departamento as string,
      rol: perfil.rol as Rol,
      exp: session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
    });
  }

  /** Traduce los errores de Supabase Auth a mensajes claros (sin dar pistas a un atacante). */
  private mensajeError(error: AuthError | null): string {
    const mensaje = error?.message?.toLowerCase() ?? '';
    if (mensaje.includes('invalid login')) return 'Correo o contraseña incorrectos.';
    if (mensaje.includes('already registered')) return 'Ya existe una cuenta con ese correo.';
    if (mensaje.includes('password')) return 'La contraseña no cumple los requisitos de seguridad.';
    if (mensaje.includes('rate limit')) return 'Demasiados intentos. Espera un momento y vuelve a probar.';
    return 'No se ha podido completar la operación. Inténtalo de nuevo.';
  }
}
