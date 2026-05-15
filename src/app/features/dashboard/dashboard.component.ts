import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { ApiService } from '@core/services/api.service';
import { FloatingParticlesComponent } from '@shared/components/floating-particles/floating-particles.component';
import { DbSidebarComponent } from './components/db-sidebar/db-sidebar.component';
import { DbTopbarComponent } from './components/db-topbar/db-topbar.component';
import { DbHeroComponent } from './components/db-hero/db-hero.component';
import { DbTasksTodayComponent } from './components/db-tasks-today/db-tasks-today.component';
import { DbEnergyWidgetComponent } from './components/db-energy-widget/db-energy-widget.component';
import { DbAiSuggestionComponent } from './components/db-ai-suggestion/db-ai-suggestion.component';
import { DbStatsComponent } from './components/db-stats/db-stats.component';
import { DbFocusStreakComponent } from './components/db-focus-streak/db-focus-streak.component';

export interface Task {
  _id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  category?: string;
  aiGenerated: boolean;
  estimatedMinutes?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FloatingParticlesComponent,
    DbSidebarComponent,
    DbTopbarComponent,
    DbHeroComponent,
    DbTasksTodayComponent,
    DbEnergyWidgetComponent,
    DbAiSuggestionComponent,
    DbStatsComponent,
    DbFocusStreakComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly auth   = inject(AuthService);
  private readonly api    = inject(ApiService);

  readonly tasks          = signal<Task[]>([]);
  readonly isLoadingTasks = signal(true);
  readonly firstName      = computed(() => this.auth.user()?.name?.split(' ')[0] ?? '');
  readonly userName       = computed(() => this.auth.user()?.name ?? '');
  readonly userAvatar     = computed(() => this.auth.user()?.avatar);

  ngOnInit() { this.loadTasks(); }

  private loadTasks() {
    this.isLoadingTasks.set(true);
    this.api.get<Task[]>('/tasks').subscribe({
      next:  (tasks) => { this.tasks.set(tasks); this.isLoadingTasks.set(false); },
      error: ()      => this.isLoadingTasks.set(false),
    });
  }
}
