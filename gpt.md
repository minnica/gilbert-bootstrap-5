# Recomendación definitiva para Gilbert v2

## Decisión

Si hoy tuviera que construir Gilbert **desde cero**, sin conservar absolutamente ninguna decisión tecnológica del sistema anterior y tomando únicamente como referencia los procesos reales de la empresa, mi elección sería:

> **React + TypeScript + Vite para frontend, ASP.NET Core 10 + C# para backend, PostgreSQL 18 como base de datos y una arquitectura de monolito modular.**

No elegiría microservicios. No usaría Next.js. No usaría una base NoSQL como base principal. Tampoco intentaría reproducir la estructura técnica del sistema anterior.

La arquitectura general sería:

```text
┌───────────────────────────────────────────────┐
│                   Frontend                    │
│                                               │
│          React 19 + TypeScript + Vite         │
│                                               │
│ shadcn/ui · Tailwind · TanStack · RHF · Zod  │
└──────────────────────┬────────────────────────┘
                       │
                    REST API
                       │
┌──────────────────────▼────────────────────────┐
│                    Backend                    │
│                                               │
│            ASP.NET Core 10 + C#               │
│                                               │
│               Modular Monolith                │
│                                               │
│ Projects · Engineering · PCP · Production    │
│ Materials · Quality · Shipping · Site        │
│ Estimates · Users · Audit                    │
└──────────────────────┬────────────────────────┘
                       │
               Entity Framework Core
                       │
┌──────────────────────▼────────────────────────┐
│                 PostgreSQL 18                 │
└───────────────────────────────────────────────┘
```

React 19.2 es actualmente la versión documentada más reciente de React, Vite está en su generación 8 y .NET 10 es LTS con soporte hasta noviembre de 2028. PostgreSQL 18 es actualmente la versión estable; PostgreSQL 19 sigue en desarrollo/beta.

---

# 1. La razón principal: Gilbert no es un sitio web, es un sistema operativo de la empresa

Este punto determina casi todas mis decisiones.

Gilbert sirve para controlar el recorrido de las piezas de una estructura metálica a través de diferentes áreas:

```text
Presupuestos
      ↓
Ingeniería
      ↓
PCP
      ↓
Producción
      ↓
Materiales
      ↓
Calidad
      ↓
Embarques
      ↓
Recepción / Obra
      ↓
Estimaciones
```

Cada área agrega información y cambia el estado del trabajo. Además existen conceptos como proyecto/OTA, pieza, peso, contratistas, talleres, inspecciones, remisiones, montaje e historial.

Por eso considero que Gilbert debe diseñarse como un **sistema transaccional de producción**, no como una colección de pantallas CRUD.

La aplicación debe entender cosas como:

```text
La pieza pertenece a una OTA.

La OTA pertenece a un proyecto.

Ingeniería libera la pieza.

PCP la programa.

Producción la fabrica.

Calidad la inspecciona.

Embarques la envía.

Obra la recibe y monta.
```

Y el software debe proteger esas reglas.

---

# 2. Arquitectura: monolito modular

Esta sería probablemente mi decisión arquitectónica más importante.

## No microservicios

No construiría:

```text
engineering-service
pcp-service
production-service
quality-service
shipping-service
site-service
users-service
```

Aunque las áreas de la empresa estén separadas, **los datos están fuertemente relacionados**.

Calidad necesita conocer Producción.

Embarques necesita conocer Calidad.

Obra necesita conocer Embarques.

Los dashboards necesitan información prácticamente de todas las áreas.

Separar todo eso desde el inicio provocaría:

- múltiples despliegues;
- comunicación entre servicios;
- consistencia eventual;
- colas;
- contratos distribuidos;
- observabilidad distribuida;
- mayor complejidad operativa;
- problemas de transacciones entre servicios.

Sin que Gilbert obtenga una ventaja proporcional.

## Sí monolito modular

Tendría un solo backend:

```text
Gilbert.Api
```

pero internamente separado:

