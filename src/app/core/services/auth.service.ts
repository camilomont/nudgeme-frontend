import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, EMPTY } from 'rxjs';
import { environment } from '@env/environment';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  onboardingCompleted: boolean;
  preferences: {
    music: string[];
    sports: string[];
    hobbies: string[];
    gaming: string[];
    other: string[];
  };
  energyPeaks: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly user = signal<UserProfile | null>(null);
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isLoading = signal(false);

  loadProfile() {
    this.isLoading.set(true);
    return this.http
      .get<UserProfile>(`${environment.apiUrl}/auth/me`)
      .pipe(
        tap((profile) => {
          this.user.set(profile);
          this.isLoading.set(false);
        }),
        catchError(() => {
          this.user.set(null);
          this.isLoading.set(false);
          return EMPTY;
        }),
      );
  }

  loginWithGoogle() {
    // Redirect browser to backend Google OAuth entry point
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  logout() {
    this.http
      .get(`${environment.apiUrl}/auth/logout`)
      .pipe(
        tap(() => {
          this.user.set(null);
          this.router.navigate(['/login']);
        }),
        catchError(() => EMPTY),
      )
      .subscribe();
  }
}
