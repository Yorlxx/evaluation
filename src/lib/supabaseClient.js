/*
 * ============================================================================
 * JAVALAB · SQL COMPLETO PARA SUPABASE
 * Ejecutar en Supabase > SQL Editor (también disponible en supabase/schema.sql)
 * ============================================================================
 *
 * create extension if not exists pgcrypto;
 *
 * create table if not exists public.respuestas_diagnostico (
 *   id uuid primary key default gen_random_uuid(),
 *   created_at timestamptz not null default now(),
 *   nombre_completo text not null
 *     check (char_length(btrim(nombre_completo)) between 3 and 120),
 *   grado text not null
 *     check (grado in ('4to de secundaria', '5to de secundaria')),
 *   disponibilidad_dias text[] not null default '{}'
 *     check (
 *       coalesce(array_length(disponibilidad_dias, 1), 0) >= 1
 *       and disponibilidad_dias <@ array['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']::text[]
 *     ),
 *   disponibilidad_franjas text[] not null default '{}'
 *     check (
 *       coalesce(array_length(disponibilidad_franjas, 1), 0) >= 1
 *       and disponibilidad_franjas <@ array['Mañana','Tarde','Noche']::text[]
 *     ),
 *   disponibilidad_detalle text,
 *   equipo text not null
 *     check (equipo in ('PC/Laptop propia', 'PC/Laptop compartida', 'Sin equipo')),
 *   conexion_internet text not null
 *     check (conexion_internet in ('Estable', 'Inestable / Solo datos móviles', 'Sin internet')),
 *   experiencia_previa text not null
 *     check (experiencia_previa in (
 *       'Nunca he programado',
 *       'Nociones en Scratch o pseudocódigo',
 *       'Programación previa (Java, Python, C++...)'
 *     )),
 *   experiencia_detalle text,
 *   puntaje smallint not null check (puntaje between 0 and 6),
 *   nivel text not null
 *     check (nivel in ('Nivel 0 - Desde Cero', 'Nivel 1 - Intermedio', 'Nivel 2 - Avanzado')),
 *   respuestas jsonb not null default '{}'::jsonb
 *     check (jsonb_typeof(respuestas) = 'object')
 * );
 *
 * comment on table public.respuestas_diagnostico is
 *   'Diagnósticos completados por estudiantes del programa de Java.';
 *
 * create index if not exists respuestas_diagnostico_created_at_idx
 *   on public.respuestas_diagnostico (created_at desc);
 * create index if not exists respuestas_diagnostico_nivel_idx
 *   on public.respuestas_diagnostico (nivel);
 * create index if not exists respuestas_diagnostico_puntaje_idx
 *   on public.respuestas_diagnostico (puntaje);
 *
 * -- RLS para la demostración con la clave anon. En producción, reemplazar
 * -- estas políticas por autenticación real o RPC protegidas.
 * alter table public.respuestas_diagnostico enable row level security;
 *
 * drop policy if exists "diagnostico_insert_anon" on public.respuestas_diagnostico;
 * drop policy if exists "diagnostico_select_anon" on public.respuestas_diagnostico;
 * drop policy if exists "diagnostico_delete_anon" on public.respuestas_diagnostico;
 *
 * create policy "diagnostico_insert_anon" on public.respuestas_diagnostico
 *   for insert to anon, authenticated with check (true);
 * create policy "diagnostico_select_anon" on public.respuestas_diagnostico
 *   for select to anon, authenticated using (true);
 * create policy "diagnostico_delete_anon" on public.respuestas_diagnostico
 *   for delete to anon, authenticated using (true);
 *
 * grant usage on schema public to anon, authenticated;
 * grant select, insert, delete on public.respuestas_diagnostico to anon, authenticated;
 *
 * ============================================================================
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = String(process.env.REACT_APP_SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = String(process.env.REACT_APP_SUPABASE_ANON_KEY || '').trim();
const looksLikeUrl = /^https?:\/\/.+/i.test(SUPABASE_URL);

export const TABLE_NAME = 'respuestas_diagnostico';
export const isSupabaseConfigured = Boolean(looksLikeUrl && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

export function friendlifySupabaseError(error) {
  const message = error?.message || '';
  const code = error?.code || '';

  if (code === '42P01' || /relation .* does not exist|no existe/i.test(message)) {
    return 'No encontramos la tabla "respuestas_diagnostico". Ejecuta el SQL de supabase/schema.sql en el SQL Editor de Supabase.';
  }

  if (code === '42501' || /row-level security|rls/i.test(message)) {
    return 'Las políticas de seguridad (RLS) bloquean esta operación. Revisa las políticas incluidas en supabase/schema.sql.';
  }

  if (code === 'PGRST205' || /could not find the table/i.test(message)) {
    return 'Supabase no encuentra la tabla del diagnóstico. Verifica que el SQL se haya ejecutado en el proyecto correcto.';
  }

  if (/failed to fetch|networkerror|load failed/i.test(message)) {
    return 'No se pudo conectar con Supabase. Revisa la URL, la clave anon y tu conexión a internet.';
  }

  if (/invalid api key|jwt/i.test(message)) {
    return 'La clave anon de Supabase no es válida. Revisa REACT_APP_SUPABASE_ANON_KEY en tu archivo .env.';
  }

  return message || 'Ocurrió un error inesperado al comunicarse con Supabase.';
}