```text
Modules/

├── Projects
├── Engineering
├── Planning
├── Production
├── Materials
├── Quality
├── Shipping
├── Site
├── Estimates
├── EnabledParts
├── Contractors
├── Identity
└── Audit
```

Cada módulo tendría claramente delimitadas sus responsabilidades.

Por ejemplo:

```text
Quality/

├── Domain
├── Application
├── Infrastructure
└── Api
```

Así obtenemos separación lógica sin pagar todavía el costo de un sistema distribuido.

---

# 3. Backend: ASP.NET Core 10 + C#

Esta sería mi elección por encima de NestJS, Laravel, Django, Spring Boot o Go para **este proyecto concreto**.

## ¿Por qué .NET?

Porque el problema principal de Gilbert es:

> **reglas de negocio + datos relacionales + transacciones + permisos + auditoría.**

Y ese es un terreno en el que C# y ASP.NET Core funcionan especialmente bien.

.NET 10 además es una versión LTS y Microsoft mantiene su soporte hasta noviembre de 2028. ASP.NET Core y Entity Framework siguen el ciclo de vida de .NET.

### Tipado fuerte

Quiero que conceptos importantes del negocio sean conceptos reales del código.

Por ejemplo:

```csharp
public enum PieceStatus
{
    Pending,
    Engineering,
    Planned,
    InProduction,
    QualityInspection,
    ReadyForShipment,
    Shipped,
    Received,
    Mounted,
    Cancelled
}
```

En lugar de depender de:

```text
"SI"
"NO"
""
"PENDIENTE"
"TERMINADO"
```

distribuidos por toda la aplicación.

El sistema antiguo depende mucho de cadenas y columnas que diferentes áreas actualizan directamente.

En Gilbert v2 intentaría que los estados inválidos fueran difíciles de representar.

---

# 4. Quiero reglas de negocio en el backend

Supongamos que Calidad intenta aprobar una pieza.

El sistema no debería hacer solamente:

```sql
UPDATE piece
SET quality = 'SI'
```

Debería poder verificar cosas como:

```csharp
if (!piece.Production.IsCompleted)
{
    throw new BusinessRuleException(
        "No puede aprobarse calidad antes de terminar producción."
    );
}
```

O para embarcar:

```csharp
if (!piece.Quality.IsApproved)
{
    throw new BusinessRuleException(
        "La pieza no está liberada por Calidad."
    );
}
```

Eso convierte el backend en **el guardián de los procesos de la empresa**.

La interfaz deja de ser responsable de que las reglas se respeten.

---

# 5. Frontend: React + TypeScript + Vite

Aquí no usaría Next.js.

No veo suficientes beneficios para este sistema.

Gilbert será principalmente una aplicación autenticada con:

- DataTables modernas;
- formularios;
- búsquedas;
- filtros;
- dashboards;
- gráficas;
- estados;
- permisos;
- modales/drawers;
- operaciones en tiempo real o casi real;
- captura desde tablet.

No necesita:

- SEO;
- páginas indexadas;
- rendering para buscadores;
- generación estática;
- arquitectura orientada a contenido.

Por eso prefiero:

```text
React SPA
   ↓
REST API
```

Mucho más explícito.

---

# 6. TypeScript obligatorio

Usaría:

```text
TypeScript strict
```

sin `any` salvo casos excepcionales documentados.

Por ejemplo:

```ts
type PieceStatus =
  | "pending"
  | "inProduction"
  | "qualityInspection"
  | "readyForShipment"
  | "shipped"
  | "received"
  | "mounted";
```

El frontend debe conocer exactamente qué recibe de la API.

Esto es especialmente importante en Gilbert porque el dominio tiene muchos:

- estados;
- fechas;
- cantidades;
- pesos;
- identificadores;
- permisos.

---

# 7. React Query para estado del servidor

Usaría **TanStack Query**.

No Redux como primera elección.

La mayoría del estado de Gilbert vendrá del servidor:

```text
OTAs
piezas
estatus
inspecciones
remisiones
progreso
usuarios
contratistas
```

Es decir:

