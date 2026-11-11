import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { supabase } from './supabase.client';
import { AppRole, Profile } from '../models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfilesService {
  // Lista todos los perfiles (la usará la página admin; RLS solo se lo permite a admin).
  getAll(): Observable<Profile[]> {
    return from(
      supabase.from('profiles').select('*').order('created_at', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Profile[];
      })
    );
  }

  // Cambia el rol de un usuario. El id es un UUID, por eso es `string` y no `number`.
  updateRole(id: string, role: AppRole): Observable<Profile> {
    return from(
      supabase.from('profiles').update({ role }).eq('id', id).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Profile;
      })
    );
  }
}