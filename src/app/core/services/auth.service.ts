import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, EMPTY, throwError } from 'rxjs';
import { tap, catchError, map, share, finalize } from 'rxjs/operators';
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

  private profileRequest$: Observable<UserProfile> | null = null;

  loadProfile(): Observable<UserProfile> {
    if (this.profileRequest$) return this.profileRequest$;

    this.isLoading.set(true);
    this.profileRequest$ = this.http
      .get<{ data: UserProfile }>(`${environment.apiUrl}/auth/me`)
      .pipe(
        map((res) => res.data),
        tap((profile) => this.user.set(profile)),
        catchError((err) => {
          this.user.set(null);
          return throwError(() => err);
        }),
        finalize(() => {
          this.isLoading.set(false);
          this.profileRequest$ = null;
        }),
        share(),
      );

    return this.profileRequest$;
  }

  loginWithGoogle() {
    this.redirectTo(`${environment.apiUrl}/auth/google`);
  }

  private redirectTo(url: string) {
    window.location.href = url;
  }

  logout() {
    const clearSession = () => {
      this.user.set(null);
      this.router.navigate(['/login']);
    };

    this.http
      .get(`${environment.apiUrl}/auth/logout`)
      .pipe(
        tap(clearSession),
        catchError(() => {
          clearSession();
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
