# ADR-001: Angular Standalone Components + Signals

**Fecha:** 2026-05-20

## Contexto
Se eligió la arquitectura del frontend para NudgeMe. Las opciones consideradas fueron:
- Angular con NgModules (tradicional)
- Angular standalone components (moderno)
- Otros frameworks (React, Vue)

## Decisión
Usamos **Angular 19 standalone components** con **Signals** para estado reactivo.

## Razones
- Angular 19 recomienda standalone como default (los NgModules quedaron legacy)
- Signals permite estado reactivo simple sin dependencias externas (NgRx, etc.)
- Lazy loading directo en rutas con `loadComponent`
- Menos boilerplate que NgModules
- El equipo quiere aprender Angular moderno

## Consecuencias
- No hay NgModules en el proyecto
- El estado global se maneja con Signals + servicios `providedIn: 'root'`
- Para estado complejo futuro se evaluará Signals + efectos, no NgRx
