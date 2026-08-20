# Decisión de stack tecnológico — Rediseño de Gilbert

> **Alcance:** esta decisión aplica al rediseño tecnológico completo del sistema. Los procesos de negocio (presupuestos → ingeniería → PCP → producción → materiales → calidad → embarques → obra) se mantienen sin cambios; la tecnología se reemplaza en su totalidad.

---

## 1. Resumen ejecutivo

**Stack definitivo: TypeScript de extremo a extremo — Next.js + tRPC + Prisma + PostgreSQL.**

No se conserva ninguna tecnología del proyecto original (PHP plano, mysqli/PDO mixto, jQuery, Bootstrap 5, MySQL). La decisión se basa exclusivamente en lo que exigen los procesos de la empresa, no en continuidad con el código existente.

---

## 2. Criterios de decisión

Derivados únicamente del proceso de negocio documentado, sin ninguna dependencia de la implementación anterior:

| Criterio | Por qué importa |
|---|---|
| Entidad central con ciclo de vida por etapas | La "pieza" atraviesa 8 áreas; cada una escribe campos propios. Necesita modelarse como estado explícito, no como columnas sueltas actualizadas por 8 módulos independientes. |
| Multi-proyecto real | Hoy solo existe un proyecto (OTA) funcional; el sistema debe soportar N proyectos de forma paramétrica desde el diseño. |
| Roles por área desde el día uno | Cada departamento debe ver y editar solo lo suyo. No puede ser una capa añadida después. |
| Auditoría / trazabilidad | Quién cambió qué y cuándo, en toda operación — no solo en un módulo aislado. |
| Tablas de datos densas | Filtros, búsqueda, exportación a Excel — uso diario del personal de cada área. |
| Escala moderada | Decenas/cientos de usuarios internos. No se requiere arquitectura de alta escala ni microservicios. |
| Equipo pequeño, mantenimiento a largo plazo | Prioriza simplicidad operativa y curva de aprendizaje sobre sofisticación innecesaria. |

---

## 3. Stack definitivo

| Capa | Tecnología | Rol |
|---|---|---|
| Lenguaje | **TypeScript** | Un solo lenguaje en frontend y backend, tipado de punta a punta. |
| Framework full-stack | **Next.js** | Frontend + backend en un solo proyecto desplegable, organizado por dominio (un módulo por área). |
| Capa de API | **tRPC** | Funciones de negocio con nombre y tipo explícito, en vez de un endpoint único multiplexado por número de opción. |
| ORM / schema | **Prisma** | Schema versionado en código, migraciones automáticas, cliente 100% tipado — SQL injection estructuralmente imposible. |
| Base de datos | **PostgreSQL** | Enums nativos, constraints a nivel de BD, JSONB para atributos variables (perfil, espesor, largo, ancho en piezas habilitadas). |
| UI | **React + shadcn/ui + Tailwind** | Componentes propios y reutilizables, reemplazo de Bootstrap 5 + HTML duplicado en 13 archivos. |
| Tablas de datos | **TanStack Table** | Reemplazo de DataTables: filtros, orden, exportación, con datos tipados. |
| Autenticación | **Auth.js / Better-Auth** | Login y roles por área desde el inicio del proyecto, no como módulo pendiente. |
| Tiempo real (opcional) | **Socket.IO / Ably** | Actualización en vivo entre áreas que comparten el tablero de una misma pieza. |
| Testing | **Vitest + Playwright** | Unitarios/integración y end-to-end. |
| CI/CD | **GitHub Actions** | Validación automática en cada cambio — hoy inexistente. |
| Contenedores / despliegue | **Docker** | Sobre un VPS propio o un proveedor gestionado (Vercel + Postgres gestionado), según preferencia de control de datos. |

---

## 4. Justificación por capa

### 4.1 TypeScript de punta a punta
Elimina de raíz la clase de bug que dominaba el proyecto original: variables no definidas (`$tipo` en `calidad/index.php`), inputs sin validar (`isset($_POST['x']) ? ... : ''`), columnas referenciadas que no existen. El compilador detiene estos errores antes de ejecutar el código, no en producción.

### 4.2 PostgreSQL sobre MySQL
No es una preferencia estética: PostgreSQL da enums nativos para los estados `SI`/`NO` y de pieza, `CHECK constraints` para reglas de negocio a nivel de base de datos, y JSONB para los atributos físicos variables del subsistema de piezas habilitadas — sin necesitar una tabla distinta por tipo de pieza.

### 4.3 Prisma
El schema queda versionado en git, resolviendo directamente la ausencia total de `.sql`, migraciones o seeds del proyecto actual. Las consultas son tipadas: no existe la posibilidad de interpolar una variable directamente en SQL, que era la causa raíz de la vulnerabilidad de inyección SQL documentada.

### 4.4 Next.js + tRPC
Reemplaza el patrón de un `crud.php` por módulo con `switch($opcion)` numérico. Cada operación de negocio es una función nombrada y tipada — `pieza.calidad.actualizarInspeccion`, `pieza.ingenieria.cancelar` — en vez de un número (`opcion: 3`) cuyo significado cambia según el módulo. Esto resuelve directamente la ambigüedad documentada de "opción 3" (a veces borra, a veces blanquea campos).

### 4.5 La pieza como máquina de estados, no como fila mutable
En vez de que 8 módulos hagan `UPDATE` sobre las mismas filas sin registro de quién hizo qué, se modela una tabla `Pieza` más una tabla `HistorialTransicion` que registra cada cambio de etapa, autor y fecha. Esto da la trazabilidad completa que hoy solo existe parcialmente (la tabla `historial` actual solo la escribe un módulo de un subsistema).

