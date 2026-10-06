import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductsResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Inyección de dependencias con inject() (equivale a usar el constructor)
  private http = inject(HttpClient);

  private apiUrl = 'https://dummyjson.com/products';

  // Devuelve un Observable: la petición NO se envía hasta que alguien se suscribe
  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.apiUrl);
  }
}
