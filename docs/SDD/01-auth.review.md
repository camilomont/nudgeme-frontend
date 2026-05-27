# Code Review: Módulo Auth — Frontend

## Hallazgos

### 1. Posible doble llamada a `/auth/me`
**Archivos:** `app.component.ts:14-17` + `auth.guard.ts:12`
```typescript
// AppComponent
ngOnInit() {
  if (!this.auth.isAuthenticated()) {
    this.auth.loadProfile().subscribe();
  }
}

// auth.guard.ts
return auth.loadProfile().pipe(...)
```
En la primera carga, `AppComponent` llama `loadProfile()`. Si las rutas protegidas se resuelven en paralelo, `authGuard` también lo llama antes de que la primera llamada complete.
- **Severidad:** Media (causa 2 requests innecesarios en cada carga)
- **Sugerencia:** Eliminar la llamada en `AppComponent` y dejarlo solo en el guard, o cachear el Observable con `shareReplay(1)`

### 2. ErrorInterceptor no muestra UI al usuario
**Archivo:** `error.interceptor.ts:20`
```typescript
console.warn(`[Toast] ${message}`);
```
Los mensajes de error están en español y son amigables, pero solo se muestran en consola. El usuario nunca los ve.
- **Severidad:** Media
- **Sugerencia:** Implementar un sistema de toast/notificaciones (puede ser un simple servicio con signal)

### 3. Login sin feedback de carga
**Archivo:** `login.component.ts:205-215`
```typescript
login() {
  // animación del botón
  setTimeout(() => this.auth.loginWithGoogle(), 200);
}
```
Después de hacer clic, hay 200ms de delay y luego redirección total de página. No hay indicador de que algo está pasando.
- **Severidad:** Baja (mejora UX)
- **Sugerencia:** Deshabilitar el botón + mostrar spinner durante la redirección

### 4. authInterceptor clona request innecesariamente
**Archivo:** `auth.interceptor.ts:6`
```typescript
const withCredentials = req.clone({ withCredentials: true });
return next(withCredentials);
```
Cada request se clona. Se puede configurar globalmente en `app.config.ts` con `withCredentials: true` en el `provideHttpClient`.
- **Severidad:** Muy Baja (optimización menor)

## Resumen
| # | Hallazgo | Severidad | Archivo |
|---|----------|-----------|---------|
| 1 | Doble loadProfile() | Media | `app.component.ts`, `auth.guard.ts` |
| 2 | Error sin UI | Media | `error.interceptor.ts` |
| 3 | Sin feedback carga login | Baja | `login.component.ts` |
| 4 | Clone innecesario | Muy Baja | `auth.interceptor.ts` |
