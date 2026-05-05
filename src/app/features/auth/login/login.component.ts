import {
  Component,
  inject,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import anime from 'animejs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit {
  private readonly auth = inject(AuthService);

  @ViewChild('illusPanel') illusPanel!: ElementRef;
  @ViewChild('formCard')   formCard!: ElementRef;
  @ViewChild('charBubble') charBubble!: ElementRef;
  @ViewChild('badge1')     badge1!: ElementRef;
  @ViewChild('badge2')     badge2!: ElementRef;
  @ViewChild('illusCopy')  illusCopy!: ElementRef;
  @ViewChild('googleBtn')  googleBtn!: ElementRef;

  readonly features = [
    { icon: '🧠', label: 'Sugerencias IA basadas en tus intereses', bg: 'rgba(196,181,253,0.15)' },
    { icon: '📊', label: 'Progreso visual y barras animadas',         bg: 'rgba(186,230,253,0.15)' },
    { icon: '⚡', label: 'Tareas adaptadas a tu energía del día',     bg: 'rgba(253,186,116,0.15)' },
  ];

  ngAfterViewInit() {
    const tl = anime.timeline({ easing: 'easeOutExpo' });

    tl.add({
      targets: this.formCard.nativeElement,
      opacity: [0, 1],
      translateX: [40, 0],
      duration: 700,
    })
    .add({
      targets: this.charBubble.nativeElement,
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 600,
    }, '-=500')
    .add({
      targets: this.illusCopy.nativeElement,
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 500,
    }, '-=300');

    anime({
      targets: [this.badge1.nativeElement, this.badge2.nativeElement],
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 500,
      delay: anime.stagger(150, { start: 600 }),
      easing: 'easeOutBack',
    });

    anime({
      targets: this.badge1.nativeElement,
      translateY: ['-6px', '0px'],
      duration: 2800,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine',
      delay: 800,
    });
    anime({
      targets: this.badge2.nativeElement,
      translateY: ['0px', '-8px'],
      duration: 3200,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine',
      delay: 1000,
    });
  }

  login() {
    anime({
      targets: this.googleBtn.nativeElement,
      scale: [1, 0.97, 1],
      duration: 300,
      easing: 'easeInOutQuad',
    });
    setTimeout(() => this.auth.loginWithGoogle(), 200);
  }
}
