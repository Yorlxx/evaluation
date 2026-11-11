import { isSupabaseConfigured, supabase, TABLE_NAME, friendlifySupabaseError } from './supabaseClient';
import { DEMO_STUDENTS, QUIZ } from './constants';
import { resolveQuiz } from './diagnostic';

const LOCAL_KEY = 'javalab:diagnosticos:v1';

function safeJson(value, fallback = {}) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeRecord(record) {
  return {
    ...record,
    puntaje: Number(record?.puntaje) || 0,
    disponibilidad_dias: Array.isArray(record?.disponibilidad_dias)
      ? record.disponibilidad_dias
      : [],
    disponibilidad_franjas: Array.isArray(record?.disponibilidad_franjas)
      ? record.disponibilidad_franjas
      : [],
    respuestas: safeJson(record?.respuestas, { version: 1, total: QUIZ.length, detalle: [] }),
  };
}

function readLocalRecords() {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LOCAL_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeRecord).sort(sortNewest);
  } catch {
    return [];
  }
}

function writeLocalRecords(records) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(records.map(normalizeRecord)));
}

function sortNewest(a, b) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function guardarDiagnostico(payload) {
  if (!isSupabaseConfigured) {
    const record = normalizeRecord({
      ...payload,
      id: createId(),
      created_at: new Date().toISOString(),
    });
    const records = readLocalRecords();
    writeLocalRecords([record, ...records]);
    return { data: record, source: 'local' };
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(friendlifySupabaseError(error));
  }

  return { data: normalizeRecord(data), source: 'supabase' };
}

export async function listarDiagnosticos() {
  if (!isSupabaseConfigured) {
    return { data: readLocalRecords(), source: 'local' };
  }

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(friendlifySupabaseError(error));
  }

  return { data: (data || []).map(normalizeRecord), source: 'supabase' };
}

export async function eliminarDiagnostico(id) {
  if (!isSupabaseConfigured) {
    const records = readLocalRecords().filter((record) => record.id !== id);
    writeLocalRecords(records);
    return { source: 'local' };
  }

  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id);

  if (error) {
    throw new Error(friendlifySupabaseError(error));
  }

  return { source: 'supabase' };
}

export async function cargarDatosDemo() {
  if (isSupabaseConfigured) {
    throw new Error(
      'Los datos de ejemplo solo están disponibles en modo local. En Supabase, completa el diagnóstico desde la vista del estudiante.'
    );
  }

  const existing = readLocalRecords();
  if (existing.length > 0) {
    return { data: existing, source: 'local' };
  }

  const now = Date.now();
  const records = DEMO_STUDENTS.map((student, index) => {
    const quiz = resolveQuiz(student.answers);
    return normalizeRecord({
      id: createId(),
      created_at: new Date(now - student.daysAgo * 24 * 60 * 60 * 1000 - index * 18 * 60 * 1000).toISOString(),
      nombre_completo: student.nombre_completo,
      grado: student.grado,
      disponibilidad_dias: student.disponibilidad_dias,
      disponibilidad_franjas: student.disponibilidad_franjas,
      disponibilidad_detalle: student.disponibilidad_detalle,
      equipo: student.equipo,
      conexion_internet: student.conexion_internet,
      experiencia_previa: student.experiencia_previa,
      experiencia_detalle: student.experiencia_detalle,
      puntaje: quiz.puntaje,
      nivel: quiz.nivel.label,
      respuestas: quiz.respuestas,
    });
  }).sort(sortNewest);

  writeLocalRecords(records);
  return { data: records, source: 'local' };
}
