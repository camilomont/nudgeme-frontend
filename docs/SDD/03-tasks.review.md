# Code Review: Módulo Tasks — Frontend

## Hallazgos

### 1. filteredTasks es función, no computed signal
**Archivo:** `task-manager.component.ts:46-49`
```typescript
readonly filteredTasks = () => {
  const f = this.activeFilter();
  return f === 'all' ? this.tasks() : this.tasks().filter((t) => t.type === f);
};
```
- Es una arrow function, no un `computed` signal
- En el template se llama como `filteredTasks()` en cada ciclo de detección de cambios
- Funciona pero no sigue el patrón Signals del resto del proyecto
- **Severidad:** Muy Baja
- **Sugerencia:** Cambiar a `readonly filteredTasks = computed(() => ...)`

### 2. No hay edición de tareas
**Archivo:** `task-manager.component.ts:74-88`
- Solo se puede crear, completar (toggle) y eliminar
- `PATCH /tasks/:id` soporta cambiar title, description, priority, pero la UI no lo expone
- **Severidad:** Media (falta de funcionalidad)
- **Sugerencia:** Agregar edición inline o modal

### 3. form es objeto plano, no signal
**Archivo:** `task-manager.component.ts:35-37`
```typescript
form: { title: string; description: string; type: TaskType; priority: TaskPriority } = {
  title: '', description: '', type: 'daily', priority: 'medium',
};
```
- Se reasigna completo en `createTask()` (línea 66)
- No hay reactividad, pero `ngModel` maneja el binding bidireccional
- **Severidad:** Muy Baja
- **Sugerencia:** Usar signal para consistencia con el resto del proyecto

## Resumen
| # | Hallazgo | Severidad | Archivo |
|---|----------|-----------|---------|
| 1 | filteredTasks no es computed | Muy Baja | `task-manager.component.ts:46` |
| 2 | Sin edición de tareas | Media | `task-manager.component.ts` |
| 3 | form es objeto plano | Muy Baja | `task-manager.component.ts:35` |
