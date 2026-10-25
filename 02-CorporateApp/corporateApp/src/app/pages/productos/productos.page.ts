import { Component, OnInit, signal, inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol } from '@ionic/angular';
import { Products } from '../../services/products';
import { Product } from '../../models/product.interface';

// PÁGINA Productos: pide la lista al servicio y la muestra en un ion-grid.
@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  // Componente standalone: cada componente de Ionic que use el HTML hay que listarlo aquí
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonGrid, IonRow, IonCol]
})
export class ProductosPage implements OnInit {
  // inject() pide a Angular el servicio (inyección de dependencias)
  private productsService = inject(Products);

  // signal: valor reactivo. Al hacer .set() la vista se actualiza sola,
  // imprescindible en una app sin zone.js. En la plantilla se lee con paréntesis: products()
  products = signal<Product[]>([]);

  constructor() { }

  // ngOnInit se ejecuta una vez al abrir la página: aquí cargamos los datos
  async ngOnInit() {
    const lista = await this.productsService.getProducts();
    this.products.set(lista);
  }

}
