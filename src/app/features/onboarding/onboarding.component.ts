import {
  Component,
  inject,
  signal,
  computed,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ApiService } from '@core/services/api.service';
import anime from 'animejs';

type Step = 'welcome' | 'interests' | 'energy' | 'done';

const STEPS: Step[] = ['welcome', 'interests', 'energy', 'done'];

const INTEREST_CATEGORIES = [
  {
    key: 'music',
    label: 'Música',
    icon: '🎵',
    options: [
      { label: 'Pop',        icon: '🎤' },
      { label: 'Rock',       icon: '🎸' },
      { label: 'Jazz',       icon: '🎷' },
      { label: 'Electrónica',icon: '🎧' },
      { label: 'Reggaeton',  icon: '🔊' },
      { label: 'Clásica',    icon: '🎻' },
    ],
  },
  {
    key: 'sports',
    label: 'Deporte',
    icon: '⚽',
    options: [
      { label: 'Fútbol',     icon: '⚽' },
      { label: 'Running',    icon: '🏃' },
      { label: 'Gym',        icon: '💪' },
      { label: 'Natación',   icon: '🏊' },
      { label: 'Yoga',       icon: '🧘' },
      { label: 'Ciclismo',   icon: '🚴' },
    ],
  },
  {
    key: 'gaming',
    label: 'Gaming',
    icon: '🎮',
    options: [
      { label: 'RPG',         icon: '⚔️' },
      { label: 'Estrategia',  icon: '♟️' },
      { label: 'FPS',         icon: '🎯' },
      { label: 'Aventura',    icon: '🗺️' },
      { label: 'Deportes',    icon: '🏆' },
      { label: 'Puzzle',      icon: '🧩' },
    ],
  },
  {
    key: 'hobbies',
    label: 'Hobbies',
    icon: '🎨',
    options: [
      { label: 'Lectura',     icon: '📚' },
      { label: 'Cocina',      icon: '👨‍🍳' },
      { label: 'Fotografía',  icon: '📸' },
      { label: 'Dibujo',      icon: '✏️' },
      { label: 'Programar',   icon: '💻' },
      { label: 'Viajes',      icon: '✈️' },
    ],
  },
];

const ENERGY_OPTIONS = [
  { value: 'morning',   emoji: '🌅', label: 'Mañana',    range: '6am – 12pm' },
  { value: 'afternoon', emoji: '☀️', label: 'Tarde',     range: '12pm – 6pm' },
  { value: 'evening',   emoji: '🌆', label: 'Noche',     range: '6pm – 10pm' },
  { value: 'night',     emoji: '🌙', label: 'Madrugada', range: '10pm – 2am' },
];

const STEP_ILLUS: Record<Step, { emoji: string; title: string; subtitle: string; bg: string }> = {
  welcome:   { emoji: '👋', title: '¡Bienvenido!',        subtitle: 'En 2 minutos tendrás tu plan personalizado',    bg: 'linear-gradient(135deg, #e9d5ff 0%, #bae6fd 100%)' },
  interests: { emoji: '🎯', title: 'Cuéntanos sobre ti',  subtitle: 'Cuantos más gustos compartas, mejores nudges',  bg: 'linear-gradient(135deg, #bae6fd 0%, #bbf7d0 100%)' },
  energy:    { emoji: '⚡', title: 'Tu momento ideal',    subtitle: 'Asignaremos tareas cuando estés en tu pico',    bg: 'linear-gradient(135deg, #bbf7d0 0%, #fed7aa 100%)' },
  done:      { emoji: '🎉', title: '¡Todo listo!',        subtitle: 'Tu primer plan está siendo creado con IA...',   bg: 'linear-gradient(135deg, #fed7aa 0%, #e9d5ff 100%)' },
};

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent implements AfterViewInit {
  private readonly auth   = inject(AuthService);
  private readonly api    = inject(ApiService);
  private readonly router = inject(Router);

  @ViewChild('stepContent') stepContent!: ElementRef;
  @ViewChild('illusPanel')  illusPanel!: ElementRef;
  @ViewChild('illusEmoji')  illusEmoji!: ElementRef;
  @ViewChild('loadingBar')  loadingBar!: ElementRef;

  readonly STEPS = STEPS;

  readonly step         = signal<Step>('welcome');
  readonly currentIndex = computed(() => STEPS.indexOf(this.step()));
  readonly isSaving     = signal(false);
  readonly activeCategory = signal<string>('music');
  readonly activeCategoryKey = this.activeCategory;

  readonly selectedInterests = signal<Record<string, string[]>>({
    music: [], sports: [], gaming: [], hobbies: [],
  });
  readonly energyPeaks = signal<string[]>([]);

  readonly categories   = INTEREST_CATEGORIES;
  readonly energyOptions = ENERGY_OPTIONS;

  readonly firstName = computed(() => this.auth.user()?.name?.split(' ')[0] ?? '');

  readonly currentCategoryOptions = computed(() =>
    INTEREST_CATEGORIES.find(c => c.key === this.activeCategory())?.options ?? []
  );

  readonly totalSelected = computed(() =>
    Object.values(this.selectedInterests()).flat().length
  );

  readonly currentIllus = computed(() => STEP_ILLUS[this.step()]);

  ngAfterViewInit() {
    this.animateStepIn();
  }

  private animateStepIn() {
    anime({
      targets: this.stepContent?.nativeElement,
      opacity: [0, 1],
      translateX: [-24, 0],
      duration: 500,
      easing: 'easeOutExpo',
    });
    if (this.illusEmoji?.nativeElement) {
      anime({
        targets: this.illusEmoji.nativeElement,
        scale: [0.85, 1],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutBack',
      });
    }
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
    anime({
      targets: this.stepContent?.nativeElement,
      opacity: [1, 0],
      translateX: [0, -20],
      duration: 200,
      easing: 'easeInQuad',
      complete: () => {
        change();
        setTimeout(() => this.animateStepIn(), 50);
      },
    });
  }

  toggleInterest(category: string, value: string) {
    this.selectedInterests.update(prev => {
      const current = prev[category] ?? [];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value],
      };
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

        // Reload profile so auth.user() reflects onboardingCompleted: true
        // before the onboardingGuard runs — otherwise it loops back here.
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
          duration: 1000,
          easing: 'easeInOutQuart',
          complete: () => this.router.navigate(['/dashboard']),
        });
      } else {
        this.router.navigate(['/dashboard']);
      }
    }, 80);
  }
}
