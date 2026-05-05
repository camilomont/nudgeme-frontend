import {
  Component,
  inject,
  signal,
  OnInit,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ApiService } from '@core/services/api.service';
import { ProgressBarComponent } from '@shared/components/progress-bar/progress-bar.component';
import { AnimeEntranceDirective } from '@shared/directives/anime-entrance.directive';
import { FloatingParticlesComponent } from '@shared/components/floating-particles/floating-particles.component';

interface Task {
  _id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  category?: string;
  aiGenerated: boolean;
  aiRationale?: string;
}

interface SuggestedTask {
  title: string;
  description: string;
  type: string;
  category: string;
  priority: string;
  rationale: string;
}

interface ProgressStat {
  type: string;
  total: number;
  completed: number;
  percentage: number;
}

interface ProgressOverview {
  overall: { total: number; completed: number; percentage: number };
  byType: ProgressStat[];
}

const TYPE_COLOR: Record<string, 'lavender' | 'mint' | 'peach' | 'sky'> = {
  daily:   'lavender',
  weekly:  'mint',
  monthly: 'peach',
};

const TYPE_LABEL: Record<string, string> = {
  daily: 'Diarias', weekly: 'Semanales', monthly: 'Mensuales',
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ProgressBarComponent,
    AnimeEntranceDirective,
    FloatingParticlesComponent,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  readonly tasks = signal<Task[]>([]);
  readonly suggestions = signal<SuggestedTask[]>([]);
  readonly progress = signal<ProgressOverview | null>(null);
  readonly isLoadingTasks = signal(true);
  readonly isLoadingSuggestions = signal(false);

  readonly firstName = computed(() => this.auth.user()?.name?.split(' ')[0] ?? '');

  readonly todayLabel = new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  ngOnInit() {
    this.loadTasks();
    this.loadProgress();
    this.loadSuggestions();
  }

  loadTasks() {
    this.isLoadingTasks.set(true);
    this.api.get<Task[]>('/tasks').subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoadingTasks.set(false);
      },
      error: () => this.isLoadingTasks.set(false),
    });
  }

  loadProgress() {
    this.api.get<ProgressOverview>('/analytics/progress').subscribe({
      next: (p) => this.progress.set(p),
    });
  }

  loadSuggestions() {
    this.isLoadingSuggestions.set(true);
    this.api.get<SuggestedTask[]>('/suggestions?count=4').subscribe({
      next: (s) => {
        this.suggestions.set(s);
        this.isLoadingSuggestions.set(false);
      },
      error: () => this.isLoadingSuggestions.set(false),
    });
  }

  toggleTask(task: Task) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    this.api.patch(`/tasks/${task._id}`, { status: newStatus }).subscribe({
      next: (updated) => {
        this.tasks.update((prev) =>
          prev.map((t) => (t._id === task._id ? (updated as Task) : t)),
        );
        this.loadProgress();
      },
    });
  }

  acceptSuggestion(s: SuggestedTask) {
    this.api
      .post<Task>('/tasks', {
        title: s.title,
        description: s.description,
        type: s.type,
        category: s.category,
        priority: s.priority,
      })
      .subscribe({
        next: (task) => {
          this.tasks.update((prev) => [task, ...prev]);
          this.suggestions.update((prev) => prev.filter((x) => x.title !== s.title));
          this.loadProgress();
        },
      });
  }

  logout() {
    this.auth.logout();
  }

  typeColor(type: string): 'lavender' | 'mint' | 'peach' | 'sky' {
    return TYPE_COLOR[type] ?? 'sky';
  }

  typeLabel(type: string): string {
    return TYPE_LABEL[type] ?? type;
  }
}
