import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { SupabaseService } from '../supabase/supabase.service';

/** Filtros y modificadores en formato PostgREST, p. ej. { id: 'eq.5', order: 'fecha.desc' }. */
export type ParametrosRest = Record<string, string>;

/**
 * Cliente de la API REST que Supabase genera sobre PostgreSQL (PostgREST).
 * Usa HttpClient + Observables (RxJS): las peticiones son asíncronas y no bloquean la interfaz,
 * y todas pasan por authInterceptor, que añade el token y gestiona los errores 401/403.
 *
 * Analogía Java: un DAO genérico; cada tabla es un "recurso" (/rest/v1/gastos).
 */
@Injectable({ providedIn: 'root' })
export class ApiRestService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(SupabaseService).restUrl;

  /** Pide que la API devuelva las filas creadas/modificadas en la respuesta. */
  private readonly devolverFilas = new HttpHeaders({ Prefer: 'return=representation' });

  public listar<T>(recurso: string, parametros: ParametrosRest = {}): Observable<T[]> {
    return this.http.get<T[]>(`${this.base}/${recurso}`, { params: new HttpParams({ fromObject: parametros }) });
  }

  public crear<T>(recurso: string, cuerpo: object, parametros: ParametrosRest = {}): Observable<T[]> {
    return this.http.post<T[]>(`${this.base}/${recurso}`, cuerpo, {
      headers: this.devolverFilas,
      params: new HttpParams({ fromObject: parametros }),
    });
  }

  public actualizar<T>(recurso: string, filtros: ParametrosRest, cambios: object): Observable<T[]> {
    return this.http.patch<T[]>(`${this.base}/${recurso}`, cambios, {
      headers: this.devolverFilas,
      params: new HttpParams({ fromObject: filtros }),
    });
  }

  public eliminar(recurso: string, filtros: ParametrosRest): Observable<void> {
    return this.http.delete<void>(`${this.base}/${recurso}`, { params: new HttpParams({ fromObject: filtros }) });
  }

  /** Llama a una función de PostgreSQL expuesta como endpoint (/rest/v1/rpc/<nombre>). */
  public rpc<T>(funcion: string, argumentos: object): Observable<T> {
    return this.http.post<T>(`${this.base}/rpc/${funcion}`, argumentos);
  }
}
