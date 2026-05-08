import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../dashboard.component';

const CARD_PALETTES = [
  { bg: '#DCFCE7', badgeBg: '#BBF7D0', badgeText: '#166534', btnGrad: 'linear-gradient(135deg,#22C55E,#16A34A)' },
  { bg: '#FFF9C4', badgeBg: '#FEF08A', badgeText: '#854D0E', btnGrad: 'linear-gradient(135deg,#EAB308,#CA8A04)' },
  { bg: '#F2ECFF', badgeBg: '#E9D5FF', badgeText: '#6B21A8', btnGrad: 'linear-gradient(135deg,#A855F7,#7C3AED)' },
];

const PRIORITY_BADGE: Record<string, string> = {
  high:   'Alta energía',
  medium: 'Energía media',
  low:    'Baja energía',
};

@Component({
  selector: 'db-tasks-today',
  standalone: true,
  imports: [CommonModule],
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
}
