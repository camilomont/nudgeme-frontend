import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, EMPTY, throwError, map } from 'rxjs';
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
      // TransformInterceptor wraps all responses in { data, statusCode, timestamp }
      .get<{ data: UserProfile }>(`${environment.apiUrl}/auth/me`)
      .pipe(
        map((res) => res.data),
        tap((profile) => {
          this.user.set(profile);
          this.isLoading.set(false);
        }),
        catchError((err) => {
          this.user.set(null);
          this.isLoading.set(false);
          return throwError(() => err);
        }),
      );
  }

  loginWithGoogle() {
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
