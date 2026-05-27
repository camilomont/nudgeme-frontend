# SDD: Módulo Onboarding — Frontend

## 1. Descripción
Asistente de configuración inicial de 4 pasos que captura los intereses y niveles de energía del usuario para personalizar las sugerencias de IA.

## 2. Ruta
`/onboarding` — protegida por `authGuard`. Si el usuario ya completó el onboarding, `onboardingGuard` redirige a `/dashboard`.

## 3. Componente

### OnboardingComponent
- **Arquitectura:** Standalone component con Signals
- **Layout:** Split panel (58% formulario / 42% ilustración)
- **4 pasos:** `welcome` → `interests` → `energy` → `done`

### Estados (Signals)

| Signal | Tipo | Propósito |
|--------|------|-----------|
| `step` | `'welcome' \| 'interests' \| 'energy' \| 'done'` | Paso actual del wizard |
| `currentIndex` | `computed` | Índice numérico (0-3) |
| `selectedInterests` | `Record<string, string[]>` | Intereses seleccionados por categoría |
| `activeCategory` | `string` | Categoría activa en el carrusel |
| `carouselStart` | `number` | Índice de inicio del carrusel (3 de 4 categorías visibles) |
| `energyPeaks` | `string[]` | Momentos del día con más energía |
| `energyLevel` | `number` | Nivel de energía actual (0-100) |
| `isSaving` | `boolean` | Estado de guardado |
| `firstName` | `computed` | Nombre del usuario desde AuthService |

### Pasos del Wizard

#### Paso 1: Welcome
- **Propósito:** Presentación y motivación
- **Contenido:** Saludo personalizado, lista de features, botón "Comenzar personalización"
- **Ilustración:** `saludando.png`
- **Acción:** Avanza a `interests`

#### Paso 2: Interests
- **Propósito:** Capturar intereses del usuario
- **Categorías:** Música, Deporte, Gaming, Hobbies (4 categorías, 6 opciones cada una)
- **Carrusel:** 3 de 4 categorías visibles a la vez con flechas de navegación
- **Selección:** Checkboxes de emojis para cada opción
- **Validación:** Mínimo 3 selecciones en total para continuar
- **Ilustración:** `pensando.png` con burbuja de pensamiento
- **Animación:** Crossfade entre personajes al cambiar de paso

#### Paso 3: Energy
- **Propósito:** Detectar picos de energía
- **Momentos:** Mañana (6-12), Tarde (12-18), Noche (18-22), Madrugada (22-2)
- **Slider:** Nivel de energía actual (0-100) con feedback de emoji y color
- **Validación:** Al menos 1 pico de energía seleccionado
- **Ilustración:** `energia.png`
- **Acción:** Guarda vía API y avanza a `done`

#### Paso 4: Done
- **Propósito:** Confirmación y redirección
- **Contenido:** Animación de check, mensaje de éxito, barra de carga
- **Acción:** Barra de carga animada de 3s, luego redirección a `/dashboard`

## 4. Flujo de Datos

```
OnboardingComponent
  │
  ├─► AuthService.user — para obtener firstName y avatar
  │
  └─► ApiService.patch('/users/preferences', {
        preferences: { music: [], sports: [], ... },
        energyPeaks: ['morning', 'afternoon'],
        energyLevel: 80,
        onboardingCompleted: true
      })
        │
        └─► En éxito: AuthService.loadProfile() → recarga perfil actualizado
              │
              └─► animateAndNavigate() → redirige a /dashboard
```

## 5. Categorías e Intereses

| Categoría | Icono | Opciones |
|-----------|-------|----------|
| Música | Music | Pop, Rock, Jazz, Electrónica, Reggaeton, Clásica |
| Deporte | Dumbbell | Fútbol, Running, Gym, Natación, Yoga, Ciclismo |
| Gaming | Gamepad2 | RPG, Estrategia, FPS, Aventura, Deportes, Puzzle |
| Hobbies | Palette | Lectura, Cocina, Fotografía, Dibujo, Programar, Viajes |

## 6. Opciones de Energía

| Valor | Icono | Label | Rango | Color |
|-------|-------|-------|-------|-------|
| `morning` | Sun | Mañana | 6am–12pm | #FBBF24 |
| `afternoon` | Sunset | Tarde | 12pm–6pm | #FB923C |
| `evening` | MoonStar | Noche | 6pm–10pm | #818CF8 |
| `night` | Moon | Madrugada | 10pm–2am | #94A3B8 |

## 7. Animaciones
- **Entrada de personaje:** fadeIn + translateY + scale (easeOutBack)
- **Crossfade entre pasos:** opacidad cruzada entre `saludando`, `pensando`, `energia`
- **Transición de contenido:** slideOut → cambio → slideIn
- **Barra de carga final:** animate width 0→100% en 3s
- **Partículas flotantes:** en paso `done`

## 8. Dependencias
- `@core/services/auth.service.ts` — perfil del usuario
- `@core/services/api.service.ts` — llamada PATCH a /users/preferences
- `@angular/router` — navegación a /dashboard
- `animejs` — animaciones de transición
- `lucide-angular` — iconos de categorías y energía
