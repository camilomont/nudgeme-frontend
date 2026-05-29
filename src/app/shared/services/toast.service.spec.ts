import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('deberia agregar un toast a la lista con los datos correctos', () => {
      service.show('Hola mundo', 'success');

      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Hola mundo');
      expect(service.toasts()[0].type).toBe('success');
      expect(service.toasts()[0].id).toBeDefined();
    });

    it('deberia usar info como tipo por defecto', () => {
      service.show('Test');

      expect(service.toasts()[0].type).toBe('info');
    });

    it('deberia usar 4000ms como duration por defecto', () => {
      service.show('Test');

      expect(service.toasts()[0].duration).toBe(4000);
    });

    it('deberia poder mostrar multiples toasts', () => {
      service.show('Uno');
      service.show('Dos');
      service.show('Tres');

      expect(service.toasts().length).toBe(3);
    });

    it('con duration 0 no deberia auto-descartar el toast', fakeAsync(() => {
      service.show('Persistente', 'info', 0);

      tick(5000);

      expect(service.toasts().length).toBe(1);
    }));

    it('con duration > 0 deberia auto-descartar el toast despues del tiempo', fakeAsync(() => {
      service.show('Se va', 'info', 1000);

      expect(service.toasts().length).toBe(1);

      tick(1000);

      expect(service.toasts().length).toBe(0);
    }));
  });

  describe('dismiss', () => {
    it('deberia remover el toast por su id', () => {
      service.show('Uno');
      service.show('Dos');
      const id = service.toasts()[0].id;

      service.dismiss(id);

      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Dos');
    });

    it('no deberia fallar si el id no existe', () => {
      service.show('Unico');

      service.dismiss('id-inexistente');

      expect(service.toasts().length).toBe(1);
    });
  });
});
