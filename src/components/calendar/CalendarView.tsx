import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Clock } from 'lucide-react';
import { Task } from '../../types/index.ts';
import { useTasks } from '../../context/TaskContext.tsx';

type CalendarMode = 'month' | 'week' | 'day';

export function CalendarView() {
  const { tasks, setViewingTask, openCreateModal } = useTasks();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [mode, setMode] = useState<CalendarMode>('month');

  const today = useMemo(() => new Date(), []);

  // Navigation handlers
  const handlePrev = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (mode === 'month') d.setMonth(d.getMonth() - 1);
      else if (mode === 'week') d.setDate(d.getDate() - 7);
      else d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (mode === 'month') d.setMonth(d.getMonth() + 1);
      else if (mode === 'week') d.setDate(d.getDate() + 7);
      else d.setDate(d.getDate() + 1);
      return d;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Header Title
  const headerTitle = useMemo(() => {
    if (mode === 'month') {
      return currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }
    if (mode === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
      startOfWeek.setDate(diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${endOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, [currentDate, mode]);

  // Tasks map by YYYY-MM-DD
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach(t => {
      if (!t.due_date) return;
      const key = t.due_date.split('T')[0];
      const list = map.get(key) || [];
      list.push(t);
      map.set(key, list);
    });
    return map;
  }, [tasks]);

  // Month View Grid Generation
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 0 = Sunday, 1 = Monday
    let startDayOfWeek = firstDay.getDay();
    // Normalize to Monday start: 0 = Mon, 6 = Sun
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days: { date: Date; dateStr: string; isCurrentMonth: boolean; isToday: boolean }[] = [];

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDay - i);
      const str = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dateStr: str,
        isCurrentMonth: false,
        isToday: str === today.toISOString().split('T')[0],
      });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const d = new Date(year, month, i);
      const str = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dateStr: str,
        isCurrentMonth: true,
        isToday: str === today.toISOString().split('T')[0],
      });
    }

    // Next month filler days to complete grid (multiples of 7)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        const str = d.toISOString().split('T')[0];
        days.push({
          date: d,
          dateStr: str,
          isCurrentMonth: false,
          isToday: str === today.toISOString().split('T')[0],
        });
      }
    }

    return days;
  }, [currentDate, today]);

  // Week View Days Generation
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const days: { date: Date; dateStr: string; isToday: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const str = d.toISOString().split('T')[0];
      days.push({
        date: d,
        dateStr: str,
        isToday: str === today.toISOString().split('T')[0],
      });
    }
    return days;
  }, [currentDate, today]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Calendar Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-0.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous range"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next range"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {headerTitle}
          </h3>
        </div>

        {/* View mode toggle (Month | Week | Day) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-0.5">
            {(['month', 'week', 'day'] as CalendarMode[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  mode === m
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => openCreateModal(undefined, currentDate.toISOString().split('T')[0])}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {mode === 'month' && (
        <div className="flex-1 flex flex-col min-h-[500px]">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-center py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/60">
            {monthDays.map(item => {
              const dayTasks = tasksByDate.get(item.dateStr) || [];
              return (
                <div
                  key={item.dateStr}
                  onClick={() => openCreateModal(undefined, item.dateStr)}
                  className={`group relative p-2 min-h-[90px] transition-colors cursor-pointer flex flex-col justify-between ${
                    !item.isCurrentMonth
                      ? 'bg-slate-50/40 dark:bg-slate-950/20 text-slate-400 dark:text-slate-600'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Date number */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        item.isToday
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : item.isCurrentMonth
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {item.date.getDate()}
                    </span>

                    <span className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity">
                      <Plus size={13} />
                    </span>
                  </div>

                  {/* Tasks on this day */}
                  <div className="space-y-1 flex-1 overflow-hidden">
                    {dayTasks.slice(0, 3).map(task => {
                      const priorityColor =
                        task.priority === 'HIGH'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-900/50'
                          : task.priority === 'MEDIUM'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900/50'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50';

                      return (
                        <div
                          key={task.id}
                          onClick={e => {
                            e.stopPropagation();
                            setViewingTask(task);
                          }}
                          className={`text-[10px] font-medium px-1.5 py-0.5 rounded border truncate transition-transform hover:scale-101 ${
                            task.completed ? 'line-through opacity-50 bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent' : priorityColor
                          }`}
                        >
                          {task.title}
                        </div>
                      );
                    })}

                    {dayTasks.length > 3 && (
                      <span className="block text-[9px] font-semibold text-slate-400 dark:text-slate-500 pl-1">
                        +{dayTasks.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {mode === 'week' && (
        <div className="flex-1 flex flex-col min-h-[500px]">
          {/* Week header */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 text-center py-2.5 divide-x divide-slate-100 dark:divide-slate-800">
            {weekDays.map(wd => (
              <div key={wd.dateStr} className="px-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase block">
                  {wd.date.toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mt-1 ${
                    wd.isToday ? 'bg-indigo-600 text-white' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {wd.date.getDate()}
                </span>
              </div>
            ))}
          </div>

          {/* Week content columns */}
          <div className="grid grid-cols-7 flex-1 divide-x divide-slate-100 dark:divide-slate-800/80 p-2">
            {weekDays.map(wd => {
              const dayTasks = tasksByDate.get(wd.dateStr) || [];
              return (
                <div key={wd.dateStr} className="p-2 space-y-2 flex flex-col">
                  <button
                    type="button"
                    onClick={() => openCreateModal(undefined, wd.dateStr)}
                    className="w-full py-1 text-[11px] text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1 border border-dashed border-slate-200 dark:border-slate-800 transition-colors"
                  >
                    <Plus size={12} />
                    <span>Add</span>
                  </button>

                  <div className="space-y-2 overflow-y-auto flex-1">
                    {dayTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => setViewingTask(t)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer hover:shadow-sm transition-all ${
                          t.completed
                            ? 'bg-slate-50 dark:bg-slate-800/50 opacity-60 border-slate-200 dark:border-slate-800'
                            : t.priority === 'HIGH'
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                            : t.priority === 'MEDIUM'
                            ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                            : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                        }`}
                      >
                        <span className={`font-semibold block ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                          {t.title}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                          <Clock size={10} />
                          <span>
                            {t.due_date ? new Date(t.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {mode === 'day' && (
        <div className="flex-1 p-6 space-y-4 max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Schedule for {currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(tasksByDate.get(currentDate.toISOString().split('T')[0]) || []).length} scheduled items
              </p>
            </div>
            <button
              type="button"
              onClick={() => openCreateModal(undefined, currentDate.toISOString().split('T')[0])}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>Add to Day</span>
            </button>
          </div>

          <div className="space-y-3">
            {(tasksByDate.get(currentDate.toISOString().split('T')[0]) || []).length === 0 ? (
              <div className="py-12 text-center">
                <CalendarIcon size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No tasks due today</p>
                <p className="text-xs text-slate-400 mt-1">Enjoy your free time or plan ahead by creating a new task!</p>
              </div>
            ) : (
              (tasksByDate.get(currentDate.toISOString().split('T')[0]) || []).map(t => (
                <div
                  key={t.id}
                  onClick={() => setViewingTask(t)}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-400 transition-all cursor-pointer shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        t.priority === 'HIGH' ? 'bg-rose-500' : t.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                    />
                    <div>
                      <h5 className={`text-sm font-semibold ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                        {t.title}
                      </h5>
                      <span className="text-xs text-slate-400">{t.category}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {t.due_date ? new Date(t.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
