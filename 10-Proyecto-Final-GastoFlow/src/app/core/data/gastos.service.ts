import { Injectable, computed, inject, signal } from '@angular/core';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { firstValueFrom, forkJoin } from 'rxjs';

import { ApiRestService } from '../api/api-rest.service';
import { AuthService } from '../auth/auth.service';
import { Categoria, EstadoGasto, Gasto, NuevoGasto } from '../models/gasto.model';
import { SupabaseService } from '../supabase/supabase.service';

/** Columnas pedidas a la API, con el perfil del empleado y la categoría "embebidos" (join). */
const SELECT_GASTO =
  'id,empleado_id,categoria_id,fecha,importe,descripcion,estado,detalles,motivo_rechazo,revisado_en,creado_en,' +
  'empleado:perfiles!gastos_empleado_fk(nombre,departamento),categoria:categorias(nombre,icono)';

/**
 * STORE de gastos (patrón ViewModel con signals).
 *  - Estado privado y escribible; hacia fuera, solo lectura.
 *  - Carga concurrente de gastos y categorías con forkJoin (dos peticiones a la vez).
 *  - Tiempo real: se suscribe a los cambios de la tabla por WebSocket (Supabase Realtime)
 *    y actualiza los signals sin recargar la página.
 * La API ya filtra por RLS: un empleado recibe solo sus gastos; administración, todos.
 */
@Injectable({ providedIn: 'root' })
export class GastosService {
  private readonly api = inject(ApiRestService);
  private readonly auth = inject(AuthService);
  private readonly supabase = inject(SupabaseService).client;

  private readonly _gastos = signal<Gasto[]>([]);
  private readonly _categorias = signal<Categoria[]>([]);
  private readonly _cargando = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _enVivo = signal(false);
  private canal: RealtimeChannel | null = null;

  public readonly gastos = this._gastos.asReadonly();
  public readonly categorias = this._categorias.asReadonly();
  public readonly cargando = this._cargando.asReadonly();
  public readonly error = this._error.asReadonly();
  /** true mientras la conexión de tiempo real está activa (se enseña en la interfaz). */
  public readonly enVivo = this._enVivo.asReadonly();

  /** Solo los gastos del usuario conectado (para "Mis gastos", también si es administrador). */
  public readonly misGastos = computed(() => {
    const id = this.auth.sesion()?.sub;
    return this._gastos().filter((g) => g.empleado_id === id);
  });

  public readonly pendientes = computed(() => this._gastos().filter((g) => g.estado === 'pendiente'));

  /** Carga gastos y categorías EN PARALELO. Devuelve una Promise para poder usar await. */
  public async cargar(): Promise<void> {
    this._cargando.set(true);
    this._error.set(null);
    try {
      const { gastos, categorias } = await firstValueFrom(
        forkJoin({
          gastos: this.api.listar<Gasto>('gastos', { select: SELECT_GASTO, order: 'fecha.desc,id.desc' }),
          categorias: this.api.listar<Categoria>('categorias', { select: '*', order: 'nombre.asc' }),
        }),
      );
      this._gastos.set(gastos.map(normalizar));
      this._categorias.set(categorias.map((c) => ({ ...c, limite_mensual: Number(c.limite_mensual) })));
    } catch {
      this._error.set('No se han podido cargar los datos. Comprueba la conexión y vuelve a intentarlo.');
    } finally {
      this._cargando.set(false);
    }
  }

  /** Alta de un gasto (la base de datos lo deja siempre como 'pendiente'). */
  public async crear(nuevo: NuevoGasto): Promise<Gasto> {
    const [creado] = await firstValueFrom(this.api.crear<Gasto>('gastos', nuevo, { select: SELECT_GASTO }));
    const gasto = normalizar(creado);
    this.insertarOActualizar(gasto);
    return gasto;
  }

  /** Aprobar o rechazar (solo administración: lo vuelven a comprobar el trigger y RLS). */
  public async cambiarEstado(id: number, estado: EstadoGasto, motivo: string | null = null): Promise<void> {
    const [actualizado] = await firstValueFrom(
      this.api.actualizar<Gasto>('gastos', { id: `eq.${id}`, select: SELECT_GASTO }, { estado, motivo_rechazo: motivo }),
    );
    if (actualizado) {
      this.insertarOActualizar(normalizar(actualizado));
    }
  }

  /** Borra un gasto propio que siga pendiente. */
  public async eliminar(id: number): Promise<void> {
    await firstValueFrom(this.api.eliminar('gastos', { id: `eq.${id}` }));
    this._gastos.update((lista) => lista.filter((g) => g.id !== id));
  }

  /** Abre la suscripción de tiempo real (si no estaba ya abierta). */
  public iniciarTiempoReal(): void {
    if (this.canal) {
      return;
    }
    this.canal = this.supabase
      .channel('gastos-cambios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gastos' }, (cambio) =>
        void this.aplicarCambio(cambio as RealtimePostgresChangesPayload<Gasto>),
      )
      .subscribe((estado) => this._enVivo.set(estado === 'SUBSCRIBED'));
  }

  /** Cierra la suscripción (se llama al salir de la zona privada: evita fugas de memoria). */
  public async detenerTiempoReal(): Promise<void> {
    if (this.canal) {
      await this.supabase.removeChannel(this.canal);
      this.canal = null;
      this._enVivo.set(false);
    }
  }

  /** Vacía el store al cerrar sesión (que el siguiente usuario no vea datos del anterior). */
  public limpiar(): void {
    this._gastos.set([]);
    this._categorias.set([]);
  }

  /**
   * Llega un cambio por WebSocket. El mensaje no trae el perfil ni la categoría "embebidos",
   * así que se vuelve a pedir esa fila a la API REST con su join y se actualiza el signal.
   */
  private async aplicarCambio(cambio: RealtimePostgresChangesPayload<Gasto>): Promise<void> {
    if (cambio.eventType === 'DELETE') {
      const id = (cambio.old as Partial<Gasto>).id;
      this._gastos.update((lista) => lista.filter((g) => g.id !== id));
      return;
    }
    try {
      const [fila] = await firstValueFrom(
        this.api.listar<Gasto>('gastos', { id: `eq.${cambio.new.id}`, select: SELECT_GASTO }),
      );
      if (fila) {
        this.insertarOActualizar(normalizar(fila));
      }
    } catch {
      // Si falla, el dato llegará con la siguiente carga: no se interrumpe al usuario.
    }
  }

  /** Sustituye el gasto si ya estaba o lo añade al principio (sin duplicados). */
  private insertarOActualizar(gasto: Gasto): void {
    this._gastos.update((lista) => {
      const sinEl = lista.filter((g) => g.id !== gasto.id);
      return [gasto, ...sinEl].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
    });
  }
}

/** La API devuelve numeric como número o texto según el caso: se asegura el tipo. */
function normalizar(gasto: Gasto): Gasto {
  return { ...gasto, importe: Number(gasto.importe), detalles: gasto.detalles ?? {} };
}
