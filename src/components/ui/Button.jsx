import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-55';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/30 active:scale-[0.99]',
  dark: 'bg-slate-950 text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800 active:scale-[0.99]',
  secondary:
    'bg-white text-slate-700 ring-1 ring-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 active:scale-[0.99]',
  soft: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:scale-[0.99]',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger:
    'bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 active:scale-[0.99]',
  dangerGhost: 'text-rose-600 hover:bg-rose-50',
};

const SIZES = {
  sm: 'h-9 px-3.5 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
  icon: 'h-10 w-10',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export { BASE as buttonBase, VARIANTS as buttonVariants };
