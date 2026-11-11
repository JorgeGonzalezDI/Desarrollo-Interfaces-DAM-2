import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonTitle, IonToolbar } from '@ionic/angular';
import { ProductInput } from '../../core/models/product.model';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: 'product-form.page.html',
  styleUrls: ['product-form.page.scss'],
  imports: [ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonItem, IonInput, IonButton],
})
export class ProductFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);

  // El :id de la URL llega aquí solo, gracias a withComponentInputBinding() de main.ts.
  // Siempre llega como TEXTO, y en /product-form (sin id) es undefined.
  readonly id = input<string>();

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Se ejecuta una vez, al crearse la pantalla
  ngOnInit(): void {
    const id = this.id();
    if (id) {
      // Modo editar: traemos el producto y rellenamos el formulario con sus datos
      this.productsService.getById(Number(id)).subscribe({ // Number() convierte "3" en 3
        next: (p) =>
          this.form.patchValue({ // patchValue rellena solo los campos que le das
            name: p.name,
            description: p.description ?? '', // ?? = "si es null, usa ''"
            price: p.price,
            stock: p.stock,
          }),
        error: () => this.error.set('No se pudo cargar el producto'),
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();
    // Montamos un ProductInput: el tipo obliga a tener exactamente estos 4 campos
    const product: ProductInput = {
      name: raw.name,
      description: raw.description.trim() || null, // texto vacío → null (la columna lo admite)
      price: Number(raw.price), // por si el input lo entrega como texto
      stock: Number(raw.stock),
    };

    const id = this.id();
    // create y update devuelven los dos Observable<Product>: elegimos uno según haya id.
    // El $ al final del nombre es una convención: "esto es un Observable".
    const request$ = id
      ? this.productsService.update(Number(id), product)
      : this.productsService.create(product);

    request$.subscribe({
      next: () => this.router.navigateByUrl('/products'), // guardado → volvemos a la lista
      error: () => {
        this.error.set('No se pudo guardar');
        this.loading.set(false);
      },
    });
  }
}