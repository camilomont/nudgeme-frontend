import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '@env/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockProfile = {
    data: {
      id: '507f191e810c19729de860ea',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://avatar.com/photo.jpg',
      onboardingCompleted: true,
      preferences: { music: [], sports: [], hobbies: [], gaming: [], other: [] },
      energyPeaks: ['morning'],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadProfile', () => {
    it('deberia cargar el perfil y actualizar la señal user', () => {
      let result: any;
      service.loadProfile().subscribe((r) => (result = r));

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProfile);

      expect(result).toEqual(mockProfile.data);
      expect(service.user()).toEqual(mockProfile.data);
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.isLoading()).toBeFalse();
    });

    it('deberia establecer user a null si la peticion falla', () => {
      service.loadProfile().subscribe({ error: () => {} });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
      req.error(new ProgressEvent('Error'), { status: 401 });

      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBeFalse();
      expect(service.isLoading()).toBeFalse();
    });

    it('deberia compartir la misma peticion si se llama varias veces', () => {
      service.loadProfile().subscribe();
      service.loadProfile().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
      req.flush(mockProfile);

      expect(service.user()).toEqual(mockProfile.data);
    });
  });

  describe('loginWithGoogle', () => {
    it('deberia redirigir a la URL de Google OAuth', () => {
      const redirectSpy = spyOn(service as any, 'redirectTo');

      service.loginWithGoogle();

      expect(redirectSpy).toHaveBeenCalledWith(`${environment.apiUrl}/auth/google`);
    });
  });

  describe('logout', () => {
    it('deberia limpiar el usuario y navegar a /login', () => {
      service.user.set(mockProfile.data as any);
      service.logout();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(req.request.method).toBe('GET');
      req.flush({});

      expect(service.user()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('deberia tolerar errores del servidor', () => {
      service.user.set(mockProfile.data as any);
      service.logout();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      req.error(new ProgressEvent('Error'), { status: 500 });

      expect(service.user()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
