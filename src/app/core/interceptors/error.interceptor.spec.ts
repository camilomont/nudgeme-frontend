import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ToastService } from '@shared/services/toast.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: { url: string; navigate: jasmine.Spy };
  let auth: { user: { set: jasmine.Spy } };
  let toast: { show: jasmine.Spy };

  beforeEach(() => {
    router = { url: '/dashboard', navigate: jasmine.createSpy('navigate') };
    auth = { user: { set: jasmine.createSpy('set') } };
    toast = { show: jasmine.createSpy('show') };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: auth as any },
        { provide: ToastService, useValue: toast },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('cuando la respuesta es 401', () => {
    it('deberia limpiar el usuario y redirigir a /login', () => {
      http.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.error(new ProgressEvent('Error'), { status: 401 });

      expect(auth.user.set).toHaveBeenCalledWith(null);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('NO deberia redirigir si ya estamos en /login', () => {
      router.url = '/login';

      http.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.error(new ProgressEvent('Error'), { status: 401 });

      expect(auth.user.set).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('cuando hay errores de red (status 0)', () => {
    it('deberia mostrar toast de conexion', () => {
      http.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.error(new ProgressEvent('Offline'), { status: 0 });

      expect(toast.show).toHaveBeenCalledWith(
        'No se pudo conectar con el servidor',
        'error',
      );
    });
  });

  describe('cuando hay otros errores HTTP', () => {
    it('deberia mostrar toast con el mensaje del servidor si existe', () => {
      http.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.flush(
        { message: 'Email duplicado' },
        { status: 409, statusText: 'Conflict' },
      );

      expect(toast.show).toHaveBeenCalledWith('Email duplicado', 'error');
    });

    it('deberia usar mensaje generico si el servidor no envia message', () => {
      http.get('/api/test').subscribe({ error: () => {} });

      const req = httpMock.expectOne('/api/test');
      req.flush({}, { status: 500, statusText: 'Server Error' });

      expect(toast.show).toHaveBeenCalledWith(
        'Ocurrió un error inesperado',
        'error',
      );
    });
  });
});
