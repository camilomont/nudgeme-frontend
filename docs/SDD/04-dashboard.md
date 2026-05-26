# SDD: Módulo Dashboard — Frontend

## 1. Descripción
Página principal después del login/onboarding. Muestra un panel de control con widgets que resumen el estado del usuario: tareas del día, nivel de energía, sugerencias IA, estadísticas y racha de enfoque.

## 2. Ruta
`/dashboard` — protegida por `authGuard` + `onboardingGuard`

## 3. Arquitectura

```
DashboardComponent (shell)
├── FloatingParticlesComponent   (fondo animado)
├── DbSidebarComponent           (navegación desktop)
├── DbTopbarComponent            (fecha + notificaciones)
├── DbHeroComponent              (saludo + stat pills)
├── DbTasksTodayComponent        (tareas del día)
├── DbEnergyWidgetComponent      (slider de energía)
├── DbAiSuggestionComponent      (sugerencia IA)
├── DbStatsComponent             (anillos de progreso)
└── DbFocusStreakComponent       (racha semanal)
```

## 4. Componentes

### DashboardComponent (shell)
- **Estados:**
  - `tasks: Signal<Task[]>` — tareas cargadas desde API
  - `isLoadingTasks: Signal<boolean>`
  - `firstName`, `userName`, `userAvatar` — computed desde AuthService
- **Flujo:** `ngOnInit()` → `loadTasks()` → `GET /tasks`
- **Layout:** Sidebar (izquierda) + Main content (derecha) + Mobile nav (abajo)

### DbSidebarComponent
- **Props:** `userName`, `userAvatar`
- **Items de navegación:** Inicio, Mis tareas, Energía, Estadísticas, IA Suggestions, Configuración
- **Perfil:** Card con avatar, nombre, XP bar (hardcoded: 120/200, level 4)
- **Acción:** Logout → `AuthService.logout()`
- **Nota:** XP, level son valores hardcoded — no conectados a backend

### DbTopbarComponent
- **Props:** Ninguna
- **Contenido:** Fecha actual en formato español (ej: "Martes, 26 de mayo") + icono de campana
- **Nota:** La fecha se genera en el constructor, no se actualiza en tiempo real

### DbHeroComponent
- **Props:** `firstName`
- **Contenido:** Saludo personalizado ("¡Buenos días, {nombre}!") + stat pills decorativas
- **Nota:** Las stat pills (5 tareas, 7 días racha) son decorativas — no conectadas a datos reales

### DbTasksTodayComponent
- **Props:** `tasks: Task[]`, `isLoading: boolean`
- **Muestra:** Hasta 3 tareas como tarjetas con paletas de color rotativas
- **Cada tarjeta:** Título, tipo, badge de energía según prioridad
- **Link:** "Ver todas" → `/tasks`
- **Loading:** 3 placeholders animados (skeleton)

### DbEnergyWidgetComponent
- **Estado local:** `energyLevel = 80` (hardcoded)
- **Slider:** Input range 0-100 con bolt icon animado
- **Colores:** Rojo (<25), Naranja (<50), Amarillo (<75), Verde (>=75)
- **Emojis:** 😡 → 😢 → 😐 → 😊 → 😄 según nivel
- **Nota:** El valor es local, no se persiste en backend

### DbAiSuggestionComponent
- **Estado:** Completamente estático (HTML + CSS)
- **Contenido:** Texto hardcoded "Tu energía está alta, es buen momento para tareas creativas"
- **Botón:** "Aplicar planificación" (no funcional)
- **Nota:** No consume `GET /suggestions` — es placeholder visual

### DbStatsComponent
- **Estado local:** `progressPct = 82` (hardcoded)
- **Visual:** Anillo SVG animado con anime.js
- **Métricas:** Tareas completadas (80%) y Focus (25%) — hardcoded

### DbFocusStreakComponent
- **Estado local:** Array de 7 días hardcoded (Lun-Vie true, Dom false)
- **Visual:** Indicadores de círculos para cada día de la semana
- **Nota:** No conectado a datos reales de tareas completadas

## 5. Estado Actual de Conexión a API

| Widget | Datos actuales | ¿Conectado a backend? |
|--------|---------------|----------------------|
| Hero | firstName desde AuthService | Parcial (nombre sí, stats no) |
| Tasks Today | Tasks desde GET /tasks | ✅ Sí |
| Energy Widget | Hardcoded 80 | ❌ No (debería ser de user.energyLevel) |
| AI Suggestion | Static HTML | ❌ No (debería llamar GET /suggestions) |
| Stats | Hardcoded 82% | ❌ No (debería llamar GET /analytics/progress) |
| Focus Streak | Hardcoded days | ❌ No (debería ser de tareas completadas) |
| Sidebar XP | Hardcoded 120/200 | ❌ No |

## 6. Layout

### Desktop
```
┌─────────────────────────────────────────────────┐
│ [Sidebar 260px] │      [Main Content]            │
│                 │  ┌─────────────────────────┐   │
│  Logo           │  │  Topbar (fecha + bell)  │   │
│  Navegación     │  ├─────────────────────────┤   │
│  ────────────   │  │  Hero (saludo + stats)  │   │
│  Perfil         │  ├──────────────┬──────────┤   │
│  XP Bar         │  │ Tasks Today  │ Energy   │   │
│  Logout         │  │              │ AI Sugg  │   │
│                 │  │ Stats        │ Streak   │   │
│                 │  └──────────────┴──────────┘   │
└─────────────────────────────────────────────────┘
```

### Mobile
- Sidebar oculto
- Bottom navigation bar con 5 iconos
- Contenido en una sola columna

## 7. Dependencias
- `@core/services/auth.service.ts` — perfil del usuario
- `@core/services/api.service.ts` — GET /tasks
- `@shared/components/floating-particles` — fondo animado
- `lucide-angular` — iconos
- `animejs` — animaciones (stats ring)
- RouterLink para navegación
