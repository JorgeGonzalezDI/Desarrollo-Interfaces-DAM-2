import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../models/product.model';

@Service()
export class ProductService {

  private http = inject(HttpClient);

  private apiUrl = 'https://dummyjson.com/products';

  // NUEVO: limit = cuántos productos pide, skip = cuántos se salta desde el principio.
  // Los valores por defecto (10 y 0) hacen que getProducts() sin nada siga funcionando.
  getProducts(limit = 10, skip = 0): Observable<ProductsResponse> {
    // { params: { limit, skip } } → Angular lo convierte en ?limit=10&skip=0 al final de la URL
    return this.http.get<ProductsResponse>(this.apiUrl, { params: { limit, skip } });
  }
}