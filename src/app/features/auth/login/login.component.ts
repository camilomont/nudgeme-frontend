import { Component, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { FloatingParticlesComponent } from '@shared/components/floating-particles/floating-particles.component';
import { AnimeEntranceDirective } from '@shared/directives/anime-entrance.directive';
import anime from 'animejs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FloatingParticlesComponent, AnimeEntranceDirective],
  template: `
    <div class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <nm-floating-particles />

      <!-- Aceternity-style glowing background orbs -->
      <div class="pointer-events-none absolute inset-0 z-0">
        <div class="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-lavender-400/20 blur-3xl animate-float"></div>
        <div class="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl animate-float" style="animation-delay: -2s"></div>
        <div class="absolute top-1/2 left-1/2 h-32 w-32 rounded-full bg-mint-400/15 blur-2xl animate-float" style="animation-delay: -4s"></div>
      </div>

      <!-- Login card -->
      <div
        [animeEntrance]="'floatIn'"
        [animeDuration]="800"
        class="relative z-10 w-full max-w-md px-6"
      >
        <div class="gradient-border p-8 text-center">
          <!-- Logo / brand -->
          <div class="mb-8">
            <div
              #logo
              class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-lavender-300 to-sky-300 text-3xl shadow-lg animate-glow"
            >
              🎯
            </div>
            <h1 class="text-3xl font-bold text-pastel-gradient font-display">NudgeMe</h1>
            <p class="mt-2 text-sm text-slate-400">
              Tu asistente anti-procrastinación con IA
            </p>
          </div>

          <!-- Value props -->
          <div class="mb-8 space-y-3 text-left">
            @for (feature of features; track feature.icon) {
              <div
                [animeEntrance]="'slideUp'"
                [animeDelay]="$index * 100 + 300"
                class="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3"
              >
                <span class="text-xl">{{ feature.icon }}</span>
                <span class="text-sm text-slate-300">{{ feature.text }}</span>
              </div>
            }
          </div>

          <!-- Google login button -->
          <button
            (click)="login()"
            class="group relative w-full overflow-hidden rounded-xl bg-white px-6 py-3 font-semibold text-slate-800 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lavender-400/30 hover:shadow-xl active:scale-[0.98]"
          >
            <div class="flex items-center justify-center gap-3">
              <svg class="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continuar con Google</span>
            </div>
          </button>

          <p class="mt-4 text-xs text-slate-500">
            Al continuar aceptas nuestros términos de uso
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);

  readonly features = [
    { icon: '🧠', text: 'Sugerencias de tareas personalizadas con IA' },
    { icon: '📊', text: 'Progreso visual en tiempo real' },
    { icon: '⚡', text: 'Adapta las tareas a tu energía del día' },
  ];

  login() {
    this.auth.loginWithGoogle();
  }
}
