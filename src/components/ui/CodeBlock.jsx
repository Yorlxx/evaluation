import { cn } from '../../lib/utils';

export default function CodeBlock({ code, label = 'Java', className }) {
  if (!code) return null;

  return (
    <div
      className={cn(
        'mt-4 overflow-hidden rounded-xl border border-slate-800/70 bg-slate-950 shadow-inner',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-rose-400/80" />
          <span className="h-2 w-2 rounded-full bg-amber-400/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
        </div>
        <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-slate-200 sm:text-[12.5px]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
