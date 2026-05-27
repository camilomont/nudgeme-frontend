<p align="center">
  <img src="src/assets/images/logotipoNudgeme.png" alt="NudgeMe Logo" width="120" />
</p>

# NudgeMe Frontend

![Angular](https://img.shields.io/badge/Angular-19-DD0031)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4)

Aplicacion web **NudgeMe** — un asistente de productividad personal con inteligencia artificial. Construido con Angular 19, TailwindCSS y Signals.

## Stack

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| Angular | ^19.0 | SPA framework |
| TypeScript | ~5.6 | Lenguaje |
| TailwindCSS | ^3.4 | Estilos utility-first |
| AnimeJS | ^3.2 | Animaciones |
| Lucide Angular | ^1.0 | Iconos |
| RxJS | ~7.8 | Programacion reactiva |
| Karma + Jasmine | 6.4 / 5.4 | Testing |

## Requisitos

- Node.js >= 18
- npm >= 9
- Backend NudgeMe corriendo (puerto 3000)

## Empezar

```bash
# 1. Clonar
git clone https://github.com/camilomont/nudgeme-frontend.git
cd nudgeme-frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar en desarrollo
npm start
```

La app corre en `http://localhost:4200` y se conecta al backend en `http://localhost:3000/api/v1`.

## Scripts

```bash
npm start        # Desarrollo con hot-reload (http://localhost:4200)
npm run build    # Compilar para produccion
npm run watch    # Desarrollo con watch
npm test         # Tests unitarios (Jasmine + Karma)
npm run lint     # ESLint
```

## Rutas

| Ruta | Componente | Guards |
|------|-----------|--------|
| `/login` | LoginComponent | -- |
| `/onboarding` | OnboardingComponent | authGuard |
| `/dashboard` | DashboardComponent | authGuard, onboardingGuard |
| `/tasks` | TaskManagerComponent | authGuard, onboardingGuard |

## Arquitectura

```
src/
  app/
    core/           -> Servicios, guards, interceptors
    features/       -> Modulos lazy-loaded
      auth/         -> Login con Google OAuth
      onboarding/   -> Wizard 4 pasos
      dashboard/    -> Panel principal con widgets
      task-manager/ -> CRUD de tareas
    shared/         -> Componentes reutilizables, directivas, modelos
  assets/           -> Imagenes, videos
  environments/     -> Configuracion por entorno
```

## Documentacion

La documentacion tecnica se encuentra en `docs/SDD/`:
- `01-auth.md` — Login, guards, interceptors
- `02-onboarding.md` — Wizard de 4 pasos
- `03-tasks.md` — Gestor de tareas
- `04-dashboard.md` — Panel principal (8 widgets)
- `*.review.md` — Code reviews con hallazgos por modulo

Las decisiones arquitectonicas se documentan en `docs/ADR/`.

## Workflow

Para contribuir, revisa `docs/GIT-WORKFLOW.md`.
