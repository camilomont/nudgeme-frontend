import {
  Component,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { AnimeEntranceDirective } from '@shared/directives/anime-entrance.directive';

type TaskType = 'daily' | 'weekly' | 'monthly';
type TaskStatus = 'pending' | 'in_progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
  _id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  category?: string;
  aiGenerated: boolean;
  dueDate?: string;
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low:    'bg-mint-200/20 text-mint-200',
  medium: 'bg-sky-200/20 text-sky-200',
  high:   'bg-peach-200/20 text-peach-200',
};

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, AnimeEntranceDirective],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss',
})
export class TaskManagerComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly tasks = signal<Task[]>([]);
  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly showForm = signal(false);
  readonly activeFilter = signal<string>('all');

  form: { title: string; description: string; type: TaskType; priority: TaskPriority } = {
    title: '', description: '', type: 'daily', priority: 'medium',
  };

  readonly filters = [
    { label: 'Todas', value: 'all' },
    { label: 'Diarias', value: 'daily' },
    { label: 'Semanales', value: 'weekly' },
    { label: 'Mensuales', value: 'monthly' },
  ];

  readonly filteredTasks = () => {
    const f = this.activeFilter();
    return f === 'all' ? this.tasks() : this.tasks().filter((t) => t.type === f);
  };

  ngOnInit() {
    this.api.get<Task[]>('/tasks').subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  createTask() {
    this.isSaving.set(true);
    this.api.post<Task>('/tasks', this.form).subscribe({
      next: (task) => {
        this.tasks.update((prev) => [task, ...prev]);
        this.form = { title: '', description: '', type: 'daily', priority: 'medium' };
        this.showForm.set(false);
        this.isSaving.set(false);
      },
      error: () => this.isSaving.set(false),
    });
  }

  toggleStatus(task: Task) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    this.api.patch<Task>(`/tasks/${task._id}`, { status: newStatus }).subscribe({
      next: (updated) =>
        this.tasks.update((prev) =>
          prev.map((t) => (t._id === task._id ? (updated as Task) : t)),
        ),
    });
  }

  deleteTask(id: string) {
    this.api.delete(`/tasks/${id}`).subscribe({
      next: () => this.tasks.update((prev) => prev.filter((t) => t._id !== id)),
    });
  }

  priorityColor(priority: TaskPriority): string {
    return PRIORITY_COLORS[priority] ?? '';
  }
}
