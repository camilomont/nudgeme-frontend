import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Home, CheckSquare, Zap, BarChart2, Sparkles, Settings, Heart, LogOut } from 'lucide-angular';
import { AuthService } from '@core/services/auth.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LucideIcon = any;

interface NavItem { icon: LucideIcon; label: string; active: boolean; }

@Component({
  selector: 'db-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './db-sidebar.component.html',
  styleUrl: './db-sidebar.component.scss',
})
export class DbSidebarComponent {
  private readonly auth = inject(AuthService);

  @Input() userName  = '';
  @Input() userAvatar?: string;

  readonly xp    = 120;
  readonly xpMax = 200;
  readonly level = 4;

  readonly Home      = Home;
  readonly Heart     = Heart;
  readonly LogOut    = LogOut;

  readonly navItems: NavItem[] = [
    { icon: Home,        label: 'Inicio',          active: true  },
    { icon: CheckSquare, label: 'Mis tareas',       active: false },
    { icon: Zap,         label: 'Energía',          active: false },
    { icon: BarChart2,   label: 'Estadísticas',     active: false },
    { icon: Sparkles,    label: 'IA Suggestions',   active: false },
    { icon: Settings,    label: 'Configuración',    active: false },
  ];

  get xpPercent() { return (this.xp / this.xpMax) * 100; }

  logout() { this.auth.logout(); }
}
