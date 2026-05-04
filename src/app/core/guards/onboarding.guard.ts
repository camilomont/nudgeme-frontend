import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const onboardingGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();

  if (!user) return true;

  if (!user.onboardingCompleted) {
    router.navigate(['/onboarding']);
    return false;
  }

  return true;
};
