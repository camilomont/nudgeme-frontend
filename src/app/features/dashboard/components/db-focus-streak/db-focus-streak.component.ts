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
    { label: 'Lun', done: true  },
    { label: 'Mar', done: true  },
    { label: 'Mié', done: true  },
    { label: 'Jue', done: true  },
    { label: 'Vie', done: true  },
    { label: 'Sáb', done: true  },
    { label: 'Dom', done: false },
  ];
}