### 4.6 shadcn/ui + TanStack Table
Reemplazo directo de Bootstrap 5 + DataTables, pero como componentes reutilizables en vez de HTML y CSS casi idéntico repetido en 9+ módulos.

### 4.7 Auth.js/Better-Auth con roles desde el inicio
El sistema original nunca implementó autenticación real (`logout.php` existe, `login.php` no). Aquí la autenticación y los roles por área son parte del diseño inicial, no una tarea pendiente.

---

## 5. Cómo resuelve la deuda técnica documentada

| Problema en el sistema original | Resuelto por |
|---|---|
| Inyección SQL (interpolación de variables) | Prisma — consultas tipadas, sin SQL crudo |
| Sin autenticación ni sesiones reales | Auth.js/Better-Auth desde el día uno |
| `$tipo` indefinida / sin roles reales | Roles y permisos declarados en el modelo de auth |
| Dos bases de datos inconsistentes (`gilbert` / `gilbertm_prueba`) | Una sola base PostgreSQL normalizada |
| Sin schema versionado, sin `.sql` | Prisma schema + migraciones en git |
| "Opción 3" con significado ambiguo por módulo | Funciones tRPC nombradas por acción real |
| Duplicación de `Conexion` en 13 archivos | Una sola configuración de conexión en el proyecto |
| Sin validación de entrada | Validación declarativa (Zod) en cada procedimiento tRPC |
| Sin manejo de errores en frontend | Manejo de errores tipado end-to-end vía tRPC |
| Credenciales hardcodeadas en el código | Variables de entorno (`.env`), fuera del control de versiones |
| Archivos referenciados inexistentes (`nav.html`, `css/app.css`) | Arquitectura de componentes — no hay includes rotos posibles |

---

## 6. Alternativas consideradas y descartadas

| Alternativa | Por qué se descarta como decisión definitiva |
|---|---|
| **Laravel + Filament** (PHP moderno) | Habría sido la opción de menor fricción si se quisiera conservar el ecosistema PHP del equipo. Se descarta porque el requisito explícito es no mantener ninguna tecnología previa; no hay razón para anclarse a PHP si se parte de cero. |
| **Django + DRF** (Python) | Alternativa sólida — panel admin maduro, ORM propio, permisos integrados. Se descarta como definitiva frente a TypeScript por una razón concreta: este sistema es, en esencia, un conjunto de tableros y formularios altamente interactivos usados por 8+ áreas simultáneamente; el ecosistema de React/Next.js da una experiencia de interfaz más rica out-of-the-box (tablas interactivas, actualización en vivo) que las plantillas server-rendered de Django. Si en el futuro el negocio prioriza análisis de datos de producción sobre experiencia de interfaz, esta decisión debería revisarse. |
| **NestJS como backend separado** | Válido si el backend creciera a complejidad de múltiples servicios independientes. Se descarta por ahora: el sistema es un monolito modular de tamaño moderado: separar frontend y backend en dos despliegues añade complejidad operativa sin beneficio real a esta escala. |

---

## 7. Riesgos del stack elegido y mitigación

| Riesgo | Mitigación |
|---|---|
| Equipo sin experiencia previa en TypeScript/React | Curva de aprendizaje real pero acotada; el patrón de "un módulo por área" del proyecto original se traduce directamente a "una carpeta de dominio por área" en Next.js. |
| Ecosistema JavaScript cambia rápido | Elegir librerías con adopción y estabilidad probadas (Next.js, Prisma, tRPC son piezas maduras, no experimentales) y fijar versiones en el proyecto. |
| Dependencia de un solo desarrollador/equipo pequeño para mantenimiento | Cobertura de tests desde el inicio (Vitest/Playwright) y CI en cada cambio, para que el conocimiento no dependa solo de memoria individual. |

---

## 8. Estructura de proyecto propuesta (alto nivel)

```text
gilbert/
├── prisma/
│   └── schema.prisma          # Pieza, Proyecto, Usuario, Rol, HistorialTransicion...
├── src/
│   ├── app/                   # Next.js — rutas por área (una vista por módulo)
│   │   ├── presupuestos/
│   │   ├── ingenieria/
│   │   ├── pcp/
│   │   ├── produccion/
│   │   ├── materiales/
│   │   ├── calidad/
│   │   ├── embarques/
│   │   ├── obra-recepcion/
│   │   └── habilitados/
│   ├── server/
│   │   ├── trpc/
│   │   │   └── routers/       # Un router tRPC por área, funciones nombradas
│   │   └── auth/               # Roles y permisos por área
│   └── components/            # UI compartida (tablas, modales, formularios)
├── tests/
└── .env                        # Credenciales fuera del control de versiones
```

---

## 9. Próximos pasos recomendados

1. Diseñar el modelo de datos definitivo (`Pieza`, `Proyecto`, `Usuario`, `Rol`, `HistorialTransicion`) en `schema.prisma`, consolidando `tabla` y `habilitados` en un esquema único y normalizado.
2. Definir el catálogo de roles por área y las reglas de permisos.
3. Construir el módulo de `Presupuestos` como piloto (es el más simple y autocontenido hoy).
4. Migrar el resto de módulos en el mismo orden del flujo de negocio, validando con cada área antes de retirar el sistema anterior.