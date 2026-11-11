import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Lock, X } from 'lucide-react';
import { ADMIN_PIN } from '../../lib/constants';
import { useLockBodyScroll } from '../../lib/useLockBodyScroll';

export default function AdminLoginModal({ open, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const inputRef = useRef(null);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    setPin('');
    setError('');
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (pin === ADMIN_PIN) {
      setError('');
      onSuccess();
      return;
    }
    setError('PIN incorrecto. Verifica el código e inténtalo de nuevo.');
    setAttempt((value) => value + 1);
    inputRef.current?.select();
  };

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-slate-950/55 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        className="relative w-full max-w-md animate-scale-in overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-white/30"
      >
        <div className="relative overflow-hidden bg-slate-950 px-6 pb-8 pt-6 text-white sm:px-8">
          <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-indigo-500/30 blur-3xl" aria-hidden="true" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="Cerrar acceso docente"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-indigo-200 ring-1 ring-white/10">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 id="admin-login-title" className="relative mt-4 text-xl font-extrabold tracking-tight">
            Acceso Docente
          </h2>
          <p className="relative mt-1.5 max-w-xs text-xs leading-relaxed text-slate-400">
            Ingresa el PIN para abrir el reporte maestro, las respuestas y la matriz de horarios.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8">
          <label htmlFor="admin-pin" className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
            PIN de acceso
          </label>
          <div key={attempt} className={error ? 'animate-shake' : undefined}>
            <input
              ref={inputRef}
              id="admin-pin"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              value={pin}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, '').slice(0, 4);
                setPin(value);
                if (error) setError('');
              }}
              placeholder="••••"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'admin-pin-error' : undefined}
              className={`mt-2 h-14 w-full rounded-2xl border bg-slate-50/70 text-center font-mono text-2xl font-bold tracking-[0.65em] text-slate-900 placeholder:text-slate-300 transition focus:bg-white focus:ring-4 ${
                error
                  ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
                  : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'
              }`}
            />
          </div>
          <div className="min-h-5">
            {error ? (
              <p id="admin-pin-error" className="mt-1.5 text-[11px] font-semibold text-rose-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={pin.length !== 4}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Ingresar al panel
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
