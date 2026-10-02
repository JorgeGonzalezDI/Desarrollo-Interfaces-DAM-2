import { Component, OnInit, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonGrid, IonRow, IonCol,
} from '@ionic/angular';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.interface';

@Component({
  standalone: true,
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  imports: [NgFor, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonGrid, IonRow, IonCol],
})
export class ProductosPage implements OnInit {
  // signal en vez de una propiedad normal: Angular 22 funciona sin zone.js
  // y una propiedad asignada después de un await no refrescaría la vista.
  products = signal<Product[]>([]);

  // INYECCIÓN DE DEPENDENCIAS por constructor:
  // la página no hace "new ProductsService()", solo lo pide como parámetro
  // y Angular le entrega la instancia única registrada en 'root'.
  constructor(private productService: ProductsService) {}

  async ngOnInit() {
    this.products.set(await this.productService.getProducts());
  }
}
