# Git Workflow — NudgeMe

## Ramas

| Rama | Propósito |
|------|-----------|
| `main` | Producción — solo merge via PR |
| `feature/*` | Desarrollo de funcionalidades nuevas |
| `fix/*` | Corrección de bugs |
| `docs/*` | Documentación |

**NUNCA subir directo a `main`.** Todo cambio va en una rama.

## Flujo

```bash
# 1. Crear rama desde main
git checkout -b feature/lo-que-vayas-a-hacer

# 2. Hacer cambios y commit
git add .
git commit -m "feat: agrego X funcionalidad"

# 3. Subir rama
git push origin feature/lo-que-vayas-a-hacer
```

## Formato de Commits

```
<tipo>: <descripción corta>
```

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `docs` | Documentación (SDDs, READMEs, ADRs) |
| `refactor` | Cambios en código sin cambiar funcionalidad |
| `chore` | Configuración, dependencias, CI/CD |

Ejemplos:
```
feat: conectar energy widget al backend
fix: redirigir al login cuando token expira
docs: agregar SDD del módulo auth
```

## Repositorios

| Proyecto | Repo |
|----------|------|
| Backend | `nudgeme-backend/` → `origin` (camilomont/nudgeme-backend) |
| Frontend | `nudgeme-frontend/` → `origin` (camilomont/nudgeme-frontend) |

Siempre trabajar dentro de la carpeta del repo correspondiente.
