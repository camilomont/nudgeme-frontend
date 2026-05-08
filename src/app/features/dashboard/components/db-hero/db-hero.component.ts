import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'db-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './db-hero.component.html',
  styleUrl: './db-hero.component.scss',
})
export class DbHeroComponent {
  @Input() firstName = '';
}
