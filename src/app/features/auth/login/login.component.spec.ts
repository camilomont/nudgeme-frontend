import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/services/auth.service';
import anime from 'animejs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['loginWithGoogle']);

    spyOn(LoginComponent.prototype, 'ngAfterViewInit');
    spyOn(anime, 'timeline').and.returnValue({
      add: jasmine.createSpy('add').and.returnValue(undefined as any),
    } as any);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('estado inicial', () => {
    it('deberia crearse', () => {
      expect(component).toBeTruthy();
    });

    it('deberia tener isLoggingIn como false', () => {
      expect(component.isLoggingIn()).toBeFalse();
    });

    it('deberia tener 3 features', () => {
      expect(component.features.length).toBe(3);
    });
  });

  describe('login()', () => {
    it('deberia marcar isLoggingIn y llamar a loginWithGoogle tras 200ms', fakeAsync(() => {
      component.login();
      expect(component.isLoggingIn()).toBeTrue();
      expect(authService.loginWithGoogle).not.toHaveBeenCalled();

      tick(200);
      expect(authService.loginWithGoogle).toHaveBeenCalled();
    }));
  });

  describe('renderizado del template', () => {
    it('deberia mostrar spinner y "Redirigiendo..." cuando isLoggingIn es true', () => {
      component.isLoggingIn.set(true);
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.disabled).toBeTrue();
      expect(btn.querySelector('.spinner')).toBeTruthy();
      expect(btn.textContent).toContain('Redirigiendo...');
    });

    it('deberia mostrar "Continuar con Google" cuando no esta logeando', () => {
      component.isLoggingIn.set(false);
      fixture.detectChanges();
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      expect(btn.disabled).toBeFalse();
      expect(btn.querySelector('.spinner')).toBeFalsy();
      expect(btn.textContent).toContain('Continuar con Google');
    });

    it('deberia renderizar los 3 features en el DOM', () => {
      const text = fixture.nativeElement.textContent;
      expect(text).toContain('Sugerencias IA basadas en tus intereses');
      expect(text).toContain('Progreso visual y barras animadas');
      expect(text).toContain('Tareas adaptadas a tu energía del día');
    });
  });

  describe('ciclo de vida', () => {
    it('deberia limpiar event listeners en ngOnDestroy', () => {
      const spy = spyOn(document, 'removeEventListener');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
