import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useLockBodyScroll } from '../../lib/useLockBodyScroll';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Eliminar',
  onConfirm,
  onCancel,
  loading = false,
  error = '',
}) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-slate-950/60 backdrop-blur-sm"
        onClick={() => {
          if (!loading) onCancel();
        }}
        aria-hidden="true"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative w-full max-w-md animate-scale-in rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-white/20"
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 id="confirm-title" className="mt-4 text-lg font-extrabold tracking-tight text-slate-950">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>

        {error ? (
          <Alert variant="error" className="mt-4" compact>
            {error}
          </Alert>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
