import { Task, SmartScoreDetails, SortOption } from '../types/index.ts';

/**
 * Calculates priority weight:
 * HIGH = 3, MEDIUM = 2, LOW = 1
 */
export function getPriorityWeight(priority: Task['priority']): number {
  switch (priority) {
    case 'HIGH':
      return 3;
    case 'MEDIUM':
      return 2;
    case 'LOW':
    default:
      return 1;
  }
}

/**
 * Calculates deadline urgency score:
 * Overdue = 50 (highest urgency)
 * Due today = 40 (very high urgency)
 * Due within 2 days = 30 (high urgency)
 * Due within 7 days = 20 (medium urgency)
 * Later deadlines = 10 (normal urgency)
 * No deadline = 5
 */
export function calculateDeadlineUrgency(dueDateStr: string | null): {
  urgencyScore: number;
  urgencyLabel: string;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean;
  daysRemaining: number | null;
} {
  if (!dueDateStr) {
    return {
      urgencyScore: 5,
      urgencyLabel: 'No deadline',
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      daysRemaining: null,
    };
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayEnd = todayStart + 86400000;

  const dueDate = new Date(dueDateStr);
  const dueTime = dueDate.getTime();

  // If before start of today
  if (dueTime < todayStart) {
    const diffDays = Math.max(1, Math.ceil((todayStart - dueTime) / 86400000));
    return {
      urgencyScore: 50,
      urgencyLabel: `${diffDays}d overdue`,
      isOverdue: true,
      isDueToday: false,
      isDueSoon: true,
      daysRemaining: -diffDays,
    };
  }

  // If due today
  if (dueTime >= todayStart && dueTime <= todayEnd) {
    return {
      urgencyScore: 40,
      urgencyLabel: 'Due today',
      isOverdue: false,
      isDueToday: true,
      isDueSoon: true,
      daysRemaining: 0,
    };
  }

  // Days difference
  const diffDays = Math.ceil((dueTime - todayEnd) / 86400000);

  if (diffDays <= 2) {
    return {
      urgencyScore: 30,
      urgencyLabel: diffDays === 1 ? 'Due tomorrow' : 'Due in 2 days',
      isOverdue: false,
      isDueToday: false,
      isDueSoon: true,
      daysRemaining: diffDays,
    };
  }

  if (diffDays <= 7) {
    return {
      urgencyScore: 20,
      urgencyLabel: `Due in ${diffDays} days`,
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      daysRemaining: diffDays,
    };
  }

  return {
    urgencyScore: 10,
    urgencyLabel: `Due in ${diffDays} days`,
    isOverdue: false,
    isDueToday: false,
    isDueSoon: false,
    daysRemaining: diffDays,
  };
}

/**
 * Calculates complete smart score details
 */
export function getSmartScoreDetails(task: Task): SmartScoreDetails {
  const priorityWeight = getPriorityWeight(task.priority);
  const urgency = calculateDeadlineUrgency(task.due_date);

  // Score formula: (priorityWeight * 15) + urgencyScore
  // High Priority (3 * 15 = 45) + Overdue (50) = 95
  // High Priority + Due today (40) = 85
  // Medium Priority (2 * 15 = 30) + Overdue (50) = 80
  const score = task.completed ? 0 : (priorityWeight * 15) + urgency.urgencyScore;

  return {
    score,
    priorityWeight,
    urgencyScore: urgency.urgencyScore,
    urgencyLabel: urgency.urgencyLabel,
    isOverdue: urgency.isOverdue && !task.completed,
    isDueToday: urgency.isDueToday && !task.completed,
    isDueSoon: urgency.isDueSoon && !task.completed,
  };
}

/**
 * Sorts tasks according to specified SortOption:
 * - 'smart': Pending first by highest smart score, then completed
 * - 'dueDate': By earliest due date, no-deadline last
 * - 'priority': High -> Medium -> Low
 * - 'created': Newest first
 */
export function sortTasks(tasks: Task[], sortOption: SortOption): Task[] {
  return [...tasks].sort((a, b) => {
    // Always separate completed tasks from pending tasks
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    if (sortOption === 'smart') {
      const scoreA = getSmartScoreDetails(a).score;
      const scoreB = getSmartScoreDetails(b).score;
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // higher score first
      }
      // Secondary: priority weight
      const pDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      if (pDiff !== 0) return pDiff;
      // Tertiary: due date
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }

    if (sortOption === 'dueDate') {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }

    if (sortOption === 'priority') {
      const pDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
      if (pDiff !== 0) return pDiff;
      // Secondary: due date
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return 0;
    }

    if (sortOption === 'created') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }

    return 0;
  });
}
