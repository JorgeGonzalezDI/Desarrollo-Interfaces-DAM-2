import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
         IonItem, IonInput, IonTextarea, IonButton, IonList, IonLabel } from '@ionic/angular';
import { Messages, Mensaje } from '../../services/messages';

// PÁGINA Contacto: formulario (correo + mensaje) con persistencia local.
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  // FormsModule habilita [(ngModel)], que une cada campo con su signal
  imports: [FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
            IonItem, IonInput, IonTextarea, IonButton, IonList, IonLabel]
})
export class ContactoPage implements OnInit {
  private messages = inject(Messages);

  correo = signal('');                    // texto del campo correo
  mensaje = signal('');                   // texto del campo mensaje
  enviado = signal(false);                // true tras guardar: muestra la confirmación
  guardados = signal<Mensaje[]>([]);      // lista de mensajes ya guardados

  // Al abrir la página se cargan los mensajes que había guardados de antes
  async ngOnInit() {
    this.guardados.set(await this.messages.cargar());
  }

  async enviar() {
    // validación mínima: no se guardan mensajes con algún campo vacío
    if (!this.correo().trim() || !this.mensaje().trim()) {
      return;
    }
    await this.messages.guardar(this.correo(), this.mensaje());
    this.guardados.set(await this.messages.cargar()); // refresca la lista en pantalla
    this.correo.set('');                              // vacía el formulario
    this.mensaje.set('');
    this.enviado.set(true);
  }
}
