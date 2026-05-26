# Code Review: Módulo Dashboard — Frontend

## Hallazgos

### 1. 🔴 Energy Widget — valor hardcodeado
**Archivo:** `db-energy-widget.component.ts:14`
```typescript
readonly energyLevel = signal(80);
```
- No carga `user.energyLevel` desde `AuthService.user()`
- El usuario ajusta su energía en onboarding (se guarda en backend), pero el dashboard ignora el valor guardado
- Los cambios en el slider no se persisten
- **Severidad:** Alta
- **Sugerencia:** Inicializar con `AuthService.user()?.energyLevel ?? 50` y persistir cambios con `PATCH /users/preferences`

### 2. 🔴 AI Suggestion — completamente estático
**Archivo:** `db-ai-suggestion.component.ts:10` + `db-ai-suggestion.component.html`
```html
<p>Tu <span>energía está alta</span> Es un excelente momento...</p>
```
- Texto hardcodeado, no consulta `GET /suggestions`
- El botón "Aplicar planificación" no hace nada
- No recibe el perfil del usuario ni su nivel de energía actual
- **Severidad:** Alta
- **Sugerencia:** Inyectar `ApiService`, llamar `GET /suggestions?count=1` y mostrar sugerencia real; conectar botón para crear tarea

### 3. 🟡 Stats — hardcodeado 82%
**Archivo:** `db-stats.component.ts:23`
```typescript
readonly progressPct = 82;
```
- Las estadísticas de tareas completadas (82%) son un valor fijo
- Focus (25%) también hardcodeado
- No consulta `GET /analytics/progress`
- **Severidad:** Media
- **Sugerencia:** Inyectar `ApiService`, llamar `GET /analytics/progress` y mostrar datos reales

### 4. 🟡 Focus Streak — días hardcodeados
**Archivo:** `db-focus-streak.component.ts:12-20`
```typescript
readonly days = [
  { label: 'Lun', done: true },
  { label: 'Mar', done: true },
  ...
  { label: 'Dom', done: false },
];
```
- Todos los días están marcados como completos excepto domingo
- No se calcula basado en tareas reales completadas en la semana actual
- **Severidad:** Media
- **Sugerencia:** Calcular streak basado en tareas completadas en los últimos 7 días

### 5. 🟡 Sidebar XP — hardcodeado
**Archivo:** `db-sidebar.component.ts:25-27`
```typescript
readonly xp = 120;
readonly xpMax = 200;
readonly level = 4;
```
- XP, nivel y barra de progreso son valores fijos
- No hay endpoint de backend para XP — no existe concepto de gamificación en backend
- **Severidad:** Media
- **Sugerencia:** Definir modelo de gamificación en backend (XP por tarea completada) o eliminar del sidebar

### 6. 🟡 Hero — stat pills decorativas
**Archivo:** `db-hero.component.html`
- Las tarjetas "5 tareas completadas hoy" y "Racha de 7 días activa" son HTML estático
- No reflejan datos reales del usuario
- **Severidad:** Media
- **Sugerencia:** Calcular tareas completadas hoy desde `AuthService.tasks` o endpoint dedicado

### 7. 🟡 Tasks Today carga todos las tareas del usuario
**Archivo:** `dashboard.component.ts:57`
```typescript
this.api.get<Task[]>('/tasks').subscribe(...)
```
- `GET /tasks` retorna TODAS las tareas del usuario
- `db-tasks-today` solo muestra 3 (`visibleTasks`)
- Para un usuario con muchas tareas, es ineficiente
- **Severidad:** Media
- **Sugerencia:** Crear endpoint `GET /tasks/today` en backend que filtre por fecha

## Resumen
| # | Severidad | Hallazgo | Componente |
|---|-----------|----------|-----------|
| 1 | 🔴 Alta | Energy widget hardcodeado | `db-energy-widget` |
| 2 | 🔴 Alta | AI suggestion estático | `db-ai-suggestion` |
| 3 | 🟡 Media | Stats hardcodeados | `db-stats` |
| 4 | 🟡 Media | Focus streak hardcodeado | `db-focus-streak` |
| 5 | 🟡 Media | Sidebar XP hardcodeado | `db-sidebar` |
| 6 | 🟡 Media | Hero stat pills decorativas | `db-hero` |
| 7 | 🟡 Media | Tasks Today carga todo | `dashboard.component` |
