import { X, Calendar, Clock, CheckCircle2, RotateCcw, Edit2, Trash2, Sparkles, Folder, Flag } from 'lucide-react';
import { useTasks } from '../../context/TaskContext.tsx';
import { PriorityBadge } from '../tasks/PriorityBadge.tsx';
import { CategoryBadge } from '../tasks/CategoryBadge.tsx';
import { getSmartScoreDetails, calculateDeadlineUrgency } from '../../lib/smartPrioritization.ts';

export function TaskDetailsModal() {
  const { viewingTask, setViewingTask, openEditModal, setDeletingTask, toggleTaskComplete } = useTasks();

  if (!viewingTask) return null;

  const urgency = calculateDeadlineUrgency(viewingTask.due_date);
  const smart = getSmartScoreDetails(viewingTask);

  const formattedDueDate = viewingTask.due_date
    ? new Date(viewingTask.due_date).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'No due date set';

  const formattedCreatedAt = new Date(viewingTask.created_at).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={viewingTask.priority} size="md" />
            <CategoryBadge category={viewingTask.category} size="md" />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                const current = viewingTask;
                setViewingTask(null);
                openEditModal(current);
              }}
              title="Edit Task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                const current = viewingTask;
                setViewingTask(null);
                setDeletingTask(current);
              }}
              title="Delete Task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewingTask(null)}
              aria-label="Close dialog"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h2 id="details-title" className={`text-xl font-bold ${viewingTask.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
              {viewingTask.title}
            </h2>

            {viewingTask.description ? (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {viewingTask.description}
              </p>
            ) : (
              <p className="mt-3 text-sm italic text-slate-400 dark:text-slate-500">
                No description provided.
              </p>
            )}
          </div>

          {/* Smart Score Pill */}
          {!viewingTask.completed && (
            <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" />
                <div>
                  <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    Smart Priority Score: {smart.score} / 100
                  </div>
                  <div className="text-[11px] text-indigo-700/80 dark:text-indigo-400">
                    Priority Weight: {smart.priorityWeight}x ({smart.priorityWeight * 15} pts) + Deadline Urgency ({smart.urgencyScore} pts)
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                {urgency.urgencyLabel}
              </span>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 dark:text-slate-500 block mb-1">Due Date</span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <Calendar size={13} className="text-indigo-500" />
                <span>{formattedDueDate}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 dark:text-slate-500 block mb-1">Status</span>
              <div className="flex items-center gap-1.5 font-semibold">
                {viewingTask.completed ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Completed
                  </span>
                ) : urgency.isOverdue ? (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <Clock size={13} /> Overdue
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Clock size={13} /> In Progress
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 dark:text-slate-500 block mb-1">Created At</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{formattedCreatedAt}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 dark:text-slate-500 block mb-1">Category &amp; Priority</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {viewingTask.category} &bull; {viewingTask.priority}
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => toggleTaskComplete(viewingTask.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewingTask.completed
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
              }`}
            >
              {viewingTask.completed ? (
                <>
                  <RotateCcw size={14} />
                  <span>Reopen Task</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>Mark as Completed</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setViewingTask(null)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
