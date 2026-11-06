import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, Folder, Sparkles } from 'lucide-react';
import { Priority, Category } from '../../types/index.ts';
import { useTasks } from '../../context/TaskContext.tsx';

export function TaskModal() {
  const {
    isTaskModalOpen,
    closeTaskModal,
    taskToEdit,
    createTask,
    updateTask,
    defaultCategoryForNew,
    defaultDueDateForNew,
  } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [category, setCategory] = useState<Category>('Work');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('18:00');
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      if (taskToEdit.due_date) {
        const d = new Date(taskToEdit.due_date);
        setDueDate(d.toISOString().split('T')[0]);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        setDueTime(`${hh}:${mm}`);
      } else {
        setDueDate('');
        setDueTime('18:00');
      }
    } else {
      // Create mode
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setCategory(defaultCategoryForNew || 'Work');

      if (defaultDueDateForNew) {
        setDueDate(defaultDueDateForNew);
      } else {
        // default to today
        const now = new Date();
        setDueDate(now.toISOString().split('T')[0]);
      }
      setDueTime('18:00');
    }
    setErrors({});
  }, [taskToEdit, isTaskModalOpen, defaultCategoryForNew, defaultDueDateForNew]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    setIsSubmitting(true);

    let combinedDueDate: string | null = null;
    if (dueDate) {
      try {
        const [hours, minutes] = dueTime.split(':').map(Number);
        const [year, month, day] = dueDate.split('-').map(Number);
        const d = new Date(year, month - 1, day, hours || 18, minutes || 0);
        combinedDueDate = d.toISOString();
      } catch (err) {
        combinedDueDate = new Date(dueDate).toISOString();
      }
    }

    try {
      if (taskToEdit) {
        await updateTask(taskToEdit.id, {
          title: title.trim(),
          description: description.trim(),
          priority,
          category,
          due_date: combinedDueDate,
        });
      } else {
        await createTask({
          title: title.trim(),
          description: description.trim(),
          priority,
          category,
          due_date: combinedDueDate,
          completed: false,
        });
      }
      closeTaskModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <h3 id="modal-title" className="text-base font-bold text-slate-900 dark:text-white">
              {taskToEdit ? 'Edit Task' : 'Create New Task'}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeTaskModal}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              required
              autoFocus
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              placeholder="e.g., Deliver high-fidelity Figma components"
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-colors ${
                errors.title ? 'border-rose-500 dark:border-rose-500' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500 font-medium">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add key deliverables, acceptance criteria, or links..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none transition-colors"
            />
          </div>

          {/* Priority & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority Dropdown */}
            <div>
              <label htmlFor="task-priority" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                <Flag size={13} className="text-indigo-500" />
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="HIGH">🔴 High (Top Priority)</option>
                <option value="MEDIUM">🟡 Medium (Normal Priority)</option>
                <option value="LOW">🟢 Low (Lower Priority)</option>
              </select>
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="task-category" className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                <Folder size={13} className="text-violet-500" />
                Category
              </label>
              <select
                id="task-category"
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Work">💼 Work</option>
                <option value="Personal">👤 Personal</option>
                <option value="Study">🎓 Study</option>
                <option value="Projects">🚀 Projects</option>
              </select>
            </div>
          </div>

          {/* Due Date & Time */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              <Calendar size={13} className="text-indigo-500" />
              Due Date &amp; Time
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="time"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                disabled={!dueDate}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
