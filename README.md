# ArenaUFPS — Liga Universitaria de Videojuegos y e-Sports
### Arquitectura Orientada a Servicios (SOA) | Universidad Francisco de Paula Santander (UFPS)

![ArenaUFPS Banner](https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80)

## 1. Descripción del Proyecto

**ArenaUFPS** es una plataforma web modular diseñada bajo el paradigma de **Arquitectura Orientada a Servicios (SOA)** para organizar y dar seguimiento a una liga universitaria de videojuegos y deportes electrónicos en la Universidad Francisco de Paula Santander.

Inspirado en la separación estructural del repositorio docente [`didierguerreros/coordinacion-emergencia`](https://github.com/didierguerreros/coordinacion-emergencia), el proyecto desacopla estrictamente dos servicios API autónomos comunicados mediante REST sobre HTTP y una interfaz web moderna.

---

## 2. El Problema que Resuelve

Los torneos de videojuegos en el campus tradicionalmente se gestionan a través de grupos de mensajería y hojas de cálculo manuales:
- Se extravían inscripciones de equipos.
- Los horarios de las partidas se cruzan.
- Los resultados se discuten por falta de un registro oficial auditable.
- Las tablas de clasificación permanecen desactualizadas, perjudicando a jugadores, árbitros y espectadores.

**Solución:** Una plataforma web centralizada con registro de jugadores, conformación de equipos por facultades, inscripción a torneos, calendario de partidos, reporte verificado de resultados y cálculo automático de la tabla de posiciones en tiempo real.

---

## 3. Arquitectura del Sistema (SOA)

```
                            ┌──────────────────────────────────────────┐
                            │               Frontend Web               │
                            │  Torneos, equipos, calendario,          │
                            │  reporte de resultados y posiciones      │
                            └────────────────────┬─────────────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        │ REST                                            │ REST
                        ▼                                                 ▼
        ┌───────────────────────────────┐     REST (valida y consulta)    ┌───────────────────────────────┐
        │   API 1: Servicio de Liga     │ ◄─────────────────────────────► │ API 2: Resultados y Clasif.   │
        │ Jugadores, equipos, torneos,  │                                 │ Valida resultados, calcula    │
        │ inscripciones y partidos      │                                 │ puntos y mantiene el ranking  │
        └───────────────┬───────────────┘                                 └───────────────┬───────────────┘
                        │                                                                 │
                        │ SQL                                                             │ SQL
                        ▼                                                                 ▼
        ┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
        │                                  Base de Datos en la Nube                                       │
        │                       Esquemas / tablas propios de cada servicio (Supabase)                     │
        └─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Estructura del Repositorio

El proyecto conserva la organización en carpetas idéntica a la del profesor:

```
tipoparcialAOS/
├── api-liga/                  # API 1: Microservicio de Gestión de Liga (puerto 8001)
│   └── main.ts
├── api-resultados/            # API 2: Microservicio de Resultados y Clasificación (puerto 8002)
│   └── main.ts
├── database/                  # Scripts SQL con esquemas separados para Supabase
│   ├── schema.sql             # DDL: tablas de Liga y tablas de Resultados + RLS
│   └── seed.sql               # Datos iniciales reales de la UFPS
├── src/                       # Frontend Web e implementación serverless integrada para Vercel
│   ├── app/
│   │   ├── api/v1/liga/       # Rutas REST de API 1
│   │   ├── api/v1/resultados/ # Rutas REST de API 2
│   │   ├── torneos/           # Vista de Torneos e Inscripción
│   │   ├── equipos/           # Directorio de Equipos y Jugadores
│   │   ├── partidos/          # Calendario de Partidos Programados
│   │   ├── posiciones/        # Tabla Oficial de Clasificación
│   │   ├── reportar/          # Consola de Reporte con Visualizador SOA en Vivo
│   │   └── arquitectura/      # Diagramas, especificación OpenAPI y pruebas
│   ├── components/            # Componentes React (Navbar, Footer, etc.)
│   ├── lib/                   # Clientes HTTP inter-servicios y capa de persistencia
│   └── types/                 # Tipos TypeScript y contratos de datos
├── tests/                     # Pruebas automatizadas de integración SOA (Vitest)
│   └── inter-service-soa.test.ts
├── docs/                      # Informes académicos y documentación de arquitectura
├── .env.example               # Variables de entorno requeridas
└── README.md
```

---

## 5. Comunicación Obligatoria entre Servicios (REST sobre HTTP)

Las dos APIs colaboran de forma real y estricta en tres momentos clave:

1. **Validación:**
   - Al llegar un resultado (`POST /api/v1/resultados`), la **API 2** ejecuta una petición HTTP `GET /api/v1/liga/partidos/{id}` a la **API 1**.
   - Comprueba que el partido exista, esté en estado `'pendiente'` y que los equipos coincidan. Si no es válido o ya fue cerrado, **lo rechaza con código 400**.
2. **Cierre:**
   - Tras validar y computar los puntos de la victoria o empate, la **API 2** ejecuta una petición HTTP `PATCH /api/v1/liga/partidos/{id}` a la **API 1** marcando el estado como `'finalizado'` y asignando al equipo ganador.
3. **Consulta:**
   - Cuando el usuario consulta la tabla de posiciones en la plataforma, la **API 1** solicita a la **API 2** el ranking actualizado mediante `GET /api/v1/posiciones?torneo_id={id}`.

> **Regla de oro:** Ninguna de las dos APIs puede cumplir su función sin la otra.

---

## 6. Demostración del Ciclo Completo (Los 8 Pasos de la Actividad)

Puedes demostrar el ciclo completo directamente desde la aplicación web o mediante las pruebas automatizadas:

| Paso | Acción | Componente |
| :---: | :--- | :--- |
| **1** | Crear un torneo (ej: *Copa Universitaria ArenaUFPS 2026*) | Frontend ➔ `POST /api/v1/liga/torneos` (API 1) |
| **2** | Inscribir dos equipos (ej: *Sistemas Gaming* y *Electrónica eSports*) | Frontend ➔ `POST /api/v1/liga/torneos/{id}/inscripciones` (API 1) |
| **3** | Programar un partido en estado `'pendiente'` | Frontend ➔ `POST /api/v1/liga/torneos/{id}/partidos` (API 1) |
| **4** | Reportar el marcador desde la web (ej: 13 - 7) | Frontend ➔ `POST /api/v1/resultados` (API 2) |
| **5** | Validación HTTP inter-servicio | **API 2** consulta `GET /api/v1/liga/partidos/{id}` a **API 1** |
| **6** | Calcular puntos (3 pts victoria, 1 pt empate) | **API 2** actualiza la tabla de posiciones |
| **7** | Cierre oficial del partido | **API 2** avisa a **API 1** con `PATCH /api/v1/liga/partidos/{id}` |
| **8** | Visualizar la tabla de posiciones actualizada en vivo | Frontend muestra el ranking con puntos y diferencia calculados |

---

## 7. Instalación y Ejecución Local

### Prerrequisitos
- Node.js versión 18 o superior.
- Git.

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/arenaufps.git
   cd arenaufps
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env.local
   ```

4. **Ejecutar la plataforma web y APIs:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

5. **Ejecutar las pruebas automatizadas de comunicación SOA:**
   ```bash
   npm test
   ```
   *Salida esperada: 6/6 pruebas aprobadas verificando el ciclo completo y las llamadas REST entre APIs.*

---

## 8. Despliegue en la Nube (Vercel & Supabase)

### A. Configuración de Base de Datos en Supabase (Gratuito)
1. Crea un proyecto gratuito en [Supabase](https://supabase.com).
2. Ve al **SQL Editor** de Supabase y ejecuta el script [`database/schema.sql`](database/schema.sql).
3. Opcionalmente ejecuta [`database/seed.sql`](database/seed.sql) para cargar los datos de demostración de la UFPS.
4. En **Project Settings > API**, copia la URL del proyecto y la anon key pública.

### B. Despliegue en Vercel (Gratuito)
1. Sube tu código a un repositorio en **GitHub**.
2. Conecta tu cuenta de GitHub en [Vercel](https://vercel.com) e importa el proyecto.
3. Configura las siguientes variables de entorno:
   - `NEXT_PUBLIC_SITE_URL`: La URL asignada por Vercel (ej: `https://arenaufps.vercel.app`).
   - `NEXT_PUBLIC_SUPABASE_URL`: Tu URL de Supabase.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase.
4. Haz clic en **Deploy**. ¡Listo!

---

## 9. Contratos de las APIs REST (OpenAPI 3.0)

La documentación interactiva y el esquema completo en JSON están disponibles en:
- Ruta en vivo: `/api/v1/openapi.json`
- Vista interactiva con consola de pruebas: `/arquitectura`

---

## 10. Créditos Académicos
- **Institución:** Universidad Francisco de Paula Santander (UFPS)
- **Materia:** Arquitectura Orientada a Servicios (SOA)
- **Referencia del docente:** `didierguerreros/coordinacion-emergencia`