```text
GET /api/projects
GET /api/otas
GET /api/otas/{id}/pieces
GET /api/pieces/{id}
```

TanStack Query encaja muy bien porque administra:

- caché;
- invalidaciones;
- loading;
- errores;
- refetch;
- mutations;
- optimistic updates cuando tenga sentido.

---

# 8. TanStack Table para las tablas

Este sería uno de los componentes centrales de Gilbert.

Muchas pantallas probablemente se verán como:

| Marca | Cantidad | Peso | Ingeniería | Producción | Calidad | Embarque |
|---|---:|---:|---|---|---|---|
| A-101 | 2 | 540 kg | ✓ | ✓ | ✓ | Pendiente |
| A-102 | 1 | 320 kg | ✓ | En proceso | — | — |
| A-103 | 4 | 1,240 kg | ✓ | ✓ | Inspección | — |

Necesitaremos:

- filtros;
- búsqueda;
- ordenamiento;
- paginación;
- columnas configurables;
- selección múltiple;
- acciones masivas;
- exportación;
- filtros por estado;
- filtros por proyecto;
- filtros por contratista;
- filtros por fechas.

TanStack Table me parece una base mejor para construir esto que una solución completamente cerrada.

---

# 9. UI: shadcn/ui + Tailwind CSS

Para la interfaz elegiría:

```text
Tailwind CSS
+
shadcn/ui
```

Principalmente porque Gilbert necesita un sistema visual propio.

Querría crear componentes del dominio como:

```text
<ProjectSelector />
<OtaSelector />

<PieceTable />
<PieceDrawer />

<ProductionStatus />
<QualityStatus />
<ShipmentStatus />

<ProgressBadge />
<WeightProgress />

<AuditTimeline />

<ReleaseButton />
<RejectDialog />
```

y mantenerlos bajo nuestro control.

No quiero que toda la aplicación dependa visualmente de una librería empresarial pesada.

---

# 10. Formularios: React Hook Form + Zod

Usaría:

```text
React Hook Form
+
Zod
```

para validación frontend.

Por ejemplo:

```ts
const inspectionSchema = z.object({
  result: z.enum(["approved", "rejected"]),
  comments: z.string().max(2000).optional(),
  inspectedAt: z.coerce.date(),
});
```

Pero hay una regla importante:

> **Zod mejora la experiencia del usuario; el backend sigue siendo la autoridad.**

Nunca confiaría únicamente en la validación frontend.

---

# 11. PostgreSQL 18

Esta sería una decisión muy clara.

Gilbert es un problema profundamente relacional.

Existe naturalmente:

```text
Customer
   ↓
Project
   ↓
OTA
   ↓
Piece
```

y alrededor de la pieza:

```text
Piece
 ├── Engineering
 ├── Planning
 ├── Production
 ├── Materials
 ├── Quality
 ├── Shipments
 ├── Site
 └── Estimates
```

Más:

```text
Users
Roles
Contractors
Workshops
Remissions
Inspections
AuditLogs
```

PostgreSQL es una excelente opción para:

- integridad referencial;
- foreign keys;
- constraints;
- transacciones;
- índices;
- consultas complejas;
- agregaciones;
- reporting;
- window functions;
- vistas;
- JSONB cuando realmente sea útil.

---

# 12. Entity Framework Core 10

Usaría EF Core como ORM.

No intentaría crear una capa genérica de repositories sobre Entity Framework por costumbre.

Utilizaría:

```text
DbContext
+
EF Core
+
LINQ
+
migrations
```

Esto nos da algo fundamental que el sistema anterior no tenía:

```text
Database migrations
```

Por ejemplo:

```text
20260820_CreateProjects
20260822_CreateOtas
20260823_CreatePieces
20260825_CreateQualityInspections
20260828_CreateShipments
```

El esquema deja de existir únicamente dentro del servidor de base de datos.

Pasa a formar parte del código.

---

# 13. Rediseñaría completamente el modelo de datos

No conservaría la tabla central `tabla`.

El proyecto anterior utiliza una misma tabla donde cada área modifica diferentes columnas.

