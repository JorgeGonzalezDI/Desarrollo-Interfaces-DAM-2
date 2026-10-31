import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiRestService } from '../api/api-rest.service';

/** Consultas sobre usuarios que no son de la sesión (p. ej. validar el registro). */
@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly api = inject(ApiRestService);

  /**
   * ¿Está libre este correo? Llama a la función SQL email_disponible() vía /rest/v1/rpc.
   * Es la base de la VALIDACIÓN ASÍNCRONA del formulario de registro.
   */
  public emailDisponible(email: string): Observable<boolean> {
    return this.api.rpc<boolean>('email_disponible', { p_email: email });
  }
}
