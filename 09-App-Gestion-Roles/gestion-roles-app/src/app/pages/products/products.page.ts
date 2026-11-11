import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: 'products.page.html',
  styleUrls: ['products.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonList, IonItem, IonLabel],
})
export class ProductsPage {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);
  // Sin `private`: el HTML necesita leer auth.isAdmin()
  readonly auth = inject(AuthService);

  // Signal con un array de Product: empieza vacío y se rellena al cargar
  readonly products = signal<Product[]>([]);
  readonly error = signal<string | null>(null);

  // Hook de Ionic: se ejecuta CADA VEZ que la pantalla va a mostrarse.
  // ngOnInit solo corre la primera vez; Ionic guarda las pantallas en memoria,
  // así que al volver del formulario no se repetiría y la lista quedaría vieja.
  ionViewWillEnter(): void {
    this.load();
  }

  private load(): void {
    // getAll() devuelve un Observable: no hace nada hasta que te suscribes.
    // subscribe recibe dos funciones: next (llegó el dato) y error (falló).
    this.productsService.getAll().subscribe({
      next: (list) => this.products.set(list),
      error: () => this.error.set('No se pudieron cargar los productos'),
    });
  }

  remove(id: number): void {
    this.productsService.delete(id).subscribe({
      next: () => this.load(), // tras borrar, recargamos la lista
      error: () => this.error.set('No se pudo borrar'),
    });
  }

  // id?: number → el "?" hace el parámetro OPCIONAL (puede venir o no).
  // Sin id → /product-form (crear). Con id → /product-form/7 (editar).
  openForm(id?: number): void {
    this.router.navigate(id ? ['/product-form', id] : ['/product-form']);
  }

  // Lleva a la pantalla de gestión de usuarios (solo la ve el admin)
  goToAdmin(): void {
    this.router.navigateByUrl('/admin');
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }
}