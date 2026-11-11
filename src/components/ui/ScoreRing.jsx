import { useEffect, useId, useState } from 'react';
import { cn } from '../../lib/utils';

export default function ScoreRing({
  score = 0,
  total = 6,
  level,
  size = 180,
  strokeWidth = 11,
  className,
  children,
}) {
  const gradientId = useId().replace(/:/g, '');
  const [mounted, setMounted] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = total ? Math.min(Math.max(score / total, 0), 1) : 0;
  const offset = circumference * (1 - percent);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  const from = level?.colors?.hexFrom || '#6366f1';
  const to = level?.colors?.hexTo || '#0ea5e9';

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e9edf5"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children || (
          <>
            <span className="text-4xl font-extrabold tracking-tight text-slate-950">
              {score}
              <span className="text-lg font-bold text-slate-400">/{total}</span>
            </span>
            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              aciertos
            </span>
          </>
        )}
      </div>
    </div>
  );
}
