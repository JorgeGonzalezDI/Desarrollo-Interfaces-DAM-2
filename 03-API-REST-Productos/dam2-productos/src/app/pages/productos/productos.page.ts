import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';   // pipes | currency y | number del HTML
import { RouterLink } from '@angular/router';   // para routerLink en el HTML (petición 3)
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonSegment,
  IonSegmentButton, IonLabel, IonBadge, IonCardSubtitle,
} from '@ionic/angular';                          // componentes de Ionic que usará el HTML
import { Product, ProductsResponse } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-productos',               // nombre de la etiqueta HTML de este componente
  templateUrl: './productos.page.html',    // su plantilla
  styleUrls: ['./productos.page.scss'],    // sus estilos
  // Cada componente declara lo que usa en su HTML (no hay AppModule)
  imports: [
    CurrencyPipe,
    DecimalPipe,
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,
    IonSegment, IonSegmentButton, IonLabel, IonBadge, IonCardSubtitle,
  ],
})
export class ProductosPage implements OnInit {

  // Pedimos a Angular el servicio (inyección de dependencias)
  private productService = inject(ProductService);
  theme = inject(ThemeService);   // petición 9: modo oscuro

  // SIGNALS: variables que avisan a la pantalla cuando cambian
  products = signal<Product[]>([]);   // la lista de productos (empieza vacía)
  total = signal(0);                  // cuántos productos hay en total en la API
  loading = signal(false);            // ¿estamos cargando?
  error = signal('');                 // mensaje de error ('' = no hay error)

  // Paginación
  readonly pageSize = 10;      // productos por página (readonly = constante, como final en Java)
  pagina = signal(1);          // página actual
  // computed: un signal que se RECALCULA solo cuando cambia total(). 194 / 10 = 19,4 → 20 páginas
  totalPaginas = computed(() => Math.ceil(this.total() / this.pageSize));
  
  // Qué vista se enseña: 'cards' (tarjetas) o 'tabla'. Empieza en cards
  vista = signal<'cards' | 'tabla'>('cards');

  // ngOnInit se ejecuta UNA vez, justo cuando se crea la página
  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);           // enseña el spinner
    this.error.set('');               // borra errores anteriores (por si es un "Reintentar")

    // skip = cuántos productos nos saltamos: página 1 → 0, página 2 → 10, página 3 → 20...
    const skip = (this.pagina() - 1) * this.pageSize;

    this.productService.getProducts(this.pageSize, skip) // Observable: la receta, aún sin ejecutar
      .subscribe({                    // subscribe = AQUÍ se hace la petición de verdad
        next: (response: ProductsResponse) => {   // llegó bien
          this.products.set(response.products);   // la lista está DENTRO de response
          this.total.set(response.total);
          this.loading.set(false);
        },
        error: (error) => {                       // falló (sin internet, 404, 500...)
          console.error(error);
          this.error.set('No se han podido cargar los productos.');
          this.loading.set(false);
        },
      });
  }

  anterior(): void {
    if (this.pagina() > 1) {
      this.pagina.update((p) => p - 1);   // update = "nuevo valor calculado a partir del anterior"
      this.loadProducts();                // vuelve a pedir, ahora con otro skip
    }
  }

  siguiente(): void {
    if (this.pagina() < this.totalPaginas()) {
      this.pagina.update((p) => p + 1);
      this.loadProducts();
    }
  }

  // Lo llama el selector cuando el usuario cambia de opción
  cambiarVista(event: CustomEvent): void {
    this.vista.set(event.detail.value === 'tabla' ? 'tabla' : 'cards');
  }

  // Petición nº 2: stock valorado = unidades * precio - descuento aplicable
  // (el descuento es un porcentaje, así que se resta ese % del total)
  stockValorado(p: Product): number {
    const bruto = p.stock * p.price;                  // valor sin descuento
    return bruto - bruto * (p.discountPercentage / 100);   // le restamos el % de descuento
  }
}
