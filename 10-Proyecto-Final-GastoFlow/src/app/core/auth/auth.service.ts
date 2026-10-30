import { Injectable, computed, signal } from '@angular/core';

import { NOMBRE_ROL, PERMISOS_POR_ROL, Permiso, Rol } from '../models/rol.model';
import { SesionClaims } from '../models/sesion.model';
import { USUARIOS_DEMO } from './usuarios-demo';

/** Duración de la sesión: 8 horas (una jornada de trabajo). */
const DURACION_SESION_SEG = 8 * 60 * 60;

/**
 * Servicio CENTRAL de sesión (singleton: providedIn 'root' -> una sola instancia,
 * como un @Service de Spring). Es el único que sabe quién está conectado y qué puede hacer.
 * Guards, menú y páginas le PREGUNTAN; nunca leen el storage por su cuenta.
 *
 * Estado:
 *  1) un signal en memoria -> la interfaz se actualiza sola cuando cambia.
 *  2) sessionStorage -> la sesión sobrevive a un F5 y se borra al cerrar la pestaña.
 *
 * Ahora la autenticación es SIMULADA (usuarios-demo.ts). En la Fase 3 se cambia el
 * interior de login()/logout() por Supabase Auth y el resto de la app no se entera.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'GASTOFLOW_SESION';

  // Estado privado: se inicializa desde el storage ANTES de que se ejecute ningún guard
  private readonly _sesion = signal<SesionClaims | null>(this.leerSesionGuardada());

  // ---- Lo que ve el resto de la app (todo de solo lectura) ----
  public readonly sesion = this._sesion.asReadonly();
  public readonly estaAutenticado = computed(() => this._sesion() !== null);
  public readonly rol = computed<Rol | null>(() => this._sesion()?.rol ?? null);
  public readonly nombreRol = computed(() => {
    const rol = this.rol();
    return rol ? NOMBRE_ROL[rol] : '';
  });
  /** Permisos del usuario actual según la matriz RBAC (vacío si no hay sesión). */
  public readonly permisos = computed<readonly Permiso[]>(() => {
    const rol = this.rol();
    return rol ? PERMISOS_POR_ROL[rol] : [];
  });

  /**
   * Comprueba email + contraseña. Es async porque calcular el hash usa la
   * Web Crypto API (devuelve una Promise), igual que lo será la llamada a Supabase.
   * @returns true si las credenciales son correctas (y deja la sesión iniciada).
   */
  public async login(email: string, password: string): Promise<boolean> {
    const emailNormalizado = email.trim().toLowerCase();
    const usuario = USUARIOS_DEMO.find((u) => u.email === emailNormalizado);
    const hash = await this.sha256(password);

    // Mismo mensaje de error tanto si falla el email como la contraseña:
    // así no se da pistas sobre qué correos existen.
    if (!usuario || usuario.hashPassword !== hash) {
      return false;
    }

    const claims: SesionClaims = {
      sub: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      departamento: usuario.departamento,
      rol: usuario.rol,
      exp: Math.floor(Date.now() / 1000) + DURACION_SESION_SEG,
    };

    // Tras un await el estado se cambia SIEMPRE con signals (la app no usa zone.js)
    this._sesion.set(claims);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(claims));
    return true;
  }

  /** Cierra la sesión: la borra de memoria y del storage. */
  public logout(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this._sesion.set(null);
  }

  /**
   * ¿Hay una sesión y no ha caducado? La usan los guards en CADA navegación.
   * Si ha caducado, cierra la sesión (en Supabase aquí se intentaría el refresh token).
   */
  public haySesionValida(): boolean {
    const sesion = this._sesion();
    if (!sesion) {
      return false;
    }
    if (sesion.exp * 1000 <= Date.now()) {
      this.logout();
      return false;
    }
    return true;
  }

  /** ¿El usuario actual tiene este permiso? (pregunta RBAC: por permiso, no por rol) */
  public tienePermiso(permiso: Permiso): boolean {
    return this.permisos().includes(permiso);
  }

  /** Recupera la sesión al recargar. Si el JSON está corrupto o caducado, la descarta. */
  private leerSesionGuardada(): SesionClaims | null {
    const texto = sessionStorage.getItem(this.STORAGE_KEY);
    if (!texto) {
      return null;
    }
    try {
      const claims = JSON.parse(texto) as SesionClaims;
      return claims.exp * 1000 > Date.now() ? claims : null;
    } catch {
      sessionStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }

  /** Huella SHA-256 en hexadecimal (Web Crypto API del navegador). */
  private async sha256(texto: string): Promise<string> {
    const bytes = new TextEncoder().encode(texto);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
