import { Briefcase, User, GraduationCap, FolderKanban } from 'lucide-react';
import { Category } from '../../types/index.ts';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const config = {
    Work: {
      icon: Briefcase,
      label: 'Work',
      classes: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40',
    },
    Personal: {
      icon: User,
      label: 'Personal',
      classes: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40',
    },
    Study: {
      icon: GraduationCap,
      label: 'Study',
      classes: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40',
    },
    Projects: {
      icon: FolderKanban,
      label: 'Projects',
      classes: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800/40',
    },
  }[category] || {
    icon: FolderKanban,
    label: category,
    classes: 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800',
  };

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md font-medium border ${config.classes} ${sizeClasses}`}>
      <Icon size={iconSize} className="shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
