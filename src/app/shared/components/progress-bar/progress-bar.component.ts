import {
  Component,
  Input,
  OnChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import anime from 'animejs';

type ProgressColor = 'lavender' | 'mint' | 'peach' | 'sky';

const COLOR_MAP: Record<ProgressColor, string> = {
  lavender: 'from-lavender-300 to-lavender-400',
  mint:     'from-mint-200 to-mint-300',
  peach:    'from-peach-200 to-peach-300',
  sky:      'from-sky-200 to-sky-300',
};

@Component({
  selector: 'nm-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent implements OnChanges {
  @Input() value = 0;
  @Input() label = '';
  @Input() color: ProgressColor = 'lavender';

  @ViewChild('bar', { static: true }) barRef!: ElementRef<HTMLDivElement>;

  get colorGradient() {
    return COLOR_MAP[this.color];
  }

  ngOnChanges() {
    anime({
      targets: this.barRef.nativeElement,
      width: `${Math.min(Math.max(this.value, 0), 100)}%`,
      duration: 900,
      easing: 'easeInOutQuart',
    });
  }
}
