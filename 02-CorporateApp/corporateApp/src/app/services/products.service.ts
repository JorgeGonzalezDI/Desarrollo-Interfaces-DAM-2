import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';

// @Injectable + providedIn: 'root' => Angular registra el servicio en el
// inyector raíz: una única instancia (singleton) para toda la aplicación,
// que se entrega a quien la pida (inyección de dependencias).
@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  async getProducts(): Promise<Product[]> {
    const response = await fetch('assets/data/products.json');

    const products = await response.json();

    return products;
  }

}
