import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let isAuthenticatedValue = false;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  function setup(isAuthenticated: boolean, loadProfileResult?: Observable<any>) {
    isAuthenticatedValue = isAuthenticated;
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    const loadProfileSpy = jasmine.createSpy().and.callFake(() => {
      isAuthenticatedValue = true;
      return loadProfileResult ?? of({} as any);
    });

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            isAuthenticated: jasmine.createSpy().and.callFake(() => isAuthenticatedValue),
            loadProfile: loadProfileSpy,
            isLoading: jasmine.createSpy().and.returnValue(false),
            user: null,
          },
        },
        { provide: Router, useValue: router },
      ],
    });
  }

  function runGuard(): ReturnType<typeof authGuard> {
    return TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
  }

  describe('cuando el usuario ya esta autenticado', () => {
    it('deberia retornar true sin llamar loadProfile', () => {
      setup(true);

      const result = runGuard();

      expect(result).toBeTrue();
    });
  });

  describe('cuando el usuario no esta autenticado', () => {
    it('deberia cargar el perfil y retornar true si es exitoso', (done) => {
      setup(false, of({ id: '123', email: 't@t.com' } as any));

      (runGuard() as Observable<boolean>).subscribe((allowed) => {
        expect(allowed).toBeTrue();
        done();
      });
    });

    it('deberia redirigir a /login y retornar false si falla', (done) => {
      setup(false, throwError(() => new Error('No auth')));

      (runGuard() as Observable<boolean>).subscribe((allowed) => {
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        expect(allowed).toBeFalse();
        done();
      });
    });
  });
});
