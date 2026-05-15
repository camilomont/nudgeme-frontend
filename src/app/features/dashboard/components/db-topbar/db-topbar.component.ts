import { Component, computed } from '@angular/core';
import { LucideAngularModule, Bell, Sun } from 'lucide-angular';

@Component({
  selector: 'db-topbar',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './db-topbar.component.html',
  styleUrl: './db-topbar.component.scss',
})
export class DbTopbarComponent {
  readonly Bell = Bell;
  readonly Sun  = Sun;

  readonly dateLabel = (() => {
    const now = new Date();
    const day  = now.toLocaleDateString('es-ES', { weekday: 'long' });
    const rest = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    return `${day.charAt(0).toUpperCase() + day.slice(1)}, ${rest}`;
  })();
}
