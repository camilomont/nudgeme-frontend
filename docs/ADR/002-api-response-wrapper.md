# ADR-002: API Response Wrapper

**Fecha:** 2026-05-20

## Contexto
Necesitamos un contrato consistente entre frontend y backend para las respuestas HTTP.

## Decisión
Todas las respuestas del backend siguen la estructura:
```typescript
{
  data: T;
  statusCode: number;
  timestamp: string;
}
```

## Razones
- Consistencia: el frontend sabe siempre dónde encontrar los datos (`response.data`)
- El `ApiService` extrae automáticamente `.data` de la respuesta
- Permite metadata adicional (statusCode, timestamp) sin contaminar el modelo de datos

## Consecuencias
- `ApiService.get<T>()` retorna `Observable<T>` (ya extrajo el wrapper)
- El backend debe mantener este contrato en todos los endpoints
- Para errores, el backend debe devolver el mismo formato con `data: null`
