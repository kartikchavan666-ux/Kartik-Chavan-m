import React from 'react';
import { Calendar, Clock, AlertCircle, MoreVertical, Edit2, Trash2, Eye, Sparkles } from 'lucide-react';
import { Task } from '../../types/index.ts';
import { PriorityBadge } from './PriorityBadge.tsx';
import { CategoryBadge } from './CategoryBadge.tsx';
import { calculateDeadlineUrgency, getSmartScoreDetails } from '../../lib/smartPrioritization.ts';
import { useTasks } from '../../context/TaskContext.tsx';

interface TaskCardProps {
  task: Task;
  showSmartScore?: boolean;
}

export function TaskCard({ task, showSmartScore = false }: TaskCardProps) {
  const { toggleTaskComplete, openEditModal, setViewingTask, setDeletingTask } = useTasks();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const urgency = calculateDeadlineUrgency(task.due_date);
  const smart = getSmartScoreDetails(task);

  const formattedDueDate = React.useMemo(() => {
    if (!task.due_date) return null;
    const d = new Date(task.due_date);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: d.getHours() !== 0 || d.getMinutes() !== 0 ? '2-digit' : undefined,
      minute: d.getMinutes() !== 0 ? '2-digit' : undefined,
    });
  }, [task.due_date]);

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-75'
          : urgency.isOverdue
          ? 'bg-rose-50/30 dark:bg-rose-950/15 border-rose-200 dark:border-rose-900/40 hover:border-rose-300 dark:hover:border-rose-700/60 shadow-xs'
          : urgency.isDueToday
          ? 'bg-amber-50/20 dark:bg-amber-950/15 border-amber-200 dark:border-amber-900/40 hover:border-amber-300 dark:hover:border-amber-700/60 shadow-xs'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800/80 hover:shadow-md'
      }`}
    >
      {/* Left section: Checkbox & Content */}
      <div className="flex items-start gap-3.5 flex-1 min-w-0">
        <button
          type="button"
          onClick={() => toggleTaskComplete(task.id)}
          aria-label={task.completed ? 'Reopen task' : 'Mark task as complete'}
          className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 cursor-pointer ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-transparent'
          }`}
        >
          {task.completed && (
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3.5 8 6.5 11 12.5 4" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setViewingTask(task)}>
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`font-semibold text-sm transition-colors ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500 font-normal'
                  : 'text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
              }`}
            >
              {task.title}
            </h4>

            {showSmartScore && !task.completed && (
              <span
                title={`Smart Priority Score: ${smart.score} (Weight: ${smart.priorityWeight}x + Urgency: ${smart.urgencyScore})`}
                className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[10px] font-mono rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50"
              >
                <Sparkles size={10} />
                <span>Score {smart.score}</span>
              </span>
            )}
          </div>

          {task.description && (
            <p
              className={`mt-1 text-xs line-clamp-1 transition-colors ${
                task.completed ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Badges on mobile/tablet */}
          <div className="flex sm:hidden items-center gap-2 mt-2.5 flex-wrap">
            <PriorityBadge priority={task.priority} size="sm" />
            <CategoryBadge category={task.category} size="sm" />
            {formattedDueDate && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${
                  task.completed
                    ? 'text-slate-400 dark:text-slate-500'
                    : urgency.isOverdue
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                    : urgency.isDueToday
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                    : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {urgency.isOverdue ? <AlertCircle size={12} /> : <Clock size={12} />}
                <span>{urgency.urgencyLabel}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right section: Badges on desktop, due date, actions */}
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <PriorityBadge priority={task.priority} size="sm" />
        <CategoryBadge category={task.category} size="sm" />

        {/* Due date badge */}
        {formattedDueDate ? (
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border transition-colors ${
              task.completed
                ? 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-800'
                : urgency.isOverdue
                ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 font-semibold'
                : urgency.isDueToday
                ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 font-semibold'
                : 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700/60'
            }`}
          >
            {urgency.isOverdue ? (
              <AlertCircle size={13} className="text-rose-500 animate-pulse" />
            ) : (
              <Calendar size={13} />
            )}
            <span>{urgency.urgencyLabel}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-600 italic px-2">No due date</span>
        )}

        {/* Action Menu button */}
        <div className="relative">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            aria-label="Task options"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <MoreVertical size={16} />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={e => {
                  e.stopPropagation();
                  setMenuOpen(false);
                }}
              />
              <div className="absolute right-0 mt-1 w-36 py-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-30 animate-in fade-in zoom-in-95 duration-100 text-xs">
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setViewingTask(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors text-left cursor-pointer"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    openEditModal(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors text-left cursor-pointer"
                >
                  <Edit2 size={14} />
                  <span>Edit Task</span>
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setDeletingTask(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-left cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Delete Task</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile action bar */}
      <div className="flex sm:hidden items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => setViewingTask(task)}
          className="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded"
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => openEditModal(task)}
          className="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1 rounded"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setDeletingTask(task)}
          className="text-xs text-rose-600 dark:text-rose-400 px-2 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
