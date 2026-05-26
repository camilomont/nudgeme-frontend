# Code Review: Módulo Onboarding — Frontend

## Hallazgos

### 1. Dualidad de energyLevel — onboarding vs dashboard
- **Onboarding** (`onboarding.component.ts:356-358`): Guarda `energyLevel` vía `PATCH /users/preferences`
- **Dashboard** (`db-energy-widget.component.ts:14`): Tiene `energyLevel = 80` hardcoded, nunca carga el valor guardado
- El usuario ajusta su energía en onboarding → se guarda en backend → pero el dashboard no lo refleja
- **Severidad:** Alta
- **Sugerencia:** `DbEnergyWidgetComponent` debe cargar `user.energyLevel` desde `AuthService.user()` y opcionalmente persistir cambios

### 2. onBoarding sin validación visual de guardado
**Archivo:** `onboarding.component.ts:368-384`
```typescript
finish() {
  this.isSaving.set(true);
  this.api.patch('/users/preferences', {...}).subscribe({
    next: () => { ... },
    error: () => this.isSaving.set(false),
  });
}
```
- Si la llamada falla, `isSaving` vuelve a `false` y el botón se rehabilita, pero no hay mensaje de error para el usuario
- **Severidad:** Media
- **Sugerencia:** En el `error`, mostrar un mensaje tipo "Error al guardar, intenta de nuevo"

### 3. Emojis cargados desde CDN externa
**Archivo:** `onboarding.component.ts:43`
```typescript
const T = (code: string) => `https://cdn.jsdelivr.net/npm/twemoji@latest/2/svg/${code}.svg`;
```
- Las opciones de intereses y los emojis de energía dependen de un CDN externo (jsdelivr)
- Si el CDN falla o hay problemas de red, los emojis no se muestran
- **Severidad:** Baja
- **Sugerencia:** Usar emojis nativos Unicode en lugar de SVGs externos

### 4. Guard de onboarding no maneja estado null
**Archivo:** `onboarding.guard.ts:10`
```typescript
if (!user) return true;
```
- Si `auth.user()` es `null` (aún cargando), el guard deja pasar al dashboard
- El `authGuard` ya ejecuta `loadProfile()` antes, pero si hay race condition puede pasar
- **Severidad:** Baja

## Resumen
| # | Hallazgo | Severidad | Archivo |
|---|----------|-----------|---------|
| 1 | Energy widget no carga energyLevel guardado | Alta | `db-energy-widget.component.ts` |
| 2 | Sin feedback de error en guardado | Media | `onboarding.component.ts:383` |
| 3 | Emojis por CDN externo | Baja | `onboarding.component.ts:43` |
| 4 | onboardingGuard con null | Baja | `onboarding.guard.ts:10` |
