import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import anime from 'animejs';

@Component({
  selector: 'db-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './db-stats.component.html',
  styleUrl: './db-stats.component.scss',
})
export class DbStatsComponent implements AfterViewInit {
  @ViewChild('circleRef') circleRef!: ElementRef<SVGCircleElement>;

  readonly radius       = 38;
  readonly circumference = 2 * Math.PI * this.radius;
  readonly progressPct  = 82;

  ngAfterViewInit() {
    const offset = this.circumference - (this.progressPct / 100) * this.circumference;
    if (this.circleRef?.nativeElement) {
      anime({
        targets: this.circleRef.nativeElement,
        strokeDashoffset: [this.circumference, offset],
        duration: 1400,
        easing: 'easeInOutQuart',
      });
    }
  }
}
