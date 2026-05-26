# SDD: Módulo de Autenticación — Frontend

## 1. Descripción
Módulo encargado del flujo de autenticación mediante Google OAuth2. Maneja el inicio de sesión, la verificación del estado de autenticación, la protección de rutas y la gestión del perfil del usuario en el estado global.

## 2. Componentes

### LoginComponent
- **Ruta:** `/login`
- **Propósito:** Pantalla de inicio de sesión con dos paneles:
  - **Izquierdo (58%):** Video de fondo animado + hero copy + stat cards decorativas
  - **Derecho:** Formulario neumórfico con botón "Continuar con Google"
- **Animaciones:** anime.js timeline con entrada escalonada de elementos
- **Flujo:** Usuario hace clic → `AuthService.loginWithGoogle()` → redirección a backend `/auth/google`

### AuthService (`core/services/auth.service.ts`)
- **Propósito:** Maneja el estado de autenticación vía Signals
- **Estado:**
  - `user: Signal<UserProfile | null>` — perfil del usuario autenticado
  - `isAuthenticated: Signal<boolean>` — computed basado en `user`
  - `isLoading: Signal<boolean>` — indica si se está cargando el perfil
- **Métodos:**
  - `loadProfile()` — llama `GET /auth/me`, actualiza `user` signal, retorna Observable
  - `loginWithGoogle()` — redirige a `GET /auth/google`
  - `logout()` — llama `GET /auth/logout`, limpia signal, redirige a `/login`

## 3. Guards

### authGuard (`core/guards/auth.guard.ts`)
- **Propósito:** Protege rutas que requieren autenticación
- **Flujo:**
  1. Si `isAuthenticated()` → `true`
  2. Si no, intenta `loadProfile()`
  3. Si éxito → `true`, si error → redirige a `/login`

### onboardingGuard (`core/guards/onboarding.guard.ts`)
- **Propósito:** Redirige al onboarding si el usuario no lo ha completado
- **Flujo:**
  1. Si `user.onboardingCompleted === false` → redirige a `/onboarding`
  2. Si `user === null` → `true` (deja pasar, hay otro guard que lo maneja)

## 4. Interceptores

### authInterceptor (`core/interceptors/auth.interceptor.ts`)
- Agrega `withCredentials: true` a todas las peticiones HTTP para enviar cookies

### errorInterceptor (`core/interceptors/error.interceptor.ts`)
- Intercepta errores HTTP y muestra mensajes amigables en consola:
  - `0` → "No se pudo conectar con el servidor"
  - `401` → "Sesión expirada. Inicia sesión nuevamente"
  - `404` → "Recurso no encontrado"
  - `500+` → "Error del servidor. Intenta más tarde"

## 5. Flujo de Autenticación Completo

```
Usuario                    Frontend                    Backend                Google
   │                          │                          │                      │
   │  Click "Google"          │                          │                      │
   ├─────────────────────────►│                          │                      │
   │                          │  GET /auth/google        │                      │
   │                          ├─────────────────────────►│                      │
   │                          │                          │  Redirect OAuth      │
   │                          │                          ├─────────────────────►│
   │                          │                          │                      │
   │                          │       Callback URL       │                      │
   │                          │◄─────────────────────────┤                      │
   │                          │                          │                      │
   │                          │   Set JWT cookie         │                      │
   │                          │   + redirect /dashboard  │                      │
   │                          │◄─────────────────────────┤                      │
   │                          │                          │                      │
   │  AppComponent init       │                          │                      │
   │  GET /auth/me            │                          │                      │
   │  (with cookie)           │                          │                      │
   │├────────────────────────►│                          │                      │
   │                          │                          │                      │
   │  UserProfile signal      │                          │                      │
   │◄─────────────────────────┤                          │                      │
```

## 6. Modelo de Datos

```typescript
interface UserProfile {
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
  energyPeaks: string[];      // 'morning' | 'afternoon' | 'evening' | 'night'
}
```

## 7. Rutas Protegidas

| Ruta | Guards | Redirección si falla |
|------|--------|---------------------|
| `/onboarding` | `authGuard` | `/login` |
| `/dashboard` | `authGuard`, `onboardingGuard` | `/login` o `/onboarding` |
| `/tasks` | `authGuard`, `onboardingGuard` | `/login` o `/onboarding` |

## 8. Dependencias
- `@angular/router` — lazy loading + guards
- `@angular/common/http` — HttpClient + interceptors
- `@env/environment` — apiUrl
- `rxjs` — manejo de Observables
