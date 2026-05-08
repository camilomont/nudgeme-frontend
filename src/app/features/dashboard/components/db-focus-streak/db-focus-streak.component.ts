import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'db-focus-streak',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './db-focus-streak.component.html',
  styleUrl: './db-focus-streak.component.scss',
})
export class DbFocusStreakComponent {
  readonly days = [
    { label: 'L', done: true  },
    { label: 'M', done: true  },
    { label: 'X', done: true  },
    { label: 'J', done: true  },
    { label: 'V', done: true  },
    { label: 'S', done: true  },
    { label: 'D', done: false },
  ];
}
