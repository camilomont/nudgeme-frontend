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
  template: `
    <div class="relative min-h-screen">
      <nm-floating-particles />

      <div class="relative z-10 mx-auto max-w-5xl px-4 py-8">

        <!-- Header -->
        <header [animeEntrance]="'slideUp'" class="mb-8 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-pastel-gradient font-display">
              ¡Hola, {{ firstName() }}! 👋
            </h1>
            <p class="text-sm text-slate-400">{{ todayLabel }}</p>
          </div>
          <button
            (click)="logout()"
            class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 transition-all hover:border-white/20 hover:text-slate-200"
          >
            Salir
          </button>
        </header>

        <!-- Progress overview -->
        @if (progress()) {
          <section [animeEntrance]="'slideUp'" [animeDelay]="100" class="mb-8">
            <div class="glass-card p-6">
              <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Progreso General
              </h2>
              <div class="mb-4">
                <nm-progress-bar
                  [value]="progress()!.overall.percentage"
                  [label]="'Completado: ' + progress()!.overall.completed + '/' + progress()!.overall.total"
                  color="lavender"
                />
              </div>
              <div class="grid grid-cols-3 gap-4">
                @for (stat of progress()!.byType; track stat.type) {
                  <div class="rounded-xl bg-white/5 p-3 text-center">
                    <div class="mb-1 text-xs text-slate-500">{{ typeLabel(stat.type) }}</div>
                    <div class="mb-2 text-lg font-bold text-slate-200">{{ stat.percentage }}%</div>
                    <nm-progress-bar [value]="stat.percentage" [color]="typeColor(stat.type)" />
                  </div>
                }
              </div>
            </div>
          </section>
        }

        <!-- Tasks / Suggestions grid -->
        <div class="grid gap-6 lg:grid-cols-2">

          <!-- Recent tasks -->
          <section [animeEntrance]="'slideUp'" [animeDelay]="200">
            <div class="glass-card p-6">
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Mis Tareas
                </h2>
                <a
                  routerLink="/tasks"
                  class="text-xs text-lavender-300 hover:text-lavender-200"
                >
                  Ver todas →
                </a>
              </div>

              @if (isLoadingTasks()) {
                <div class="space-y-3">
                  @for (i of [1,2,3]; track i) {
                    <div class="h-14 animate-pulse rounded-xl bg-white/5"></div>
                  }
                </div>
              } @else if (tasks().length === 0) {
                <div class="py-8 text-center">
                  <p class="mb-2 text-3xl">📋</p>
                  <p class="text-sm text-slate-400">Sin tareas aún. ¡Prueba las sugerencias!</p>
                </div>
              } @else {
                <div class="space-y-2">
                  @for (task of tasks().slice(0, 5); track task._id; let i = $index) {
                    <div
                      [animeEntrance]="'slideUp'"
                      [animeDelay]="i * 60"
                      class="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 transition-all hover:bg-white/8"
                    >
                      <button
                        (click)="toggleTask(task)"
                        class="flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all"
                        [class]="task.status === 'completed'
                          ? 'border-mint-300 bg-mint-300'
                          : 'border-white/30 hover:border-lavender-400'"
                      ></button>
                      <div class="min-w-0 flex-1">
                        <p
                          class="truncate text-sm text-slate-200 transition-all"
                          [class.line-through]="task.status === 'completed'"
                          [class.opacity-50]="task.status === 'completed'"
                        >
                          {{ task.title }}
                        </p>
                        <div class="mt-0.5 flex items-center gap-2">
                          <span class="text-xs text-slate-500">{{ typeLabel(task.type) }}</span>
                          @if (task.aiGenerated) {
                            <span class="tag-chip bg-lavender-400/10 text-lavender-300 text-[10px] py-0.5 px-1.5">✨ IA</span>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </section>

          <!-- AI Suggestions -->
          <section [animeEntrance]="'slideUp'" [animeDelay]="300">
            <div class="glass-card p-6">
              <div class="mb-4 flex items-center justify-between">
                <h2 class="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Sugerencias IA ✨
                </h2>
                <button
                  (click)="loadSuggestions()"
                  [disabled]="isLoadingSuggestions()"
                  class="text-xs text-sky-300 hover:text-sky-200 disabled:opacity-40"
                >
                  {{ isLoadingSuggestions() ? 'Generando...' : 'Actualizar' }}
                </button>
              </div>

              @if (isLoadingSuggestions()) {
                <div class="space-y-3">
                  @for (i of [1,2,3]; track i) {
                    <div class="h-16 animate-pulse rounded-xl bg-white/5"></div>
                  }
                </div>
              } @else {
                <div class="space-y-2">
                  @for (s of suggestions(); track s.title; let i = $index) {
                    <div
                      [animeEntrance]="'slideUp'"
                      [animeDelay]="i * 80"
                      class="group rounded-xl border border-white/5 bg-white/5 p-3 transition-all hover:border-lavender-400/30"
                    >
                      <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0 flex-1">
                          <p class="text-sm font-medium text-slate-200">{{ s.title }}</p>
                          <p class="mt-0.5 text-xs text-slate-500">{{ s.rationale }}</p>
                        </div>
                        <button
                          (click)="acceptSuggestion(s)"
                          class="flex-shrink-0 rounded-lg bg-lavender-400/20 px-2 py-1 text-xs text-lavender-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-lavender-400/30"
                        >
                          + Añadir
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </section>

        </div>
      </div>
    </div>
  `,
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