Conceptualmente:

```text
tabla

marca
peso
revision

liberado
fecha_liberado

contratista
fecha_produccion

armado
soldadura
pintura
laboratorio

enviado
remision

recibido
montaje

ept
eps
epm

...
```

Es comprensible para un prototipo, pero no es como diseñaría el dominio desde cero.

---

# 14. Modelo aproximado que sí utilizaría

## Project

```text
Project
├── Id
├── Name
├── CustomerId
├── Address
├── BudgetedWeight
└── Status
```

## OTA

```text
Ota
├── Id
├── ProjectId
├── Code
├── Name
├── Status
├── StartDate
└── TargetDate
```

## Piece

```text
Piece
├── Id
├── OtaId
├── Mark
├── Name
├── Revision
├── Quantity
├── UnitWeight
├── TotalWeight
├── WorkshopId
└── Status
```

Y después las entidades operativas.

```text
EngineeringRelease
ProductionOrder
MaterialRelease
QualityInspection
Shipment
ShipmentItem
SiteReception
Estimate
```

---

# 15. Particularmente importante: eventos históricos

No quiero que Gilbert se limite a decir:

```text
Calidad = TERMINADO
```

Quiero poder conocer la historia.

Por ejemplo:

```text
PIEZA A-103
OTA 3299-E2

──────────────────────────────────

12 ago 09:30
Ingeniería liberó la pieza
Ana García

14 ago 11:40
Producción iniciada
Contratista: ACME

16 ago 16:20
Producción terminada
Juan López

17 ago 09:10
Inspección de soldadura rechazada
Motivo: porosidad

18 ago 10:40
Reparación registrada

18 ago 14:32
Soldadura aprobada
Carlos Martínez

19 ago 08:12
Pieza liberada para embarque
```

El sistema anterior ya tiene una aproximación a este concepto en `habilitados`, donde Calidad registra cambios en una tabla `historial`.

En Gilbert v2 lo convertiría en una capacidad transversal.

---

# 16. Auditoría obligatoria

Crearía una infraestructura central:

```text
AuditLog
```

Con aproximadamente:

```text
Id
UserId
Timestamp

EntityType
EntityId

Action

PreviousValues
NewValues

IpAddress
Device
```

Entonces sería posible responder:

> ¿Quién cambió esta pieza?

> ¿Qué modificó?

> ¿Cuándo?

> ¿Cuál era el valor anterior?

Esto me parece crítico en un sistema industrial.

---

# 17. Autenticación y autorización

No usaría simplemente:

```text
role = "CALIDAD"
```

Usaría permisos.

Por ejemplo:

```text
projects.read

engineering.read
engineering.update
engineering.release

planning.read
planning.update
planning.release

production.read
production.update
production.complete

quality.read
quality.inspect
quality.approve
quality.reject

shipping.read
shipping.create

site.receive
site.mount
```

Después:

```text
Role
  ↓
Permissions
```

Por ejemplo:

```text
QUALITY_INSPECTOR
├── projects.read
├── engineering.read
├── production.read
├── quality.read
├── quality.inspect
├── quality.approve
└── quality.reject
```

Esto permite modelar cómo funciona realmente la empresa.

---

# 18. Integración con identidad corporativa

Si los empleados utilizan Microsoft 365, mi primera opción sería integrar autenticación con:

```text
Microsoft Entra ID
```

mediante OIDC/OAuth.

Así los empleados utilizarían su cuenta empresarial.

Si no existe un proveedor corporativo de identidad, implementaría autenticación propia en ASP.NET Core.

Pero abstraería ambas cosas detrás de:

```text
Identity
```

---

# 19. Tablet-first para operación

Aunque el dashboard administrativo sea desktop-first, determinadas áreas deberían diseñarse pensando desde el principio en tablets:

- Producción;
- Materiales;
- Calidad;
- Embarques;
- Obra.

Imagino una pantalla como:

