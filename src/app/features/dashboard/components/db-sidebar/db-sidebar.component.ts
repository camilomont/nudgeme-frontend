import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Home, CheckSquare, Zap, BarChart2, Sparkles, Settings, Heart, LogOut } from 'lucide-angular';
import { AuthService } from '@core/services/auth.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LucideIcon = any;

interface NavItem { icon: LucideIcon; label: string; route: string; }

@Component({
  selector: 'db-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, RouterLinkActive],
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
    { icon: Home,        label: 'Inicio',        route: '/dashboard'  },
    { icon: CheckSquare, label: 'Mis tareas',    route: '/tasks'      },
    { icon: Zap,         label: 'Energía',       route: '/dashboard'  },
    { icon: BarChart2,   label: 'Estadísticas',  route: '/dashboard'  },
    { icon: Sparkles,    label: 'IA Suggestions',route: '/dashboard'  },
    { icon: Settings,    label: 'Configuración', route: '/dashboard'  },
  ];

  get xpPercent() { return (this.xp / this.xpMax) * 100; }

  logout() { this.auth.logout(); }
}
