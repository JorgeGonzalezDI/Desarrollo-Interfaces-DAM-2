import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { AlertController } from '@ionic/angular';

/** Lo implementa cualquier página con un formulario que no se debe perder sin avisar. */
export interface ConCambiosSinGuardar {
  hayCambiosSinGuardar(): boolean;
}

/**
 * Guard canDeactivate: si el formulario tiene cambios sin guardar, pregunta antes de salir.
 * Devuelve una Promise<boolean>: el router espera a la respuesta del usuario.
 */
export const cambiosSinGuardarGuard: CanDeactivateFn<ConCambiosSinGuardar> = async (componente) => {
  if (!componente.hayCambiosSinGuardar()) {
    return true;
  }
  const alerta = await inject(AlertController).create({
    header: '¿Salir sin guardar?',
    message: 'Has empezado a registrar un gasto. Si sales ahora se perderán los datos.',
    buttons: [
      { text: 'Seguir editando', role: 'cancel' },
      { text: 'Salir sin guardar', role: 'confirm' },
    ],
  });
  await alerta.present();
  const { role } = await alerta.onDidDismiss();
  return role === 'confirm';
};
