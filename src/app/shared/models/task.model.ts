export type TaskType = 'daily' | 'weekly' | 'monthly';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  aiGenerated: boolean;
  dueDate?: string;
  estimatedMinutes?: number;
}
