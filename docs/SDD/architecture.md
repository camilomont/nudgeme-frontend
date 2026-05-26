# SDD: NudgeMe Frontend — Diseño de Software

## 1. Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     AppComponent (shell)                     │
│                     <router-outlet />                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼
┌──────────┐      ┌──────────────┐      ┌──────────────┐
│  Login   │      │  Onboarding  │      │  Dashboard   │
│  /login  │      │ /onboarding  │      │ /dashboard   │
└──────────┘      └──────────────┘      └──────┬───────┘
                                               │
                                ┌──────────────┼──────────────┐
                                ▼              ▼              ▼
                         ┌──────────┐   ┌──────────┐   ┌──────────┐
                         │ Sidebar  │   │ Topbar   │   │  Hero    │
                         └──────────┘   └──────────┘   └──────────┘
                         ┌──────────┐   ┌──────────┐   ┌──────────┐
                         │  Tasks   │   │ Energy   │   │   AI     │
                         │  Today   │   │ Widget   │   │  Sugg.   │
                         └──────────┘   └──────────┘   └──────────┘
                         ┌──────────┐   ┌──────────┐
                         │  Stats   │   │  Streak  │
                         └──────────┘   └──────────┘
                              ┌──────────────────┐
                              │  Task Manager    │
                              │    /tasks        │
                              └──────────────────┘
```

## 2. Módulos y Responsabilidades

| Módulo | Carpeta | Responsabilidad |
|--------|---------|-----------------|
| **Core** | `core/` | Auth, API client, guards, interceptors |
| **Auth** | `features/auth/` | Login con Google OAuth |
| **Onboarding** | `features/onboarding/` | Wizard de 4 pasos (intereses, energía) |
| **Dashboard** | `features/dashboard/` | Página principal con widgets |
| **Task Manager** | `features/task-manager/` | CRUD de tareas |
| **Shared** | `shared/` | Componentes reutilizables, directivas |

## 3. Flujo de Datos

```
Usuario → Componente → ApiService → HTTP → Backend
                              ↓
                      AuthInterceptor
                    (withCredentials)
                              ↓
                      ErrorInterceptor
                    (log + toast error)
                              ↓
                    Signals actualizadas
                              ↓
                          Template
```

## 4. Modelo de Datos

### Task
```typescript
interface Task {
  _id: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly';
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category?: string;
  aiGenerated: boolean;
  dueDate?: string;
  estimatedMinutes?: number;
}
```

### UserProfile
```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  onboardingCompleted: boolean;
  preferences: { music: string[]; sports: string[]; hobbies: string[]; gaming: string[]; other: string[] };
  energyPeaks: string[];
}
```

## 5. Mapa de Rutas

| Ruta | Componente | Guards | Estado |
|------|-----------|--------|--------|
| `/` | → redirect `/dashboard` | - | ✅ |
| `/login` | `LoginComponent` | - | ✅ |
| `/onboarding` | `OnboardingComponent` | authGuard | ✅ |
| `/dashboard` | `DashboardComponent` | authGuard, onboardingGuard | ✅ |
| `/tasks` | `TaskManagerComponent` | authGuard, onboardingGuard | ✅ |
| `/energy` | — | — | ❌ Pendiente |
| `/stats` | — | — | ❌ Pendiente |
| `/settings` | — | — | ❌ Pendiente |
