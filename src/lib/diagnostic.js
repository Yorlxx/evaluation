import {
  DAYS,
  DAYS_SHORT,
  LEVELS,
  LEVEL_LIST,
  QUIZ,
  GROUP_GUIDANCE,
  LOGISTICS_ALERTS,
  SESSION_PLAN,
  TIME_SLOTS,
} from './constants';

export function resolveQuiz(answers = {}) {
  const detalle = QUIZ.map((question, index) => {
    const selectedIndex = Number.isInteger(answers[question.id]) ? answers[question.id] : null;
    const isCorrect = selectedIndex === question.correctIndex;

    return {
      id: question.id,
      numero: index + 1,
      tema: question.topic,
      pregunta: question.question,
      opciones: question.options,
      seleccion: selectedIndex,
      respuestaSeleccionada: selectedIndex === null ? null : question.options[selectedIndex],
      correcta: question.correctIndex,
      respuestaCorrecta: question.options[question.correctIndex],
      acierto: isCorrect,
    };
  });

  const puntaje = detalle.filter((item) => item.acierto).length;
  const nivel = levelFromScore(puntaje);

  return {
    puntaje,
    nivel,
    respuestas: {
      version: 1,
      total: QUIZ.length,
      detalle,
    },
  };
}

export function levelFromScore(score) {
  const value = Number(score) || 0;
  if (value <= 2) return LEVELS[0];
  if (value <= 4) return LEVELS[1];
  return LEVELS[2];
}

export function levelFromRecord(record) {
  const label = record?.nivel || '';
  if (label.startsWith('Nivel 0')) return LEVELS[0];
  if (label.startsWith('Nivel 1')) return LEVELS[1];
  if (label.startsWith('Nivel 2')) return LEVELS[2];
  return levelFromScore(record?.puntaje);
}

export function getBreakdown(record) {
  const raw = record?.respuestas;
  const list = Array.isArray(raw) ? raw : Array.isArray(raw?.detalle) ? raw.detalle : [];

  return list.map((item, index) => {
    const fallback = QUIZ[index] || QUIZ[0];
    const selectedIndex = Number.isInteger(item.seleccion)
      ? item.seleccion
      : Number.isInteger(item.selectedIndex)
        ? item.selectedIndex
        : null;
    const correctIndex = Number.isInteger(item.correcta)
      ? item.correcta
      : Number.isInteger(item.correctIndex)
        ? item.correctIndex
        : fallback.correctIndex;
    const isCorrect =
      typeof item.acierto === 'boolean'
        ? item.acierto
        : typeof item.esCorrecta === 'boolean'
          ? item.esCorrecta
          : selectedIndex === correctIndex;

    return {
      id: item.id || fallback.id,
      numero: item.numero || index + 1,
      tema: item.tema || item.topic || fallback.topic,
      pregunta: item.pregunta || item.question || fallback.question,
      seleccion: selectedIndex,
      respuestaSeleccionada:
        item.respuestaSeleccionada ||
        item.selectedText ||
        (selectedIndex === null ? null : fallback.options[selectedIndex] || null),
      correcta: correctIndex,
      respuestaCorrecta:
        item.respuestaCorrecta ||
        item.correctText ||
        fallback.options[correctIndex] ||
        null,
      acierto: isCorrect,
    };
  });
}

export function computeGroupStats(records = []) {
  const total = records.length;
  const scores = records.map((record) => Number(record.puntaje) || 0);
  const average = total ? scores.reduce((sum, score) => sum + score, 0) / total : 0;
  const counts = [0, 0, 0];

  records.forEach((record) => {
    const level = levelFromRecord(record);
    counts[level.level] += 1;
  });

  let predominantIndex = 0;
  counts.forEach((count, index) => {
    if (count > counts[predominantIndex]) predominantIndex = index;
  });

  const maxCount = counts[predominantIndex];
  const tiedLevels = counts
    .map((count, index) => ({ count, index }))
    .filter((item) => item.count === maxCount && item.count > 0);
  const isTie = tiedLevels.length > 1;

  if (isTie) {
    predominantIndex = levelFromScore(Math.round(average)).level;
  }

  const distribution = LEVEL_LIST.map((level) => ({
    ...level,
    count: counts[level.level],
    percent: total ? Math.round((counts[level.level] / total) * 100) : 0,
  }));

  return {
    total,
    meta: 3,
    average,
    averageDisplay: total ? average.toFixed(1) : '0.0',
    counts,
    distribution,
    isTie,
    predominantIndex,
    predominant: total ? LEVELS[predominantIndex] : null,
    predominantCount: total ? counts[predominantIndex] : 0,
  };
}

