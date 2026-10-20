import { Injectable, computed, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

import { environment } from '../../environments/environment';
import { Client } from '../models/client.model';

export type UserRole = 'admin' | 'user';

/**
 * Servicio único para Auth y la tabla clients (Paso 2.4 del laboratorio).
 * El estado global (quién está logueado y con qué rol) se guarda en signals,
 * así cualquier página que los lea se repinta sola cuando cambian.
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  // Señales reactivas para el estado global
  public currentUser = signal<User | null>(null);
  public userRole = signal<UserRole | null>(null);
  public isAdmin = computed(() => this.userRole() === 'admin');

  /** Se cumple cuando ya se ha mirado si había una sesión guardada (lo espera el guard). */
  public readonly sessionReady: Promise<void>;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.sessionReady = this.initSession();
  }

  // --- AUTENTICACIÓN Y ROLES ---

  /** Al abrir la app: si el navegador guardaba una sesión, se recupera (no hay que volver a entrar). */
  private async initSession(): Promise<void> {
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession();
      if (session?.user) {
        this.currentUser.set(session.user);
        await this.loadRole(session.user.id);
      }
    } catch (error) {
      console.error('No se pudo recuperar la sesión', error);
    }
  }

  async login(email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      this.currentUser.set(data.user);
      await this.loadRole(data.user.id);
    }
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    this.currentUser.set(null);
    this.userRole.set(null);
  }

  /** Lee el rol del usuario en la tabla profiles (la política RLS solo deja leer el propio). */
  private async loadRole(userId: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    this.userRole.set(!error && data ? (data.role as UserRole) : null);
  }

  // --- CRUD CLIENTES ---

  async getClients(): Promise<Client[]> {
    const { data, error } = await this.supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async createClient(client: Client): Promise<void> {
    const { error } = await this.supabase.from('clients').insert([
      {
        nombre: client.nombre,
        empresa: client.empresa,
        email: client.email,
      },
    ]);
    if (error) throw error;
  }

  async updateClient(id: string, client: Partial<Client>): Promise<void> {
    const { error } = await this.supabase.from('clients').update(client).eq('id', id);
    if (error) throw error;
  }

  async deleteClient(id: string): Promise<void> {
    const { error } = await this.supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  }
}
