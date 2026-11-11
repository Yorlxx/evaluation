export const RESULT_STORAGE_KEY = 'javalab:ultimo-resultado';

export function saveLastResult(result) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
  } catch {
    // La navegación por estado sigue funcionando aunque el almacenamiento esté bloqueado.
  }
}

export function readLastResult() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(RESULT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
