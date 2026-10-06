import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,
} from '@ionic/angular';

import { Product, ProductsResponse } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe, DecimalPipe, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,
  ],
})
export class ProductosPage implements OnInit {
  private productService = inject(ProductService);

  // Signals en lugar de propiedades normales: Angular 22 funciona sin zone.js y
  // no detectaría los cambios hechos dentro del subscribe (ver troubleshooting).
  products = signal<Product[]>([]);
  total = signal(0);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.error.set('');

    // subscribe: aquí se envía realmente la petición a la API
    this.productService.getProducts().subscribe({
      next: (response: ProductsResponse) => {
        this.products.set(response.products);
        this.total.set(response.total);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se han podido cargar los productos.');
        this.loading.set(false);
      },
    });
  }

  // Petición nº 2: stock valorado = unidades * precio - descuento aplicable
  // (el descuento es un porcentaje, así que se resta ese % del total)
  stockValorado(p: Product): number {
    const bruto = p.stock * p.price;
    return bruto - bruto * (p.discountPercentage / 100);
  }
}
