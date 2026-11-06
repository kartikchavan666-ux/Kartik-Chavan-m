export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type Category = 'Work' | 'Personal' | 'Study' | 'Projects';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  due_date: string | null; // ISO 8601 string or YYYY-MM-DD
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export type SortOption = 'smart' | 'dueDate' | 'priority' | 'created';

export interface FilterState {
  search: string;
  priority: Priority | 'ALL';
  category: Category | 'ALL';
  status: 'ALL' | 'COMPLETED' | 'PENDING' | 'OVERDUE';
  dateRange: 'ALL' | 'TODAY' | 'THIS_WEEK' | 'OVERDUE';
}

export interface SmartScoreDetails {
  score: number;
  priorityWeight: number;
  urgencyScore: number;
  urgencyLabel: string;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean;
}
