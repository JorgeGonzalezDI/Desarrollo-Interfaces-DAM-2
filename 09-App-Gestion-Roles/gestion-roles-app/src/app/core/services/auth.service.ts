import type { Session } from '@supabase/supabase-js';
import { Injectable, computed, signal } from '@angular/core';
import { AppRole, Profile } from '../models/profile.model';
import { supabase } from './supabase.client';



@Injectable({ providedIn: 'root' })
export class AuthService {
  // Estado privado: solo esta clase lo puede cambiar
  private readonly _session = signal<Session | null>(null);
  private readonly _role = signal<AppRole | null>(null);

  // Lo que ve el resto de la app: solo lectura
  readonly session = this._session.asReadonly();
  readonly role = this._role.asReadonly();

  // Señales derivadas: se recalculan solas
  readonly isLoggedIn = computed(() => this._session() !== null);
  readonly isAdmin = computed(() => this._role() === 'admin');


  // Promesa que se resuelve cuando ya sabemos si había una sesión guardada.
  // Debe ir DESPUÉS de las señales: los campos de una clase se inicializan en orden.
  readonly ready: Promise<void> = this.init();

  // Se ejecuta una sola vez, al crearse el servicio (al arrancar la app).
  private async init(): Promise<void> {
    const { data } = await supabase.auth.getSession();
    this._session.set(data.session);
    if (data.session) {
      await this.loadRole(data.session.user.id);
    }
  }
  
  // Inicia sesión. Si falla, lanza el error y lo recoge quien llamó (la página de login).
  async login(email: string, password: string): Promise<void> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this._session.set(data.session);
    await this.loadRole(data.user.id);
  }

  // Cierra sesión y deja el estado vacío.
  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this._session.set(null);
    this._role.set(null);
  }

  // Busca el rol del usuario en la tabla `profiles`.
  private async loadRole(userId: string): Promise<void> {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    // `data` llega sin tipo concreto; con `as` le decimos a TypeScript qué forma tiene.
    const profile = data as Pick<Profile, 'role'> | null;
    this._role.set(error || !profile ? null : profile.role);
  }
}