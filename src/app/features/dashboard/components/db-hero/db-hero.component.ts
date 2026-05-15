import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Flame, Zap, Target } from 'lucide-angular';

@Component({
  selector: 'db-hero',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './db-hero.component.html',
  styleUrl: './db-hero.component.scss',
})
export class DbHeroComponent {
  @Input() firstName = '';

  readonly Flame  = Flame;
  readonly Zap    = Zap;
  readonly Target = Target;
}
