import { Priority } from '../../types/index.ts';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export function PriorityBadge({ priority, size = 'sm', showDot = true }: PriorityBadgeProps) {
  const config = {
    HIGH: {
      label: 'High',
      bg: 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400 border-rose-500/20',
      dot: 'bg-rose-500',
    },
    MEDIUM: {
      label: 'Medium',
      bg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border-amber-500/20',
      dot: 'bg-amber-500',
    },
    LOW: {
      label: 'Low',
      bg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border-emerald-500/20',
      dot: 'bg-emerald-500',
    },
  }[priority] || {
    label: priority,
    bg: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    dot: 'bg-slate-500',
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${config.bg} ${sizeClasses} transition-colors`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />}
      {config.label}
    </span>
  );
}
