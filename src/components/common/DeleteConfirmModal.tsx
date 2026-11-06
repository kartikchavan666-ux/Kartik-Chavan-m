import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext.tsx';

export function DeleteConfirmModal() {
  const { deletingTask, setDeletingTask, confirmDeleteTask } = useTasks();

  if (!deletingTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} />
          </div>

          <div className="flex-1">
            <h3 id="delete-dialog-title" className="text-base font-bold text-slate-900 dark:text-white">
              Delete Task Permanently?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-200">"{deletingTask.title}"</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeletingTask(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDeleteTask}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md shadow-rose-600/20 active:scale-98 transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
}
