import { useMemo } from 'react';
import { CalendarDays, Plus, Clock, AlertCircle } from 'lucide-react';
import { useTasks } from '../context/TaskContext.tsx';
import { TaskCard } from '../components/tasks/TaskCard.tsx';
import { calculateDeadlineUrgency } from '../lib/smartPrioritization.ts';

export function UpcomingPage() {
  const { tasks, openCreateModal } = useTasks();

  const groups = useMemo(() => {
    const tomorrowList: typeof tasks = [];
    const thisWeekList: typeof tasks = [];
    const nextWeekList: typeof tasks = [];
    const laterList: typeof tasks = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    tasks.forEach(t => {
      if (t.completed || !t.due_date) return;
      const dueTime = new Date(t.due_date).getTime();
      const diffDays = Math.ceil((dueTime - todayStart) / 86400000);

      if (diffDays <= 0) return; // skip today or overdue here

      if (diffDays === 1) {
        tomorrowList.push(t);
      } else if (diffDays <= 7) {
        thisWeekList.push(t);
      } else if (diffDays <= 14) {
        nextWeekList.push(t);
      } else {
        laterList.push(t);
      }
    });

    return [
      { title: 'Tomorrow', tasks: tomorrowList },
      { title: 'This Week', tasks: thisWeekList },
      { title: 'Next Week', tasks: nextWeekList },
      { title: 'Later', tasks: laterList },
    ];
  }, [tasks]);

  const totalUpcoming = groups.reduce((acc, g) => acc + g.tasks.length, 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays size={24} className="text-violet-600 dark:text-violet-400" />
            <span>Upcoming Deadlines</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Chronological roadmap of all upcoming commitments across your projects
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal()}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-md shadow-violet-600/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Task</span>
        </button>
      </div>

      {totalUpcoming === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <Clock size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No upcoming deadlines scheduled
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You don't have tasks scheduled with future deadlines. Plan ahead by adding target dates to your tasks.
          </p>
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl transition-colors cursor-pointer"
          >
            Schedule a Task
          </button>
        </div>
      ) : (
        groups.map(group => {
          if (group.tasks.length === 0) return null;
          return (
            <div key={group.title} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {group.title}
                </h3>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {group.tasks.length} task{group.tasks.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-2.5">
                {group.tasks.map(task => (
                  <TaskCard key={task.id} task={task} showSmartScore />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