```text
┌──────────────────────────────┐
│ A-103                        │
│ 3299-E2                      │
│                              │
│ Peso              412 kg     │
│ Taller             Norte     │
│                              │
│ Producción         ✓         │
│ Calidad            ●         │
│ Embarque           —         │
│                              │
│ [ Registrar inspección ]     │
└──────────────────────────────┘
```

En lugar de obligar al inspector a trabajar exclusivamente con una tabla de 25 columnas.

---

# 20. Incorporaría QR como concepto del dominio

Cada pieza podría tener un identificador QR.

```text
QR
 ↓
/pieces/019...
```

Al escanear:

```text
A-103
3299-E2

✓ Ingeniería
✓ PCP
✓ Producción
● Calidad
○ Embarque
○ Obra
```

El usuario ve y ejecuta las acciones permitidas por su rol.

No necesariamente implementaría QR en la primera entrega, pero **diseñaría el modelo para permitirlo desde el principio**.

---

# 21. No construiría un workflow engine genérico

Hay una tentación al ver este tipo de sistema:

crear:

```text
Workflow
WorkflowDefinition
WorkflowInstance
WorkflowStep
WorkflowTransition
WorkflowRule
WorkflowState
```

para hacer todo configurable.

No lo haría inicialmente.

Prefiero conceptos explícitos:

```text
EngineeringRelease
ProductionOrder
QualityInspection
Shipment
SiteReception
```

porque representan exactamente el negocio.

Después podemos abstraer lo que realmente se repita.

---

# 22. Pero tampoco codificaría el proceso de forma rígida

Hay una diferencia entre:

```text
modelo explícito
```

y:

```text
hardcodear cada proyecto
```

La OTA nunca debería formar parte del código.

No existiría:

```text
moduloE2
moduloE3
moduloE4
```

como ocurre conceptualmente en la estructura anterior.

Existiría:

```text
Project
   │
   ├── 3299-E2
   ├── 3299-E3
   ├── 3299-E4
   ├── 3400-A
   └── 3550-B
```

Todos procesados por exactamente la misma aplicación.

---

# 23. API REST

Elegiría REST.

No GraphQL inicialmente.

Ejemplos:

```http
GET /api/projects

GET /api/projects/{projectId}

GET /api/otas/{otaId}

GET /api/otas/{otaId}/pieces

GET /api/pieces/{pieceId}
```

Operaciones explícitas:

```http
POST /api/pieces/{id}/engineering/release

POST /api/pieces/{id}/production/start

POST /api/pieces/{id}/production/complete

POST /api/pieces/{id}/quality/inspections

POST /api/pieces/{id}/quality/approve

POST /api/pieces/{id}/quality/reject

POST /api/shipments

POST /api/shipments/{id}/dispatch

POST /api/pieces/{id}/receive

POST /api/pieces/{id}/mount
```

Me gusta mucho más esto que:

```http
POST /crud.php

opcion=3
```

porque la operación describe directamente el negocio.

---

# 24. OpenAPI desde el primer día

ASP.NET Core generaría especificación OpenAPI.

Eso permite tener:

```text
API
 ↓
OpenAPI
 ↓
TypeScript client
 ↓
React
```

El frontend podría generar automáticamente tipos a partir del contrato del backend.

Así evitamos que frontend y backend diverjan.

---

# 25. Archivos y evidencias

Aunque el sistema anterior no maneje archivos de manera significativa, prepararía Gilbert v2 para almacenar:

- fotografías;
- planos;
- documentos;
- reportes de calidad;
- certificados;
- evidencia de daños;
- remisiones.

No guardaría archivos binarios dentro de PostgreSQL.

Usaría almacenamiento tipo:

```text
S3 Object Storage
```

y en PostgreSQL:

```text
Attachment
├── Id
├── EntityType
├── EntityId
├── FileName
├── MimeType
├── StorageKey
├── UploadedBy
└── UploadedAt
```

---

# 26. Background jobs

No metería Kafka ni RabbitMQ inicialmente.

Pero sí tendría capacidad para tareas en background.

Por ejemplo:

