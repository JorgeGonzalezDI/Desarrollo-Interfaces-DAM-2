import { Injectable, computed, signal } from '@angular/core';

// Roles posibles de la aplicación (tipo unión: solo admite estos dos textos)
export type Rol = 'admin' | 'user';

// Forma de la sesión que se guarda en memoria (signal) y en sessionStorage.
// En Java sería un "record" o un POJO con 3 atributos.
export interface UserSession {
  username: string;
  role: Rol;
  isAuthenticated: boolean;
}

// "Base de datos" de prueba: usuario -> contraseña y rol.
// (Apartado 4.1 del enunciado: admin/123 es 'admin' y operador/123 es 'user')
const USUARIOS: Record<string, { pass: string; role: Rol }> = {
  admin: { pass: '123', role: 'admin' },
  operador: { pass: '123', role: 'user' },
};

/**
 * Servicio de autenticación (singleton: providedIn 'root' -> una sola instancia
 * para toda la app, como un @Service de Spring).
 * Guarda la sesión en DOS sitios:
 *   1) un signal en memoria -> la UI se actualiza sola al cambiar.
 *   2) sessionStorage del navegador -> sobrevive a un F5 o a escribir la URL a mano.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Clave con la que se guarda la sesión en la Web Storage API
  private readonly STORAGE_KEY = 'DAM2_AUTH_SESSION';

  // Estado privado. Se inicializa leyendo el storage: así, al recargar la página,
  // la sesión "resucita" antes de que se ejecute ninguna guarda.
  private readonly _currentUser = signal<UserSession | null>(this.readSessionFromStorage());

  // Lo que se expone al resto de la app es de SOLO LECTURA (nadie puede hacer .set desde fuera)
  public readonly currentUser = this._currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => this._currentUser()?.isAuthenticated ?? false);
  public readonly role = computed<Rol | null>(() => this._currentUser()?.role ?? null);

  /** Valida las credenciales. Devuelve true si son correctas y deja la sesión guardada. */
  public login(user: string, pass: string): boolean {
    const nombre = user.trim().toLowerCase();
    const encontrado = USUARIOS[nombre];

    if (!encontrado || encontrado.pass !== pass) {
      return false;
    }

    const sessionData: UserSession = {
      username: nombre,
      role: encontrado.role,
      isAuthenticated: true,
    };

    // 1. Guardar en memoria reactiva
    this._currentUser.set(sessionData);
    // 2. Persistir en el navegador (Web Storage API). Solo admite texto -> JSON.stringify
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));

    return true;
  }

  /** Cierra la sesión: la borra del storage y de memoria. */
  public logout(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this._currentUser.set(null);
  }

  /** Página de inicio de cada rol (la usan el login y la roleGuard para redirigir). */
  public rutaInicio(role: Rol | null): string {
    return role === 'admin' ? '/admin' : '/user-dashboard';
  }

  /** Texto tal cual está en sessionStorage (para enseñarlo en pantalla como evidencia). */
  public leerStorageEnBruto(): string | null {
    return sessionStorage.getItem(this.STORAGE_KEY);
  }

  /** Recupera la sesión al refrescar la página. Si el JSON está corrupto, lo borra. */
  private readSessionFromStorage(): UserSession | null {
    const rawData = sessionStorage.getItem(this.STORAGE_KEY);
    if (!rawData) {
      return null;
    }
    try {
      return JSON.parse(rawData) as UserSession;
    } catch {
      sessionStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }
}
