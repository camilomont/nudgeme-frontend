# NudgeMe Frontend — AI Context

## Stack
- Angular 19 standalone, Signals, RxJS 7
- TailwindCSS 3.4, AnimeJS 3.2, Lucide Angular 1.0
- Jasmine 5.4 + Karma 6.4 (tests)

## Commands
- `npm start` → dev server localhost:4200
- `npm test` → tests (Karma, ChromeHeadless via Edge on Windows)
- `npm run build` → prod build to dist/nudgeme-frontend

## Conventions
- Standalone components only, no NgModules
- `inject()` over constructor DI
- Signals for component state (not RxJS Subjects)
- `core/` = services (`@core/services/`), guards, interceptors
- `features/` = lazy feature modules (auth, onboarding, dashboard, task-manager)
- `shared/` = reusable components (`@shared/components/`), services (`@shared/services/`)

## Testing (Jasmine + Karma)
- `*.spec.ts` alongside the file
- `TestBed.configureTestingModule({ imports: [Component], providers: [...] })`
- Use `provideHttpClient(withInterceptors([...]))` + `provideHttpClientTesting()` for HTTP tests
- Mock services with plain objects + `jasmine.createSpy`
- Use `fakeAsync` + `tick` for setTimeout timers
- `fixture.detectChanges()` after changing signals to re-render template

## Auth
- Google OAuth via backend redirect (`auth.service.ts`)
- JWT in HTTP-only cookie (handled by backend)
- `auth.service.ts`: loadProfile() with share() caching, loginWithGoogle(), logout()
- `auth.guard.ts`: functional CanActivateFn, calls loadProfile() if not authenticated
- `error.interceptor.ts`: 401 → clear user + redirect to /login
- Toast system: ToastService (signal queue) + ToastContainerComponent

## Key Components
- LoginComponent: Google button with spinner/isLoggingIn signal
- ToastContainerComponent: renders toasts from ToastService signal
- Shared components auto-build from Lucide icons (not regenerated manually)

## Deployment
- Vercel (SPA)
- `vercel.json` rewrites `/api/v1/*` to backend URL
- Production env sets `apiUrl: '/api/v1'` (proxy via Vercel rewrites)
