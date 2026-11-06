import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'N', label: 'Create new task' },
    { key: '/', label: 'Focus global search' },
    { key: 'D', label: 'Go to Dashboard' },
    { key: 'T', label: 'Go to Today' },
    { key: 'C', label: 'Go to Calendar' },
    { key: 'A', label: 'Go to Analytics' },
    { key: '?', label: 'Open keyboard shortcuts' },
    { key: 'Esc', label: 'Close open dialogs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Command size={18} className="text-indigo-600 dark:text-indigo-400" />
            <h3 id="shortcuts-title" className="text-sm font-bold text-slate-900 dark:text-white">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 divide-y divide-slate-100 dark:divide-slate-800/60">
          {shortcuts.map(s => (
            <div key={s.key} className="flex items-center justify-between py-2.5 text-xs">
              <span className="text-slate-600 dark:text-slate-300">{s.label}</span>
              <kbd className="px-2 py-1 font-mono font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
