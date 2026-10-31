-- =============================================================================
-- GastoFlow · 02_datos_demo.sql
-- Datos SINTÉTICOS para probar la app (personas y empresas ficticias).
-- Ejecutar DESPUÉS de crear los dos usuarios de acceso en Authentication → Users:
--   admin@gastoflow.dev  y  empleado@gastoflow.dev
-- Re-ejecutable: borra y vuelve a crear solo los datos marcados como demo.
-- =============================================================================

-- 1. Categorías
insert into public.categorias (nombre, icono, limite_mensual) values
  ('Desplazamiento',       'car-outline',        600),
  ('Dietas',               'restaurant-outline', 400),
  ('Alojamiento',          'bed-outline',        900),
  ('Material de oficina',  'cube-outline',       300),
  ('Formación',            'school-outline',    1000),
  ('Software y licencias', 'laptop-outline',     500)
on conflict (nombre) do nothing;

-- 2. Los dos usuarios de acceso: nombre, departamento y ROL
update public.perfiles set nombre = 'Laura Martín', departamento = 'Administración', rol = 'admin'
where email = 'admin@gastoflow.dev';

update public.perfiles set nombre = 'Carlos Ruiz', departamento = 'Comercial', rol = 'empleado'
where email = 'empleado@gastoflow.dev';

-- 3. Empleados ficticios (solo perfil, sin cuenta de acceso)
insert into public.perfiles (id, email, nombre, departamento, rol) values
  ('00000000-0000-4000-8000-000000000001', 'ana.lopez@demo.gastoflow.dev',     'Ana López',      'Comercial',   'empleado'),
  ('00000000-0000-4000-8000-000000000002', 'david.santos@demo.gastoflow.dev',  'David Santos',   'Marketing',   'empleado'),
  ('00000000-0000-4000-8000-000000000003', 'elena.garcia@demo.gastoflow.dev',  'Elena García',   'IT',          'empleado'),
  ('00000000-0000-4000-8000-000000000004', 'marcos.diaz@demo.gastoflow.dev',   'Marcos Díaz',    'Operaciones', 'empleado'),
  ('00000000-0000-4000-8000-000000000005', 'lucia.moreno@demo.gastoflow.dev',  'Lucía Moreno',   'Marketing',   'empleado'),
  ('00000000-0000-4000-8000-000000000006', 'pablo.navarro@demo.gastoflow.dev', 'Pablo Navarro',  'IT',          'empleado'),
  ('00000000-0000-4000-8000-000000000007', 'sara.romero@demo.gastoflow.dev',   'Sara Romero',    'Operaciones', 'empleado')
on conflict (id) do nothing;

-- 4. Gastos de demo: ~12 por empleado en los últimos 6 meses (semilla fija = mismos datos)
delete from public.gastos where detalles ->> 'demo' = 'true';

select setseed(0.42);

with base as (
  select
    p.id as empleado_id,
    g as n,
    (array(select id from public.categorias order by id))[1 + floor(random() * 6)::int] as categoria_id,
    current_date - floor(random() * 180)::int as fecha,
    random() as r_importe,
    random() as r_estado,
    random() as r_texto,
    random() as r_pago
  from public.perfiles p
  cross join generate_series(1, 12) as g
  where p.rol = 'empleado'
)
insert into public.gastos
  (empleado_id, categoria_id, fecha, importe, descripcion, estado, detalles, motivo_rechazo, revisado_por, revisado_en)
select
  b.empleado_id,
  b.categoria_id,
  b.fecha,
  round((case c.nombre
           when 'Alojamiento' then 60 + b.r_importe * 240
           when 'Formación'   then 40 + b.r_importe * 360
           when 'Desplazamiento' then 8 + b.r_importe * 160
           else 5 + b.r_importe * 120
         end)::numeric, 2),
  case c.nombre
    when 'Desplazamiento' then (array['Tren a reunión con cliente', 'Taxi al aeropuerto', 'Kilometraje visita comercial', 'Billete de avión a feria'])[1 + floor(b.r_texto * 4)::int]
    when 'Dietas' then (array['Comida con cliente', 'Cena en viaje de trabajo', 'Desayuno de equipo', 'Comida en jornada de formación'])[1 + floor(b.r_texto * 4)::int]
    when 'Alojamiento' then (array['Hotel en Barcelona (feria)', 'Hotel en Valencia (cliente)', 'Hotel en Sevilla (congreso)'])[1 + floor(b.r_texto * 3)::int]
    when 'Material de oficina' then (array['Teclado y ratón', 'Cuadernos y bolígrafos', 'Cable HDMI y adaptador', 'Auriculares para llamadas'])[1 + floor(b.r_texto * 4)::int]
    when 'Formación' then (array['Curso de Angular avanzado', 'Certificación de inglés', 'Taller de ventas', 'Curso de Excel'])[1 + floor(b.r_texto * 4)::int]
    else (array['Licencia de diseño (mensual)', 'Suscripción de almacenamiento', 'Plugin para el IDE'])[1 + floor(b.r_texto * 3)::int]
  end,
  e.estado,
  jsonb_build_object(
    'demo', true,
    'proveedor', (array['Renfe', 'Iberia', 'Cabify', 'Amazon Business', 'Udemy', 'NH Hoteles', 'Repsol', 'El Corte Inglés'])[1 + floor(b.r_texto * 8)::int],
    'metodo_pago', (array['Tarjeta de empresa', 'Efectivo', 'Transferencia'])[1 + floor(b.r_pago * 3)::int]
  ) || case when c.nombre = 'Desplazamiento'
            then jsonb_build_object('kilometros', 10 + floor(b.r_importe * 300)::int)
            else '{}'::jsonb end,
  case when e.estado = 'rechazado' then 'Falta el justificante del gasto' end,
  case when e.estado <> 'pendiente' then (select id from public.perfiles where rol = 'admin' limit 1) end,
  case when e.estado <> 'pendiente' then b.fecha + 2 end
from base b
join public.categorias c on c.id = b.categoria_id
cross join lateral (
  select case
           when b.fecha > current_date - 20 then 'pendiente'
           when b.r_estado < 0.82 then 'aprobado'
           else 'rechazado'
         end as estado
) e;

-- Comprobación rápida (debe salir una fila por estado)
select estado, count(*) as gastos, sum(importe) as total from public.gastos group by estado order by estado;
