# SDD: Módulo Tasks — Frontend

## 1. Descripción
Gestor de tareas con CRUD completo. Permite crear, listar, filtrar, completar y eliminar tareas organizadas por tipo (diaria/semanal/mensual) y prioridad.

## 2. Ruta
`/tasks` — protegida por `authGuard` + `onboardingGuard`

## 3. Componente

### TaskManagerComponent
- **Arquitectura:** Standalone component con Signals
- **Layout:** Lista de tareas con filtros y formulario inline

### Estados (Signals)

| Signal | Tipo | Propósito |
|--------|------|-----------|
| `tasks` | `Task[]` | Lista completa de tareas |
| `isLoading` | `boolean` | Estado de carga inicial |
| `isSaving` | `boolean` | Estado de guardado de nueva tarea |
| `showForm` | `boolean` | Mostrar/ocultar formulario de creación |
| `activeFilter` | `string` | Filtro activo: `all`, `daily`, `weekly`, `monthly` |

### Formulario (local state)
```typescript
form = {
  title: string,
  description: string,
  type: 'daily' | 'weekly' | 'monthly',
  priority: 'low' | 'medium' | 'high'
}
```

## 4. Funcionalidad

### Crear tarea
1. Click en "+ Nueva tarea" → mostrar formulario
2. Llenar título (requerido), descripción, tipo, prioridad
3. Click "Guardar" → `POST /tasks` → agregar al inicio de la lista
4. Limpiar formulario y cerrar

### Listar tareas
- `GET /tasks` al inicializar
- Filtros por tipo: Todas / Diarias / Semanales / Mensuales
- `filteredTasks()` → función que filtra según `activeFilter`

### Completar tarea
- Click en checkbox → toggle status `pending` ↔ `completed`
- `PATCH /tasks/:id` con `{ status }`

### Eliminar tarea
- Click en ✕ → `DELETE /tasks/:id`

## 5. Filtros

| Label | Value | Descripción |
|-------|-------|-------------|
| Todas | `all` | Sin filtro |
| Diarias | `daily` | Solo tareas type = daily |
| Semanales | `weekly` | Solo tareas type = weekly |
| Mensuales | `monthly` | Solo tareas type = monthly |

## 6. Colores por Prioridad

| Prioridad | Clase Tailwind |
|-----------|----------------|
| `low` | `bg-mint-200/20 text-mint-200` |
| `medium` | `bg-sky-200/20 text-sky-200` |
| `high` | `bg-peach-200/20 text-peach-200` |

## 7. Animaciones
- **Entrada de elementos:** `AnimeEntranceDirective` con tipo `slideUp`
- **Stagger:** Cada tarea aparece con 50ms de delay progresivo

## 8. Endpoints Consumidos

| Método | Endpoint | Propósito |
|--------|----------|-----------|
| GET | `/tasks` | Listar todas las tareas del usuario |
| POST | `/tasks` | Crear nueva tarea |
| PATCH | `/tasks/:id` | Actualizar tarea (status, etc.) |
| DELETE | `/tasks/:id` | Eliminar tarea |

## 9. Dependencias
- `@core/services/api.service.ts` — llamadas HTTP
- `@shared/directives/anime-entrance.directive` — animaciones de entrada
- `@shared/models/task.model.ts` — interfaz Task
- `@angular/forms` — ngModel para formulario
