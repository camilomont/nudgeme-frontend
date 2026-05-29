# ADR-003: Testing Strategy

**Fecha:** 2026-05-29

## Contexto

Necesitamos una estrategia de testing consistente para backend (NestJS) y frontend (Angular). Backend no tenía tests al inicio; frontend tenía la configuración de Karma + Jasmine por defecto de Angular CLI.

## Decisión

| Capa | Framework | Configuración |
|------|-----------|---------------|
| **Backend** | Jest + ts-jest | `jest.config.js` con mapeo de path aliases (`@modules/`, `@common/`, `@config/`) |
| **Frontend** | Jasmine 5.4 + Karma 6.4 | `angular.json` con `ChromeHeadless` (usando Edge en Windows por falta de Chrome) |

## Razones

### Backend — Jest
- NestJS genera proyectos con Jest por defecto
- `@nestjs/testing` se integra nativamente con Jest (`Test.createTestingModule`)
- ts-jest permite correr tests directamente sobre TypeScript sin compilar
- Mejor DX que Jasmine para testing de servicios con mocks

### Frontend — Jasmine + Karma
- Angular CLI genera Jasmine + Karma por defecto (no Jest)
- Migrar a Jest requeriría cambiar el builder de Angular y configurar `jest-preset-angular`
- Jasmine tiene `jasmine.createSpy` y `jasmine.createSpyObj` para mocks ligeros
- `HttpTestingController` de `@angular/common/http/testing` funciona con ambos

## Patrones de Testing

### Backend (Jest)

```typescript
// Servicio: mock de dependencias
const module = await Test.createTestingModule({
  providers: [
    AuthService,
    { provide: JwtService, useValue: mockJwtService },
  ],
}).compile();

// Filter: instanciar directamente y llamar catch()
const filter = new HttpExceptionFilter();
filter.catch(exception, mockHost);
expect(mockResponse.json).toHaveBeenCalledWith(/* ... */);
```

### Frontend (Jasmine)

```typescript
// Componente standalone
await TestBed.configureTestingModule({
  imports: [MiComponente],
  providers: [
    { provide: MiServicio, useValue: mockService },
  ],
}).compileComponents();

// HTTP interceptor
providers: [
  provideHttpClient(withInterceptors([errorInterceptor])),
  provideHttpClientTesting(),
  { provide: ToastService, useValue: mockToast },
]

// Mock de servicios: objetos planos con spies
const mockService = {
  data: signal([]),
  method: jasmine.createSpy('method'),
};

// Tests con temporizadores
fakeAsync(() => {
  component.login();
  tick(200);  // setTimeout de 200ms
  expect(auth.loginWithGoogle).toHaveBeenCalled();
});
```

## Consecuencias

- Backend y frontend usan frameworks diferentes, pero los patrones son similares (`describe`/`beforeEach`/`it`)
- No se puede compartir config entre proyectos
- Frontend requiere `CHROME_BIN` apuntando a Edge en Windows (no hay Chrome instalado)
- Los tests de interceptores necesitan `provideHttpClient(withInterceptors([...]))` + `HttpTestingController`
- Los guards funcionales necesitan `TestBed.runInInjectionContext()` para que `inject()` funcione

## Coverage

| Capa | Tests | Suites |
|------|-------|--------|
| Backend | 21 | 4 |
| Frontend | 38 | 6 |
| **Total** | **59** | **10** |
