import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const VARIANTS = {
  error: {
    wrapper: 'border-rose-200 bg-rose-50 text-rose-800',
    icon: XCircle,
    iconClass: 'text-rose-500',
  },
  warning: {
    wrapper: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
  },
  success: {
    wrapper: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    icon: CheckCircle,
    iconClass: 'text-emerald-500',
  },
  info: {
    wrapper: 'border-sky-200 bg-sky-50 text-sky-800',
    icon: Info,
    iconClass: 'text-sky-500',
  },
};

export default function Alert({
  variant = 'info',
  title,
  children,
  action,
  className,
  compact = false,
}) {
  const config = VARIANTS[variant] || VARIANTS.info;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border animate-fade-in',
        compact ? 'px-3 py-2.5' : 'p-4',
        config.wrapper,
        className
      )}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', config.iconClass)} aria-hidden="true" />
      <div className="min-w-0 flex-1 text-sm">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn('leading-relaxed', title && 'mt-0.5')}>{children}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
