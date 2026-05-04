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
  template: `
    <div class="mx-auto max-w-3xl px-4 py-8">
      <div [animeEntrance]="'slideUp'" class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-pastel-gradient font-display">Mis Tareas</h1>
        <button (click)="showForm.set(true)" class="btn-lavender">+ Nueva tarea</button>
      </div>

      <!-- New task form -->
      @if (showForm()) {
        <div [animeEntrance]="'scaleIn'" class="glass-card mb-6 p-6">
          <h3 class="mb-4 font-semibold text-slate-200">Nueva tarea</h3>
          <div class="space-y-3">
            <input
              [(ngModel)]="form.title"
              placeholder="Título de la tarea"
              maxlength="200"
              class="nm-input"
            />
            <textarea
              [(ngModel)]="form.description"
              placeholder="Descripción (opcional)"
              rows="2"
              class="nm-input resize-none"
            ></textarea>
            <div class="grid grid-cols-2 gap-3">
              <select [(ngModel)]="form.type" class="nm-input">
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
              </select>
              <select [(ngModel)]="form.priority" class="nm-input">
                <option value="low">Prioridad baja</option>
                <option value="medium">Prioridad media</option>
                <option value="high">Prioridad alta</option>
              </select>
            </div>
            <div class="flex gap-3">
              <button
                (click)="createTask()"
                [disabled]="!form.title || isSaving()"
                class="btn-lavender flex-1 disabled:opacity-40"
              >
                {{ isSaving() ? 'Guardando...' : 'Guardar' }}
              </button>
              <button (click)="showForm.set(false)" class="btn-ghost">Cancelar</button>
            </div>
          </div>
        </div>
      }

      <!-- Filter tabs -->
      <div class="mb-4 flex gap-2">
        @for (f of filters; track f.value) {
          <button
            (click)="activeFilter.set(f.value)"
            class="rounded-full px-4 py-1.5 text-sm transition-all"
            [class]="activeFilter() === f.value
              ? 'bg-lavender-400/20 text-lavender-300 font-medium'
              : 'text-slate-500 hover:text-slate-300'"
          >
            {{ f.label }}
          </button>
        }
      </div>

      <!-- Task list -->
      @if (isLoading()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4]; track i) {
            <div class="h-16 animate-pulse rounded-xl bg-white/5"></div>
          }
        </div>
      } @else {
        <div class="space-y-2">
          @for (task of filteredTasks(); track task._id; let i = $index) {
            <div
              [animeEntrance]="'slideUp'"
              [animeDelay]="i * 50"
              class="glass-card flex items-center gap-3 px-4 py-3"
            >
              <button
                (click)="toggleStatus(task)"
                class="flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all"
                [class]="task.status === 'completed'
                  ? 'border-mint-300 bg-mint-300'
                  : 'border-white/30 hover:border-lavender-400'"
              ></button>

              <div class="min-w-0 flex-1">
                <p
                  class="text-sm text-slate-200"
                  [class.line-through]="task.status === 'completed'"
                  [class.opacity-40]="task.status === 'completed'"
                >
                  {{ task.title }}
                </p>
                @if (task.description) {
                  <p class="mt-0.5 truncate text-xs text-slate-500">{{ task.description }}</p>
                }
              </div>

              <div class="flex items-center gap-2">
                <span class="tag-chip text-[10px] {{ priorityColor(task.priority) }}">
                  {{ task.priority }}
                </span>
                <button
                  (click)="deleteTask(task._id)"
                  class="text-slate-600 transition-all hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>
          } @empty {
            <div class="py-12 text-center text-slate-500">
              No hay tareas en esta categoría.
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .btn-lavender {
      @apply rounded-xl bg-gradient-to-r from-lavender-400 to-sky-300 px-4 py-2 text-sm font-semibold text-slate-900 transition-all hover:scale-[1.02] hover:shadow-lg;
    }
    .btn-ghost {
      @apply rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 transition-all hover:border-white/20;
    }
    .nm-input {
      @apply w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-lavender-400/50 focus:bg-white/8;
    }
  `],
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
