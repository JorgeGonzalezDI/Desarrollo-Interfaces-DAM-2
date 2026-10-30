import { Permiso } from './rol.model';

/**
 * Una entrada del menú lateral. Si lleva "permiso", solo se muestra
 * a quien lo tenga (la ruta además está protegida por su guard).
 */
export interface ItemMenu {
  readonly titulo: string;
  readonly url: string;
  readonly icono: string;
  readonly permiso?: Permiso;
}
