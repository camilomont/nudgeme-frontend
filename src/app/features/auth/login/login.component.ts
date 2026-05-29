import {
  Component,
  inject,
  signal,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import {
  LucideAngularModule,
  LucideIconProvider,
  LUCIDE_ICONS,
  Brain,
  TrendingUp,
  Zap,
  CheckCircle2,
  Flame,
  ArrowRight,
} from 'lucide-angular';
import anime from 'animejs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  providers: [
    { provide: LUCIDE_ICONS, useValue: new LucideIconProvider({ Brain, TrendingUp, Zap, CheckCircle2, Flame, ArrowRight }), multi: true },
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private clickUnlockHandler!: () => void;
  private visibilityHandler!: () => void;

  @ViewChild('heroVideo')   heroVideo!: ElementRef;
  @ViewChild('formCard')    formCard!: ElementRef;
  @ViewChild('heroBadge')   heroBadge!: ElementRef;
  @ViewChild('headlineLine1') headlineLine1!: ElementRef;
  @ViewChild('headlineLine2') headlineLine2!: ElementRef;
  @ViewChild('heroSubtext') heroSubtext!: ElementRef;
  @ViewChild('googleBtn')   googleBtn!: ElementRef;
  @ViewChild('statCard1')   statCard1!: ElementRef;
  @ViewChild('statCard2')   statCard2!: ElementRef;
  @ViewChild('ambientOrb')  ambientOrb!: ElementRef;
  @ViewChild('heroCopy')    heroCopy!: ElementRef;

  @ViewChildren('featureItem') featureItems!: QueryList<ElementRef>;

  readonly CheckCircle2 = CheckCircle2;
  readonly Flame = Flame;

  readonly isLoggingIn = signal(false);

  readonly features = [
    { iconName: 'brain',       label: 'Sugerencias IA basadas en tus intereses' },
    { iconName: 'trending-up', label: 'Progreso visual y barras animadas'        },
    { iconName: 'zap',         label: 'Tareas adaptadas a tu energía del día'    },
  ];

  ngAfterViewInit() {
    if (this.heroVideo?.nativeElement) {
      const v: HTMLVideoElement = this.heroVideo.nativeElement;
      const play = () => v.play().catch(() => {});

      play();

      // Chrome blocks muted autoplay after repeated reloads until a user gesture.
      // Listen for the first click anywhere and unlock playback — fires once, self-removes.
      this.clickUnlockHandler = () => play();
      document.addEventListener('click', this.clickUnlockHandler, { once: true });

      this.visibilityHandler = () => { if (!document.hidden && v.paused) play(); };
      document.addEventListener('visibilitychange', this.visibilityHandler);
    }

    const tl = anime.timeline({ easing: 'easeOutExpo' });

    // 1. Form card entrance
    tl.add({
      targets: this.formCard.nativeElement,
      opacity: [0, 1],
      translateX: [44, 0],
      duration: 750,
    });

    // 2. Welcome badge
    if (this.heroBadge?.nativeElement) {
      tl.add({
        targets: this.heroBadge.nativeElement,
        opacity: [0, 1],
        translateX: [-14, 0],
        duration: 340,
      }, '-=520');
    }

    // 4. Headline lines stagger
    const lines = [this.headlineLine1?.nativeElement, this.headlineLine2?.nativeElement]
      .filter(Boolean);
    if (lines.length) {
      tl.add({
        targets: lines,
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 500,
        delay: anime.stagger(120),
      }, '-=220');
    }

    // 5. Subtext
    if (this.heroSubtext?.nativeElement) {
      tl.add({
        targets: this.heroSubtext.nativeElement,
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 380,
      }, '-=320');
    }

    // 6. Feature items stagger from right
    const items = this.featureItems.toArray().map(f => f.nativeElement);
    if (items.length) {
      tl.add({
        targets: items,
        opacity: [0, 1],
        translateX: [20, 0],
        duration: 370,
        delay: anime.stagger(70),
      }, '-=260');
    }

    // 7. Google button scales in
    tl.add({
      targets: this.googleBtn.nativeElement,
      opacity: [0, 1],
      scale: [0.94, 1],
      duration: 400,
    }, '-=200');

    // ── Continuous: ambient orb drift ──
    if (this.ambientOrb?.nativeElement) {
      anime({
        targets: this.ambientOrb.nativeElement,
        translateY: ['-32px', '32px'],
        translateX: ['-18px', '18px'],
        duration: 10000,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine',
      });
    }

    // ── Left panel: hero copy slide in ──
    if (this.heroCopy?.nativeElement) {
      anime({
        targets: this.heroCopy.nativeElement,
        opacity: [0, 1],
        translateY: [32, 0],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo',
      });
    }

    // ── Left panel: stat cards float in + continuous drift ──
    if (this.statCard1?.nativeElement && this.statCard2?.nativeElement) {
      anime({
        targets: [this.statCard1.nativeElement, this.statCard2.nativeElement],
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 620,
        delay: anime.stagger(170, { start: 400 }),
        easing: 'easeOutBack',
      });

      anime({
        targets: this.statCard1.nativeElement,
        translateY: ['-8px', '0px'],
        duration: 3000,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine',
        delay: 1000,
      });
      anime({
        targets: this.statCard2.nativeElement,
        translateY: ['0px', '-10px'],
        duration: 3700,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine',
        delay: 1400,
      });
    }
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.clickUnlockHandler);
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }

  login() {
    this.isLoggingIn.set(true);
    if (this.googleBtn?.nativeElement) {
      anime({
        targets: this.googleBtn.nativeElement,
        scale: [1, 0.96, 1],
        duration: 280,
        easing: 'easeInOutQuad',
      });
    }
    setTimeout(() => this.auth.loginWithGoogle(), 200);
  }
}
