-- =============================================================================
-- GastoFlow · 01_esquema.sql
-- Tablas, seguridad (RLS), funciones y tiempo real.
-- Ejecutar UNA vez en Supabase → SQL Editor → New query → Run.
-- Es re-ejecutable: usa "if not exists" / "or replace" / "drop ... if exists".
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABLAS
-- -----------------------------------------------------------------------------

-- Perfil de cada persona: datos de negocio + ROL (base del RBAC).
-- Los usuarios con cuenta se crean solos al registrarse (trigger del apartado 3).
-- Los empleados de demostración (02_datos_demo.sql) existen solo como perfil.
create table if not exists public.perfiles (
  id           uuid primary key,
  email        text not null unique,
  nombre       text not null,
  departamento text not null default 'Sin asignar',
  rol          text not null default 'empleado' check (rol in ('admin', 'empleado')),
  creado_en    timestamptz not null default now()
);

-- Categorías de gasto con su límite mensual orientativo.
create table if not exists public.categorias (
  id             smallint generated always as identity primary key,
  nombre         text not null unique,
  icono          text not null default 'pricetag-outline',
  limite_mensual numeric(10, 2) not null check (limite_mensual > 0)
);

-- Gastos. "detalles" es un documento JSON (jsonb): la parte NoSQL del modelo,
-- con campos que cambian según la categoría (proveedor, kilómetros, método de pago...).
create table if not exists public.gastos (
  id             bigint generated always as identity primary key,
  empleado_id    uuid not null default auth.uid(),
  categoria_id   smallint not null,
  fecha          date not null,
  importe        numeric(10, 2) not null check (importe > 0 and importe <= 5000),
  descripcion    text not null check (char_length(descripcion) between 3 and 200),
  estado         text not null default 'pendiente'
                 check (estado in ('pendiente', 'aprobado', 'rechazado')),
  detalles       jsonb not null default '{}'::jsonb,
  motivo_rechazo text,
  revisado_por   uuid,
  revisado_en    timestamptz,
  creado_en      timestamptz not null default now(),
  -- Nombres explícitos: la API REST los usa para "embeber" el perfil en la consulta
  constraint gastos_empleado_fk  foreign key (empleado_id)  references public.perfiles (id) on delete cascade,
  constraint gastos_categoria_fk foreign key (categoria_id) references public.categorias (id),
  constraint gastos_revisor_fk   foreign key (revisado_por) references public.perfiles (id) on delete set null
);

create index if not exists gastos_empleado_idx on public.gastos (empleado_id);
create index if not exists gastos_estado_idx   on public.gastos (estado);
create index if not exists gastos_fecha_idx    on public.gastos (fecha desc);

-- -----------------------------------------------------------------------------
-- 2. FUNCIONES DE APOYO
-- -----------------------------------------------------------------------------

-- ¿El usuario que hace la petición es administrador?
-- security definer: se ejecuta con permisos del dueño para poder leer perfiles
-- sin que las propias políticas RLS de perfiles entren en bucle.
create or replace function public.es_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles where id = auth.uid() and rol = 'admin'
  );
$$;

-- Validación asíncrona del formulario de registro: ¿está libre este correo?
-- Se puede llamar sin sesión (rol anon) y solo devuelve true/false.
create or replace function public.email_disponible(p_email text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select not exists (
    select 1 from public.perfiles where email = lower(trim(p_email))
  );
$$;

revoke all on function public.email_disponible(text) from public;
grant execute on function public.email_disponible(text) to anon, authenticated;
grant execute on function public.es_admin() to authenticated;

-- -----------------------------------------------------------------------------
-- 3. TRIGGERS
-- -----------------------------------------------------------------------------

-- Al registrarse un usuario en Supabase Auth se crea su perfil con rol 'empleado'.
-- El nombre y el departamento llegan en los metadatos del signUp().
create or replace function public.crear_perfil_nuevo_usuario()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, email, nombre, departamento)
  values (
    new.id,
    lower(new.email),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'nombre'), ''), split_part(new.email, '@', 1)),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'departamento'), ''), 'Sin asignar')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil_nuevo_usuario();

