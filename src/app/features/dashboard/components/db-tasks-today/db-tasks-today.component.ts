import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Zap, Pencil, User, LucideIconData } from 'lucide-angular';
import { Task } from '@shared/models/task.model';

const CARD_PALETTES = [
  {
    accentColor: '#00B87C',
    iconBg: '#E6F8F3',
    badgeBg: '#E6F8F3',
    badgeText: '#00B87C',
    borderColor: 'rgba(0,184,124,0.25)',
    shadowColor: 'rgba(0,184,124,0.1)',
    btnGrad: 'linear-gradient(135deg,#00B87C,#009963)',
    btnShadow: '0 4px 15px rgba(0,184,124,0.4)',
  },
  {
    accentColor: '#FFB03A',
    iconBg: '#FFF5E6',
    badgeBg: '#FFF5E6',
    badgeText: '#FFB03A',
    borderColor: 'rgba(255,176,58,0.3)',
    shadowColor: 'rgba(255,176,58,0.1)',
    btnGrad: 'linear-gradient(135deg,#FFB03A,#F59E0B)',
    btnShadow: '0 4px 15px rgba(255,176,58,0.4)',
  },
  {
    accentColor: '#A881FF',
    iconBg: '#F3E8FF',
    badgeBg: '#F3E8FF',
    badgeText: '#A881FF',
    borderColor: 'rgba(168,129,255,0.3)',
    shadowColor: 'rgba(168,129,255,0.1)',
    btnGrad: 'linear-gradient(135deg,#A881FF,#7C3AED)',
    btnShadow: '0 4px 15px rgba(168,129,255,0.4)',
  },
];

const PRIORITY_BADGE: Record<string, string> = {
  high:   'Alta energía',
  medium: 'Energía media',
  low:    'Baja energía',
};

const PRIORITY_ICON: Record<string, LucideIconData> = {
  high:   Zap,
  medium: Pencil,
  low:    User,
};

@Component({
  selector: 'db-tasks-today',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './db-tasks-today.component.html',
  styleUrl: './db-tasks-today.component.scss',
})
export class DbTasksTodayComponent {
  @Input() tasks: Task[]  = [];
  @Input() isLoading      = false;

  readonly loadingPlaceholders = [0, 1, 2];

  get visibleTasks() { return this.tasks.slice(0, 3); }

  palette(i: number) { return CARD_PALETTES[i % CARD_PALETTES.length]; }

  energyBadge(priority: string) { return PRIORITY_BADGE[priority] ?? 'Energía media'; }

  taskIconObj(priority: string): LucideIconData { return PRIORITY_ICON[priority] ?? Zap; }
}
