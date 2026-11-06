import { Plus, Filter, RotateCcw, Sparkles, ArrowUpDown, Search } from 'lucide-react';
import { useTasks } from '../context/TaskContext.tsx';
import { TaskCard } from '../components/tasks/TaskCard.tsx';
import { Priority, Category, SortOption } from '../types/index.ts';

export function TasksPage() {
  const {
    filteredTasks,
    filterState,
    updateFilter,
    clearFilters,
    sortOption,
    setSortOption,
    openCreateModal,
  } = useTasks();

  const isFiltered =
    Boolean(filterState.search) ||
    filterState.priority !== 'ALL' ||
    filterState.category !== 'ALL' ||
    filterState.status !== 'ALL' ||
    filterState.dateRange !== 'ALL';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Tasks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage, prioritize, and track all your work across categories
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreateModal()}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Task</span>
        </button>
      </div>

      {/* Control Bar: Filters & Sorting */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Multi-Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Status Filter */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-0.5">
              {(['ALL', 'PENDING', 'COMPLETED', 'OVERDUE'] as const).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => updateFilter({ status: st })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    filterState.status === st
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st.toLowerCase()}
                </button>
              ))}
            </div>

            {/* Priority Select */}
            <select
              value={filterState.priority}
              onChange={e => updateFilter({ priority: e.target.value as Priority | 'ALL' })}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">🔴 High Priority</option>
              <option value="MEDIUM">🟡 Medium Priority</option>
              <option value="LOW">🟢 Low Priority</option>
            </select>

            {/* Category Select */}
            <select
              value={filterState.category}
              onChange={e => updateFilter({ category: e.target.value as Category | 'ALL' })}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="Work">💼 Work</option>
              <option value="Personal">👤 Personal</option>
              <option value="Study">🎓 Study</option>
              <option value="Projects">🚀 Projects</option>
            </select>

            {/* Date Range Select */}
            <select
              value={filterState.dateRange}
              onChange={e => updateFilter({ dateRange: e.target.value as any })}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Due Dates</option>
              <option value="TODAY">Due Today</option>
              <option value="THIS_WEEK">Due This Week</option>
              <option value="OVERDUE">Overdue</option>
            </select>

            {/* Clear filters button */}
            {isFiltered && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Sorting Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown size={13} />
              <span>Sort:</span>
            </span>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value as SortOption)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="smart">⚡ Smart Priority (Recommended)</option>
              <option value="dueDate">📅 Due Date (Earliest First)</option>
              <option value="priority">🔴 Highest Priority</option>
              <option value="created">🕒 Recently Created</option>
            </select>
          </div>
        </div>

        {/* Smart score explanation when active */}
        {sortOption === 'smart' && (
          <div className="flex items-center gap-2 text-[11px] text-indigo-700 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
            <Sparkles size={13} />
            <span>Smart Priority sorts pending tasks dynamically by combining priority rank (High/Medium/Low) + deadline urgency (overdue, today, upcoming).</span>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <Filter size={32} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No matching tasks found
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {isFiltered
                ? 'Try adjusting or resetting your search query and filters to see more tasks.'
                : 'You have no tasks yet. Get started by creating your first task.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              {isFiltered && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => openCreateModal()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} showSmartScore={sortOption === 'smart'} />
          ))
        )}
      </div>
    </div>
  );
}