```text
generar reporte
enviar notificación
procesar Excel
generar PDF
calcular métricas
```

Podría utilizar algo como Hangfire o Quartz si aparece la necesidad.

Pero no lo agregaría hasta necesitarlo.

---

# 27. Redis tampoco desde el primer día

No utilizaría Redis porque "una aplicación moderna debe tener Redis".

Primero:

```text
React
ASP.NET
PostgreSQL
```

Si después tenemos:

- caching pesado;
- locks distribuidos;
- sesiones distribuidas;
- jobs;
- rate limiting distribuido;

entonces introduciría Redis.

No antes.

---

# 28. Docker sí

El entorno completo debería poder arrancarse de manera reproducible.

Por ejemplo:

```text
docker compose up
```

levantando:

```text
postgres
api
web
```

En producción cada componente podría desplegarse de forma independiente, pero el desarrollo debe ser sencillo.

---

# 29. Observabilidad

Desde el principio utilizaría:

```text
structured logging
+
OpenTelemetry
```

Para poder rastrear:

```text
HTTP Request
    ↓
Application Command
    ↓
Database Query
```

Y errores mediante algo como Sentry/Application Insights según la infraestructura seleccionada.

Un sistema que controla producción no debería depender de:

> "A mí me salió un error ayer."

Necesitamos evidencia.

---

# 30. Testing

Separaría las pruebas en tres niveles.

### Unitarias

Para reglas del dominio:

```text
Quality cannot approve an unfinished piece.

A cancelled piece cannot be shipped.

Mounted weight cannot exceed received weight.
```

### Integration

Contra PostgreSQL real/contenedorizado:

```text
API → EF → PostgreSQL
```

### E2E

Con Playwright:

```text
Login
 ↓
Abrir OTA
 ↓
Seleccionar pieza
 ↓
Completar inspección
 ↓
Aprobar
 ↓
Verificar estado
```

---

# 31. Lo que explícitamente NO elegiría

## Microservicios

No existe una razón empresarial suficiente inicialmente.

## Next.js

No necesitamos su arquitectura SSR/SEO para una aplicación industrial interna.

## MongoDB

El dominio es altamente relacional.

## Firebase como backend

No quiero que el modelo de datos y las reglas centrales dependan de un backend documental orientado principalmente al cliente.

## GraphQL

REST cubre las necesidades iniciales con menor complejidad.

## Redux

No hasta demostrar que existe estado cliente global suficientemente complejo.

## Kubernetes

No al principio.

Sería una cantidad enorme de infraestructura para una aplicación que puede funcionar con pocos servicios.

## Event sourcing

No.

Sí quiero auditoría y eventos de dominio.

Pero no quiero que el estado principal de Gilbert tenga que reconstruirse reproduciendo miles de eventos.

---

# 32. El stack definitivo

| Área | Tecnología |
|---|---|
| Arquitectura | **Monolito modular** |
| Frontend | **React 19** |
| Lenguaje frontend | **TypeScript strict** |
| Tooling frontend | **Vite 8** |
| UI | **Tailwind CSS + shadcn/ui** |
| Tablas | **TanStack Table** |
| Server state | **TanStack Query** |
| Formularios | **React Hook Form** |
| Validación frontend | **Zod** |
| Backend | **ASP.NET Core 10** |
| Lenguaje backend | **C#** |
| API | **REST** |
| Contrato | **OpenAPI** |
| ORM | **Entity Framework Core 10** |
| Base de datos | **PostgreSQL 18** |
| Auth | **OIDC + RBAC/permisos** |
| Auditoría | **Audit log propio** |
| Archivos | **S3-compatible storage** |
| Testing backend | **xUnit** |
| Testing frontend | **Vitest** |
| E2E | **Playwright** |
| Infraestructura | **Docker** |
| CI/CD | **GitHub Actions** |
| Telemetría | **OpenTelemetry** |
| Logs | **Structured logging** |

---

# 33. Estructura aproximada del repositorio

No veo necesidad de Turborepo porque frontend y backend utilizan ecosistemas diferentes.

