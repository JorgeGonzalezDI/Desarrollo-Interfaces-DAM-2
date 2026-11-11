import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { supabase } from './supabase.client';
import { Product, ProductInput } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  // Devuelve TODOS los productos. Observable<Product[]> = "un flujo que emitirá un array de Product".
  getAll(): Observable<Product[]> {
    return from(
      supabase.from('products').select('*').order('id', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error; // un throw dentro de map sale por el canal de error del Observable
        return data as Product[]; // `as`: le decimos a TypeScript qué forma tiene data
      })
    );
  }

  // Devuelve UN producto por su id.
  getById(id: number): Observable<Product> {
    return from(
      supabase.from('products').select('*').eq('id', id).single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Product;
      })
    );
  }

  // Crea un producto. Recibe SOLO los 4 campos (ProductInput); id y created_at los pone la base de datos.
  create(product: ProductInput): Observable<Product> {
    return from(
      supabase.from('products').insert(product).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Product; // la fila recién creada, ya con su id
      })
    );
  }

  // Edita el producto con ese id.
  update(id: number, changes: ProductInput): Observable<Product> {
    return from(
      supabase.from('products').update(changes).eq('id', id).select().single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Product; // la fila ya modificada
      })
    );
  }

  // Borra el producto con ese id. No hay nada que devolver: Observable<void>.
  delete(id: number): Observable<void> {
    return from(
      supabase.from('products').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}