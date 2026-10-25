import { Service } from '@angular/core';
import { Product } from '../models/product.interface';

// SERVICIO de productos.
// @Service() (Angular 22) registra la clase en la raíz de la app: existe UNA sola
// instancia y cualquier página puede pedirla con inject(). Es la inyección de dependencias.
@Service()
export class Products {

  // async + Promise: leer un fichero tarda, así que la función devuelve una promesa
  // y quien la llama espera con await.
  async getProducts(): Promise<Product[]> {
    // fetch pide el JSON local (datos "fake" que luego se sustituirán por una API)
    const response = await fetch('assets/data/products.json');
    // .json() convierte el texto de la respuesta en objetos de JavaScript
    const products: Product[] = await response.json();
    return products;
  }

}
