import { useMemo } from 'react';
import { SunMedium, Plus, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { useTasks } from '../context/TaskContext.tsx';
import { TaskCard } from '../components/tasks/TaskCard.tsx';

export function TodayPage() {
  const { todayTasks, openCreateModal } = useTasks();

  const formattedToday = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  const completedToday = todayTasks.filter(t => t.completed).length;
  const pendingToday = todayTasks.filter(t => !t.completed).length;
  const percentage = todayTasks.length === 0 ? 0 : Math.round((completedToday / todayTasks.length) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <SunMedium size={15} />
            <span>Today's Focus</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {formattedToday}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {pendingToday === 0 && todayTasks.length > 0
              ? '🎉 All tasks for today are completed! Great work!'
              : `${pendingToday} task${pendingToday === 1 ? '' : 's'} remaining to complete today.`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal(undefined, new Date().toISOString().split('T')[0])}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-md shadow-amber-600/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Task for Today</span>
        </button>
      </div>

      {/* Daily Progress Tracker */}
      {todayTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400">Daily Completion</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">{percentage}% ({completedToday}/{todayTasks.length})</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {todayTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <Calendar size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Your day is clear!
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You don't have any tasks scheduled for today. Take time to relax or add a new goal to tackle.
            </p>
            <button
              type="button"
              onClick={() => openCreateModal(undefined, new Date().toISOString().split('T')[0])}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-colors cursor-pointer"
            >
              Add Task for Today
            </button>
          </div>
        ) : (
          todayTasks.map(task => <TaskCard key={task.id} task={task} showSmartScore />)
        )}
      </div>
    </div>
  );
}