export function buildGroupRecommendation(records = []) {
  const stats = computeGroupStats(records);
  const level = stats.predominant ? stats.predominant.level : 0;
  const guidance = GROUP_GUIDANCE[level];
  const logisticsActions = [];
  const hasNoEquipment = records.some((record) => record.equipo === 'Sin equipo');
  const hasSharedEquipment = records.some((record) => record.equipo === 'PC/Laptop compartida');
  const hasNoInternet = records.some((record) => record.conexion_internet === 'Sin internet');
  const hasUnstableInternet = records.some(
    (record) => record.conexion_internet === 'Inestable / Solo datos móviles'
  );

  if (hasNoEquipment) logisticsActions.push(LOGISTICS_ALERTS.noEquipment);
  else if (hasSharedEquipment) logisticsActions.push(LOGISTICS_ALERTS.sharedEquipment);

  if (hasNoInternet) logisticsActions.push(LOGISTICS_ALERTS.noInternet);
  else if (hasUnstableInternet) logisticsActions.push(LOGISTICS_ALERTS.unstableInternet);

  if (
    records.length > 0 &&
    !hasNoEquipment &&
    !hasSharedEquipment &&
    !hasNoInternet &&
    !hasUnstableInternet
  ) {
    logisticsActions.push(LOGISTICS_ALERTS.goodConnectivity);
  }

  const sessions = SESSION_PLAN.map((session, index) => ({
    ...session,
    adjustment: guidance.sessionNotes[index],
    priority:
      (level === 0 && index <= 2) ||
      (level === 1 && (index === 2 || index === 3)) ||
      (level === 2 && index >= 3),
  }));

  return {
    stats,
    level: LEVELS[level],
    guidance,
    logisticsActions,
    sessions,
    partial: stats.total > 0 && stats.total < stats.meta,
    isEmpty: stats.total === 0,
  };
}

export function buildScheduleMatrix(records = []) {
  const total = records.length;
  const days = DAYS.map((day) => ({
    day,
    short: DAYS_SHORT[day],
    slots: TIME_SLOTS.map((slot) => {
      const students = records.filter((record) => {
        const recordDays = Array.isArray(record.disponibilidad_dias)
          ? record.disponibilidad_dias
          : [];
        const recordSlots = Array.isArray(record.disponibilidad_franjas)
          ? record.disponibilidad_franjas
          : [];
        return recordDays.includes(day) && recordSlots.includes(slot.value);
      });

      return {
        slot,
        students,
        count: students.length,
        coverage: total ? students.length / total : 0,
      };
    }),
  }));

  const options = [];
  days.forEach((day) => {
    day.slots.forEach((cell) => {
      if (cell.count > 0) {
        options.push({
          day: day.day,
          short: day.short,
          slot: cell.slot,
          students: cell.students,
          count: cell.count,
          coverage: cell.coverage,
        });
      }
    });
  });

  options.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    const dayDifference = DAYS.indexOf(a.day) - DAYS.indexOf(b.day);
    if (dayDifference !== 0) return dayDifference;
    return (
      TIME_SLOTS.findIndex((slot) => slot.value === a.slot.value) -
      TIME_SLOTS.findIndex((slot) => slot.value === b.slot.value)
    );
  });

  return { days, options, total, best: options[0] || null };
}

export function recordsForSlot(slot) {
  if (!slot?.students?.length) return 'Sin estudiantes disponibles';
  return slot.students.map((student) => student.nombre_completo).join(', ');
}

export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

const AVATAR_TONES = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
];

export function avatarTone(name = '') {
  const hash = name
    .split('')
    .reduce((accumulator, character) => accumulator + character.charCodeAt(0), 0);
  return AVATAR_TONES[hash % AVATAR_TONES.length];
}

export function formatDate(value, options = {}) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    ...options,
  }).format(date);
}

export function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function firstName(name = '') {
  return name.trim().split(/\s+/)[0] || '';
}

export function joinedDays(days = []) {
  return days.map((day) => DAYS_SHORT[day] || day).join(' · ');
}

export function rangeToPercent(score, total = QUIZ.length) {
  if (!total) return 0;
  return Math.round((Number(score) / total) * 100);
}
