import {
  Component,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { ApiService } from '@core/services/api.service';
import { AnimeEntranceDirective } from '@shared/directives/anime-entrance.directive';

type Step = 'welcome' | 'interests' | 'energy' | 'done';

const INTEREST_OPTIONS = {
  music:   ['Pop', 'Rock', 'Jazz', 'Electrónica', 'Reggaeton', 'Clásica', 'Hip-Hop', 'Metal'],
  sports:  ['Fútbol', 'Natación', 'Running', 'Gym', 'Ciclismo', 'Tenis', 'Yoga', 'Baloncesto'],
  gaming:  ['RPG', 'Estrategia', 'FPS', 'Aventura', 'Deportes', 'Puzzle', 'Simulación'],
  hobbies: ['Lectura', 'Cocina', 'Fotografía', 'Dibujo', 'Jardinería', 'Viajes', 'Programar'],
};

const ENERGY_OPTIONS = [
  { value: 'morning',   label: '🌅 Mañana',   desc: '6am – 12pm' },
  { value: 'afternoon', label: '☀️ Tarde',    desc: '12pm – 6pm' },
  { value: 'evening',   label: '🌆 Noche',    desc: '6pm – 10pm' },
  { value: 'night',     label: '🌙 Madrugada', desc: '10pm – 2am' },
];

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, AnimeEntranceDirective],
  template: `
    <div class="min-h-screen flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-xl">

        <!-- Step indicator -->
        <div class="mb-8 flex items-center justify-center gap-2">
          @for (s of steps; track s; let i = $index) {
            <div
              class="h-2 rounded-full transition-all duration-500"
              [class]="i <= currentStepIndex() ? 'w-8 bg-lavender-400' : 'w-2 bg-white/20'"
            ></div>
          }
        </div>

        <!-- Welcome step -->
        @if (step() === 'welcome') {
          <div [animeEntrance]="'floatIn'" class="glass-card p-8 text-center">
            <div class="mb-6 text-6xl">👋</div>
            <h2 class="mb-3 text-2xl font-bold text-pastel-gradient font-display">
              ¡Hola, {{ user()?.name?.split(' ')[0] }}!
            </h2>
            <p class="mb-8 text-slate-400">
              Cuéntame sobre ti para personalizar tus nudges. Solo toma 2 minutos.
            </p>
            <button (click)="nextStep()" class="btn-primary">
              Empezar 🚀
            </button>
          </div>
        }

        <!-- Interests step -->
        @if (step() === 'interests') {
          <div [animeEntrance]="'slideUp'" class="glass-card p-8">
            <h2 class="mb-2 text-xl font-bold text-slate-100">¿Qué te apasiona?</h2>
            <p class="mb-6 text-sm text-slate-400">Selecciona todo lo que quieras</p>

            @for (category of interestCategories; track category.key) {
              <div class="mb-5">
                <h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {{ category.label }}
                </h3>
                <div class="flex flex-wrap gap-2">
                  @for (opt of category.options; track opt) {
                    <button
                      (click)="toggleInterest(category.key, opt)"
                      class="tag-chip border transition-all duration-200"
                      [class]="isSelected(category.key, opt)
                        ? 'border-lavender-400/60 bg-lavender-400/20 text-lavender-200'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'"
                    >
                      {{ opt }}
                    </button>
                  }
                </div>
              </div>
            }

            <button (click)="nextStep()" [disabled]="totalSelected() < 3" class="btn-primary mt-4 w-full disabled:opacity-40">
              Continuar →
            </button>
          </div>
        }

        <!-- Energy step -->
        @if (step() === 'energy') {
          <div [animeEntrance]="'slideUp'" class="glass-card p-8">
            <h2 class="mb-2 text-xl font-bold text-slate-100">¿Cuándo tienes más energía?</h2>
            <p class="mb-6 text-sm text-slate-400">Puedes elegir varios momentos</p>

            <div class="grid grid-cols-2 gap-3">
              @for (opt of energyOptions; track opt.value) {
                <button
                  (click)="toggleEnergy(opt.value)"
                  class="rounded-xl border p-4 text-left transition-all duration-200"
                  [class]="isEnergySelected(opt.value)
                    ? 'border-mint-300/60 bg-mint-300/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'"
                >
                  <div class="text-2xl">{{ opt.label.split(' ')[0] }}</div>
                  <div class="mt-1 text-sm font-medium text-slate-200">{{ opt.label.split(' ').slice(1).join(' ') }}</div>
                  <div class="text-xs text-slate-500">{{ opt.desc }}</div>
                </button>
              }
            </div>

            <button
              (click)="finish()"
              [disabled]="energyPeaks().length === 0 || isSaving()"
              class="btn-primary mt-6 w-full disabled:opacity-40"
            >
              {{ isSaving() ? 'Guardando...' : 'Comenzar mi journey ✨' }}
            </button>
          </div>
        }

        <!-- Done step -->
        @if (step() === 'done') {
          <div [animeEntrance]="'scaleIn'" class="glass-card p-8 text-center">
            <div class="mb-4 text-6xl">🎉</div>
            <h2 class="mb-3 text-2xl font-bold text-pastel-gradient font-display">¡Todo listo!</h2>
            <p class="text-slate-400">Redirigiendo a tu dashboard...</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .btn-primary {
      @apply rounded-xl bg-gradient-to-r from-lavender-400 to-sky-300 px-6 py-3 font-semibold text-slate-900 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-lavender-400/30 active:scale-[0.98];
    }
  `],
})
export class OnboardingComponent {
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  readonly user = this.auth.user;
  readonly steps: Step[] = ['welcome', 'interests', 'energy', 'done'];
  readonly step = signal<Step>('welcome');
  readonly currentStepIndex = computed(() => this.steps.indexOf(this.step()));
  readonly isSaving = signal(false);

  readonly selectedInterests = signal<Record<string, string[]>>({
    music: [], sports: [], gaming: [], hobbies: [],
  });
  readonly energyPeaks = signal<string[]>([]);

  readonly interestCategories = [
    { key: 'music', label: 'Música', options: INTEREST_OPTIONS.music },
    { key: 'sports', label: 'Deporte', options: INTEREST_OPTIONS.sports },
    { key: 'gaming', label: 'Gaming', options: INTEREST_OPTIONS.gaming },
    { key: 'hobbies', label: 'Hobbies', options: INTEREST_OPTIONS.hobbies },
  ];
  readonly energyOptions = ENERGY_OPTIONS;

  readonly totalSelected = computed(() =>
    Object.values(this.selectedInterests()).flat().length,
  );

  nextStep() {
    const idx = this.currentStepIndex();
    if (idx < this.steps.length - 1) {
      this.step.set(this.steps[idx + 1]);
    }
  }

  toggleInterest(category: string, value: string) {
    this.selectedInterests.update((prev) => {
      const current = prev[category] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  }

  toggleEnergy(value: string) {
    this.energyPeaks.update((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
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
    this.api
      .patch('/users/preferences', {
        preferences: this.selectedInterests(),
        energyPeaks: this.energyPeaks(),
        onboardingCompleted: true,
      })
      .subscribe({
        next: () => {
          this.step.set('done');
          setTimeout(() => this.router.navigate(['/dashboard']), 1500);
        },
        error: () => this.isSaving.set(false),
      });
  }
}
