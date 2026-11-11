import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Spinner({ className, label = 'Cargando' }) {
  return (
    <span className="inline-flex items-center gap-2" role="status">
      <Loader2 className={cn('h-5 w-5 animate-spin text-indigo-600', className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