Preferiría algo sencillo:

```text
gilbert/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── modules/
│   │   │   ├── projects/
│   │   │   ├── engineering/
│   │   │   ├── planning/
│   │   │   ├── production/
│   │   │   ├── materials/
│   │   │   ├── quality/
│   │   │   ├── shipping/
│   │   │   └── site/
│   │   ├── components/
│   │   └── lib/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── Gilbert.Api/
│   │   ├── Gilbert.Domain/
│   │   ├── Gilbert.Application/
│   │   └── Gilbert.Infrastructure/
│   └── tests/
│
├── docker/
│
├── docs/
│   ├── architecture/
│   ├── business-rules/
│   └── adr/
│
├── compose.yml
└── README.md
```

Una única base de código y una arquitectura entendible.

---

# 34. La prioridad del proyecto no debería ser el frontend

Si yo dirigiera la reconstrucción, **no comenzaría haciendo pantallas**.

El orden sería:

```text
1. Documentar procesos reales

        ↓

2. Identificar entidades de negocio

        ↓

3. Definir estados y transiciones

        ↓

4. Definir permisos

        ↓

5. Diseñar modelo de datos

        ↓

6. Diseñar API

        ↓

7. Construir backend

        ↓

8. Construir frontend

        ↓

9. Migrar información histórica

        ↓

10. Validar contra el proceso real
```

Porque el verdadero valor de Gilbert está en lo primero.

---

# 35. La pregunta fundamental que usaría durante todo el desarrollo

Para cada funcionalidad preguntaría:

> **¿Qué ocurrió realmente en la fábrica?**

Por ejemplo, no modelaría:

```text
soldadura = SI
```

Modelaría:

```text
El inspector Carlos aprobó
la inspección de soldadura
de la pieza A-102
el 20 de agosto a las 14:32.
```

No modelaría:

```text
enviado = SI
```

Modelaría:

```text
La pieza A-102 fue incluida
en la remisión R-382
del embarque E-103
que salió el 20 de agosto.
```

No modelaría:

```text
recibido = SI
```

Modelaría:

```text
La pieza A-102 fue recibida
en obra por Juan Pérez
el 21 de agosto.
```

Es una diferencia enorme.

La primera forma modela **campos de una pantalla**.

La segunda modela **el proceso de la empresa**.

---

# Conclusión

Mi recomendación definitiva es:

> ## **React + TypeScript + Vite + ASP.NET Core/C# + PostgreSQL, bajo una arquitectura de monolito modular.**

Y la elección no parte de las tecnologías que usaba Gilbert hace seis años.

Parte de que Gilbert es un sistema industrial con:

- procesos secuenciales;
- datos altamente relacionados;
- múltiples usuarios y áreas;
- reglas de transición;
- información crítica;
- necesidad de auditoría;
- consultas y dashboards;
- operación desde escritorio/tablet;
- y una expectativa razonable de muchos años de vida.

ASP.NET Core y C# serían el corazón porque quiero que **las reglas de la empresa sean explícitas, tipadas, testeables y protegidas en el backend**. PostgreSQL sería el núcleo porque el dominio es claramente relacional. React + Vite sería la interfaz porque quiero una aplicación rica y altamente interactiva sin introducir las abstracciones de SSR que Gilbert no necesita.

Pero la decisión más importante no es ninguna de esas tecnologías:

> **Gilbert v2 debe modelar el recorrido real de una pieza por la empresa.**

```text
Proyecto
   ↓
OTA
   ↓
Pieza
   ↓
Ingeniería
   ↓
Planeación
   ↓
Producción
   ↓
Calidad
   ↓
Embarque
   ↓
Obra
```

con usuarios, permisos, fechas, responsables, pesos, evidencias e historial alrededor de ese recorrido.

El sistema anterior ya demuestra que **ese proceso es el verdadero corazón del producto**.

Todo lo demás —PHP, Bootstrap, jQuery, DataTables, incluso React o .NET— es reemplazable. **El modelo del negocio es lo que hay que diseñar correctamente esta vez.**
