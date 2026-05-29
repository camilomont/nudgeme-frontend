import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ToastContainerComponent } from './toast-container.component';
import { ToastService } from '@shared/services/toast.service';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let mockToastService: {
    toasts: ReturnType<typeof signal<any[]>>;
    dismiss: jasmine.Spy;
  };

  beforeEach(async () => {
    mockToastService = {
      toasts: signal([]),
      dismiss: jasmine.createSpy('dismiss'),
    };

    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
      providers: [{ provide: ToastService, useValue: mockToastService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deberia crearse', () => {
    expect(component).toBeTruthy();
  });

  it('deberia mostrar un toast con su mensaje y tipo', () => {
    mockToastService.toasts.set([
      { id: '1', message: 'Operación exitosa', type: 'success', duration: 4000 },
    ]);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Operación exitosa');
    expect(el.querySelector('.toast-success')).toBeTruthy();
  });

  it('deberia renderizar varios toasts', () => {
    mockToastService.toasts.set([
      { id: '1', message: 'Uno', type: 'info', duration: 4000 },
      { id: '2', message: 'Dos', type: 'error', duration: 4000 },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.toast').length).toBe(2);
  });

  it('deberia aplicar la clase CSS segun el tipo', () => {
    mockToastService.toasts.set([
      { id: '1', message: 'Error', type: 'error', duration: 4000 },
      { id: '2', message: 'Warning', type: 'warning', duration: 4000 },
      { id: '3', message: 'Info', type: 'info', duration: 4000 },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.toast-error')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.toast-warning')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.toast-info')).toBeTruthy();
  });

  it('deberia estar vacio cuando no hay toasts', () => {
    mockToastService.toasts.set([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.toast').length).toBe(0);
  });

  it('deberia llamar dismiss con el id correcto al cerrar', () => {
    mockToastService.toasts.set([
      { id: 'abc-123', message: 'Cerrarme', type: 'success', duration: 4000 },
    ]);
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('.toast-close') as HTMLElement;
    closeBtn.click();

    expect(mockToastService.dismiss).toHaveBeenCalledWith('abc-123');
  });
});
