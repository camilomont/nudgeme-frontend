import {
  Component,
  inject,
  signal,
  computed,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ApiService } from '@core/services/api.service';
import anime from 'animejs';
import {
  LucideAngularModule,
  Music,
  Dumbbell,
  Gamepad2,
  Palette,
  ChevronLeft,
  ChevronRight,
} from 'lucide-angular';

type Step = 'welcome' | 'interests' | 'energy' | 'done';
const STEPS: Step[] = ['welcome', 'interests', 'energy', 'done'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LucideIcon = any;

interface Category {
  key: string;
  label: string;
  lucideIcon: LucideIcon;
  options: { label: string; icon: string }[];
}

const T = (code: string) => `https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/${code}.svg`;

const INTEREST_CATEGORIES: Category[] = [
  {
    key: 'music', label: 'Música', lucideIcon: Music,
    options: [
      { label: 'Pop',        icon: T('1f3a4') },
      { label: 'Rock',       icon: T('1f3b8') },
      { label: 'Jazz',       icon: T('1f3b7') },
      { label: 'Electrónica',icon: T('1f3a7') },
      { label: 'Reggaeton',  icon: T('1f50a') },
      { label: 'Clásica',    icon: T('1f3bb') },
    ],
  },
  {
    key: 'sports', label: 'Deporte', lucideIcon: Dumbbell,
    options: [
      { label: 'Fútbol',    icon: T('26bd') },
      { label: 'Running',   icon: T('1f3c3') },
      { label: 'Gym',       icon: T('1f4aa') },
      { label: 'Natación',  icon: T('1f3ca') },
      { label: 'Yoga',      icon: T('1f9d8') },
      { label: 'Ciclismo',  icon: T('1f6b4') },
    ],
  },
  {
    key: 'gaming', label: 'Gaming', lucideIcon: Gamepad2,
    options: [
      { label: 'RPG',       icon: T('2694') },
      { label: 'Estrategia',icon: T('265f') },
      { label: 'FPS',       icon: T('1f3af') },
      { label: 'Aventura',  icon: T('1f5fa') },
      { label: 'Deportes',  icon: T('1f3c6') },
      { label: 'Puzzle',    icon: T('1f9e9') },
    ],
  },
  {
    key: 'hobbies', label: 'Hobbies', lucideIcon: Palette,
    options: [
      { label: 'Lectura',    icon: T('1f4da') },
      { label: 'Cocina',     icon: T('1f468-200d-1f373') },
      { label: 'Fotografía', icon: T('1f4f8') },
      { label: 'Dibujo',     icon: T('270f') },
      { label: 'Programar',  icon: T('1f4bb') },
      { label: 'Viajes',     icon: T('2708') },
    ],
  },
];

const ENERGY_OPTIONS = [
  { value: 'morning',   emoji: T('1f305'), label: 'Mañana',    range: '6am – 12pm' },
  { value: 'afternoon', emoji: T('2600'),  label: 'Tarde',     range: '12pm – 6pm' },
  { value: 'evening',   emoji: T('1f306'), label: 'Noche',     range: '6pm – 10pm' },
  { value: 'night',     emoji: T('1f319'), label: 'Madrugada', range: '10pm – 2am' },
];

interface Illus { title: string; subtitle: string; }

const STEP_ILLUS: Record<Step, Illus> = {
  welcome:   { title: '¡Hola! Estoy listo.',        subtitle: 'En 2 minutos tendrás tu plan personalizado con IA.' },
  interests: { title: 'Cuéntame sobre ti',           subtitle: 'Cuantos más gustos compartas, mejores nudges recibirás.' },
  energy:    { title: 'Encuentra tu momento ideal',  subtitle: 'Asignaré tus tareas cuando estés en tu pico de energía.' },
  done:      { title: '¡Lo logramos!',               subtitle: 'Tu primer plan inteligente está siendo creado ahora mismo.' },
};

const CAT_ILLUS: Record<string, Illus> = {
  music:   { title: 'Tu ritmo, tu flow',       subtitle: 'La música impulsa tu productividad y estado de ánimo.' },
  sports:  { title: 'En movimiento constante', subtitle: 'La actividad física potencia tu enfoque y energía.' },
  gaming:  { title: 'Juega en la vida real',   subtitle: 'Gana logros reales igual que en tus juegos favoritos.' },
  hobbies: { title: 'Crea tu mejor versión',   subtitle: 'Tus pasiones son el combustible de tu motivación.' },
};

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent implements AfterViewInit, OnDestroy {
  private readonly auth   = inject(AuthService);
  private readonly api    = inject(ApiService);
  private readonly router = inject(Router);

  @ViewChild('stepContent') stepContent!: ElementRef;
  @ViewChild('charCard')    charCard!: ElementRef;
  @ViewChild('illusCopy')   illusCopy!: ElementRef;
  @ViewChild('loadingBar')  loadingBar!: ElementRef;

  readonly ChevronLeft  = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  readonly STEPS         = STEPS;
  readonly step          = signal<Step>('welcome');
  readonly currentIndex  = computed(() => STEPS.indexOf(this.step()));
  readonly isSaving      = signal(false);
  readonly activeCategory = signal<string>('music');

  // Carousel: show 3 of 4 categories at a time
  readonly carouselStart  = signal(0);
  readonly visibleCats    = computed(() => INTEREST_CATEGORIES.slice(this.carouselStart(), this.carouselStart() + 3));
  readonly canScrollLeft  = computed(() => this.carouselStart() > 0);
  readonly canScrollRight = computed(() => this.carouselStart() + 3 < INTEREST_CATEGORIES.length);
  readonly catDots        = computed(() => {
    const positions = INTEREST_CATEGORIES.length - 3 + 1;
    return Array.from({ length: positions }, (_, i) => i === this.carouselStart());
  });

  readonly selectedInterests = signal<Record<string, string[]>>({ music: [], sports: [], gaming: [], hobbies: [] });
  readonly energyPeaks       = signal<string[]>([]);

  readonly categories    = INTEREST_CATEGORIES;
  readonly energyOptions = ENERGY_OPTIONS;

  readonly firstName = computed(() => this.auth.user()?.name?.split(' ')[0] ?? '');
  readonly currentCategoryOptions = computed(() =>
    INTEREST_CATEGORIES.find(c => c.key === this.activeCategory())?.options ?? []
  );
  readonly totalSelected = computed(() => Object.values(this.selectedInterests()).flat().length);
  readonly currentIllus  = computed<Illus>(() =>
    this.step() === 'interests'
      ? (CAT_ILLUS[this.activeCategory()] ?? STEP_ILLUS.interests)
      : STEP_ILLUS[this.step()]
  );

  readonly welcomeFeatures = [
    { icon: T('1f9e0'), label: 'Sugerencias IA basadas en tus intereses' },
    { icon: T('26a1'),  label: 'Tareas adaptadas a tu energía del día' },
    { icon: T('1f4c8'), label: 'Progreso visual y metas personalizadas' },
  ];

  ngAfterViewInit() {
    this.animateCharEntrance();
    this.animateStepIn();
  }

  ngOnDestroy() {}

  private animateCharEntrance() {
    if (this.charCard?.nativeElement) {
      anime({
        targets: this.charCard.nativeElement,
        opacity: [0, 1],
        translateY: [32, 0],
        scale: [0.92, 1],
        duration: 800,
        delay: 200,
        easing: 'easeOutBack',
      });
    }
  }

  private animateStepIn() {
    anime({
      targets: this.stepContent?.nativeElement,
      opacity: [0, 1],
      translateX: [-24, 0],
      duration: 560,
      easing: 'easeOutExpo',
    });
    if (this.illusCopy?.nativeElement) {
      anime({
        targets: this.illusCopy.nativeElement,
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 480,
        delay: 160,
        easing: 'easeOutExpo',
      });
    }
  }

  selectCategory(key: string) {
    this.activeCategory.set(key);
    if (this.illusCopy?.nativeElement) {
      anime({
        targets: this.illusCopy.nativeElement,
        opacity: [0.3, 1],
        translateY: [10, 0],
        duration: 300,
        easing: 'easeOutExpo',
      });
    }
  }

  carouselPrev() {
    if (this.canScrollLeft()) this.carouselStart.update(v => v - 1);
  }

  carouselNext() {
    if (this.canScrollRight()) this.carouselStart.update(v => v + 1);
  }

  next() {
    this.transitionStep(() => {
      const idx = this.currentIndex();
      if (idx < STEPS.length - 1) this.step.set(STEPS[idx + 1]);
    });
  }

  prev() {
    this.transitionStep(() => {
      const idx = this.currentIndex();
      if (idx > 0) this.step.set(STEPS[idx - 1]);
    });
  }

  private transitionStep(change: () => void) {
    const tl = anime.timeline({ easing: 'easeInQuad' });
    tl.add({
      targets: this.stepContent?.nativeElement,
      opacity: [1, 0],
      translateX: [0, -20],
      duration: 200,
    });
    if (this.illusCopy?.nativeElement) {
      tl.add({
        targets: this.illusCopy.nativeElement,
        opacity: [1, 0],
        translateY: [0, -8],
        duration: 180,
      }, 0);
    }
    tl.finished.then(() => {
      change();
      setTimeout(() => this.animateStepIn(), 40);
    });
  }

  toggleInterest(category: string, value: string) {
    this.selectedInterests.update(prev => {
      const current = prev[category] ?? [];
      return { ...prev, [category]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] };
    });
  }

  toggleEnergy(value: string) {
    this.energyPeaks.update(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  }

  isSelected(category: string, value: string): boolean {
    return this.selectedInterests()[category]?.includes(value) ?? false;
  }

  isEnergySelected(value: string): boolean {
    return this.energyPeaks().includes(value);
  }

  finish() {
    this.isSaving.set(true);
    this.api.patch('/users/preferences', {
      preferences: this.selectedInterests(),
      energyPeaks: this.energyPeaks(),
      onboardingCompleted: true,
    }).subscribe({
      next: () => {
        this.step.set('done');
        this.auth.loadProfile().subscribe({
          next: () => this.animateAndNavigate(),
          error: () => this.animateAndNavigate(),
        });
      },
      error: () => this.isSaving.set(false),
    });
  }

  private animateAndNavigate() {
    setTimeout(() => {
      if (this.loadingBar?.nativeElement) {
        anime({
          targets: this.loadingBar.nativeElement,
          width: '100%',
          duration: 1200,
          easing: 'easeInOutQuart',
          complete: () => this.router.navigate(['/dashboard']),
        });
      } else {
        this.router.navigate(['/dashboard']);
      }
    }, 80);
  }
}