-- Reglas de negocio que no dependen de la pantalla:
--  * la fecha no puede ser futura;
--  * un empleado siempre crea gastos en estado 'pendiente';
--  * solo administración cambia el estado, y queda registrado quién y cuándo.
-- (auth.uid() es null cuando se ejecuta desde el SQL Editor: así funciona la carga de demo.)
create or replace function public.gastos_reglas_negocio()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.fecha > current_date then
    raise exception 'La fecha del gasto no puede ser futura' using errcode = '23514';
  end if;

  if tg_op = 'INSERT' and auth.uid() is not null and not public.es_admin() then
    new.estado := 'pendiente';
    new.motivo_rechazo := null;
  end if;

  if tg_op = 'UPDATE' and new.estado is distinct from old.estado then
    if auth.uid() is not null and not public.es_admin() then
      raise exception 'Solo administración puede cambiar el estado de un gasto' using errcode = '42501';
    end if;
    new.revisado_por := coalesce(auth.uid(), new.revisado_por);
    new.revisado_en  := now();
    if new.estado <> 'rechazado' then
      new.motivo_rechazo := null;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists gastos_antes_de_guardar on public.gastos;
create trigger gastos_antes_de_guardar
  before insert or update on public.gastos
  for each row execute function public.gastos_reglas_negocio();

-- -----------------------------------------------------------------------------
-- 4. SEGURIDAD A NIVEL DE FILA (RLS)
-- La base de datos es la última barrera: aunque alguien se salte la interfaz,
-- un empleado solo puede leer y tocar SUS gastos.
-- -----------------------------------------------------------------------------

alter table public.perfiles   enable row level security;
alter table public.categorias enable row level security;
alter table public.gastos     enable row level security;

grant select, update on public.perfiles to authenticated;
grant select, insert, update, delete on public.categorias to authenticated;
grant select, insert, update, delete on public.gastos to authenticated;

-- perfiles
drop policy if exists "perfiles: ver el propio o admin" on public.perfiles;
create policy "perfiles: ver el propio o admin" on public.perfiles
  for select to authenticated
  using (id = auth.uid() or public.es_admin());

drop policy if exists "perfiles: solo admin modifica" on public.perfiles;
create policy "perfiles: solo admin modifica" on public.perfiles
  for update to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- categorias
drop policy if exists "categorias: lectura con sesion" on public.categorias;
create policy "categorias: lectura con sesion" on public.categorias
  for select to authenticated
  using (true);

drop policy if exists "categorias: admin gestiona" on public.categorias;
create policy "categorias: admin gestiona" on public.categorias
  for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- gastos
drop policy if exists "gastos: ver propios o admin" on public.gastos;
create policy "gastos: ver propios o admin" on public.gastos
  for select to authenticated
  using (empleado_id = auth.uid() or public.es_admin());

drop policy if exists "gastos: crear propios" on public.gastos;
create policy "gastos: crear propios" on public.gastos
  for insert to authenticated
  with check (empleado_id = auth.uid());

drop policy if exists "gastos: editar propios pendientes" on public.gastos;
create policy "gastos: editar propios pendientes" on public.gastos
  for update to authenticated
  using (empleado_id = auth.uid() and estado = 'pendiente')
  with check (empleado_id = auth.uid() and estado = 'pendiente');

drop policy if exists "gastos: admin revisa" on public.gastos;
create policy "gastos: admin revisa" on public.gastos
  for update to authenticated
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists "gastos: borrar propios pendientes" on public.gastos;
create policy "gastos: borrar propios pendientes" on public.gastos
  for delete to authenticated
  using (empleado_id = auth.uid() and estado = 'pendiente');

-- -----------------------------------------------------------------------------
-- 5. TIEMPO REAL
-- Publica los cambios de "gastos" por WebSocket (Supabase Realtime).
-- Respeta RLS: cada usuario solo recibe los cambios de las filas que puede ver.
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'gastos'
  ) then
    alter publication supabase_realtime add table public.gastos;
  end if;
end;
$$;
