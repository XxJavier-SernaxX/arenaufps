# Arquitectura del Sistema UniE-Sports (SOA)

## 1. Visión General
**UniE-Sports** es una plataforma universitaria para la gestión de deportes electrónicos y torneos competitivos basada en una **Arquitectura Orientada a Servicios (SOA)**.

Inspirado en la separación estructural del repositorio docente `coordinacion-emergencia` (`api-emergencias`, `api-ubicacion`, `web`), UniE-Sports desacopla estrictamente:
- **`api-torneos`**: Gestión del ciclo de vida de competiciones, catálogo de videojuegos, jugadores, equipos, inscripciones y generación de enfrentamientos.
- **`api-resultados`**: Registro de marcadores, validación inter-servicio mediante HTTP, cálculo de tablas de posiciones (standings) y estadísticas.
- **`web`**: Aplicación web moderna para jugadores, capitanes, árbitros y espectadores con interfaz competitiva de eSports.
- **`Supabase`**: Base de datos relacional PostgreSQL con políticas de seguridad a nivel de fila (RLS) y autenticación.

---

## 2. Diagrama de Arquitectura SOA

```mermaid
flowchart TD
    subgraph Clientes["Capa de Presentación / Consumidores"]
        U["Usuario / Jugador / Árbitro"]
        ExtApp["Aplicación Externa Universitaria"]
        Web["Aplicación Web (UniE-Sports Web)\nNext.js + Tailwind CSS"]
    end

    subgraph API_Torneos["Servicio 1: api-torneos (Puerto 8001 / /api/v1)"]
        T_Router["Router de Torneos e Inscripciones"]
        T_Matches["Gestor de Enfrentamientos"]
        T_Teams["Gestor de Equipos y Jugadores"]
    end

    subgraph API_Resultados["Servicio 2: api-resultados (Puerto 8002 / /api/v1)"]
        R_Router["Router de Resultados"]
        R_Validator["Validador Inter-Servicio HTTP"]
        R_Standings["Motor de Clasificación y Estadísticas"]
    end

    subgraph Persistencia["Capa de Datos y Seguridad"]
        DB[("Supabase PostgreSQL\n- tournaments, matches\n- teams, players\n- results, standings")]
        RLS["Políticas Row Level Security (RLS)"]
    end

    U --> Web
    ExtApp -->|REST / JSON| API_Torneos
    ExtApp -->|REST / JSON| API_Resultados
    Web -->|GET /tournaments, /teams| API_Torneos
    Web -->|POST /results, GET /standings| API_Resultados

    %% Comunicación HTTP Inter-Servicio
    R_Validator -->|"1. GET /matches/{id} (HTTP)"| T_Matches
    R_Validator -->|"2. PATCH /matches/{id} (HTTP status: completed)"| T_Matches

    API_Torneos --> RLS --> DB
    API_Resultados --> RLS --> DB
```

---

## 3. Flujo Obligatorio de Comunicación Inter-Servicios (Caso de Uso Principal)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Árbitro / Administrador
    participant Web as UniE-Sports Web
    participant R_API as api-resultados
    participant T_API as api-torneos
    participant DB as Supabase PostgreSQL

    Admin->>Web: Ingresa marcador de partida (Team A: 13, Team B: 8)
    Web->>R_API: POST /api/v1/results { match_id, score_a, score_b, winner_id }
    Note over R_API,T_API: Comunicación HTTP Real entre Servicios SOA
    R_API->>T_API: GET /api/v1/matches/{match_id} (HTTP Request)
    alt Partida no existe o no pertenece al torneo
        T_API-->>R_API: HTTP 404 Not Found
        R_API-->>Web: HTTP 404 "La partida no existe en el sistema de torneos"
    else Partida ya finalizada o cancelada
        T_API-->>R_API: HTTP 200 { status: 'completed' }
        R_API-->>Web: HTTP 400 "La partida ya cuenta con un resultado registrado"
    else Partida válida y programada
        T_API-->>R_API: HTTP 200 { id, tournament_id, team_a_id, team_b_id, status: 'scheduled' }
        R_API->>DB: INSERT INTO results (match_id, score_a, score_b, winner_id)
        R_API->>T_API: PATCH /api/v1/matches/{match_id} { status: 'completed', winner_team_id }
        T_API->>DB: UPDATE matches SET status = 'completed'
        T_API-->>R_API: HTTP 200 { updated: true }
        R_API->>DB: RECALCULAR Y ACTUALIZAR standings (Puntos, W/D/L, Diferencia)
        R_API->>DB: ACTUALIZAR estadísticas de equipos y jugadores
        R_API-->>Web: HTTP 201 { success: true, result, standings_updated: true }
        Web->>Admin: Muestra notificación de éxito y tabla de posiciones actualizada en vivo
    end
```

---

## 4. Contratos de las APIs REST

### 4.1. `api-torneos`
| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/games` | Catálogo de videojuegos soportados | Público |
| `GET` | `/api/v1/tournaments` | Listado de torneos con filtros (juego, estado) | Público |
| `GET` | `/api/v1/tournaments/:id` | Detalle del torneo, reglas y formato | Público |
| `POST` | `/api/v1/tournaments` | Creación de nuevo torneo | Protegido (Admin) |
| `PATCH` | `/api/v1/tournaments/:id` | Actualización de estado del torneo | Protegido (Admin) |
| `GET` | `/api/v1/teams` | Directorio de equipos universitarios | Público |
| `POST` | `/api/v1/teams` | Registro de nuevo equipo | Autenticado |
| `GET` | `/api/v1/players` | Catálogo de jugadores y perfiles | Público |
| `POST` | `/api/v1/players` | Registro de nuevo jugador | Autenticado |
| `POST` | `/api/v1/tournaments/:id/registrations` | Inscripción de equipo a torneo | Autenticado |
| `GET` | `/api/v1/tournaments/:id/matches` | Lista de enfrentamientos del torneo | Público |
| `GET` | `/api/v1/matches/:id` | Consulta de partida individual (usada por api-resultados) | Público / SOA |
| `PATCH` | `/api/v1/matches/:id` | Actualización de estado de la partida | SOA / Admin |
| `POST` | `/api/v1/tournaments/:id/generate-matches` | Generador automático de fixture liguilla | Protegido (Admin) |

### 4.2. `api-resultados`
| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/results` | Registro de resultado con validación HTTP contra `api-torneos` | Protegido (Árbitro/Admin) |
| `GET` | `/api/v1/results` | Historial general de resultados | Público |
| `GET` | `/api/v1/results/:id` | Detalle de un resultado específico | Público |
| `GET` | `/api/v1/tournaments/:id/standings` | Tabla de posiciones calculada de un torneo | Público |
| `GET` | `/api/v1/teams/:id/statistics` | Estadísticas acumuladas de un equipo | Público |
| `GET` | `/api/v1/players/:id/statistics` | Estadísticas individuales de un jugador | Público |
| `GET` | `/api/v1/teams/:id/history` | Historial de enfrentamientos de un equipo | Público |

---

## 5. Estrategia de Despliegue en Niveles Gratuitos
- **GitHub**: Repositorio único monorepo modular con carpetas `api-torneos`, `api-resultados`, `web` y `database`.
- **Vercel**: Despliegue con Serverless Functions y Next.js App Router. Cada endpoint `/api/v1/*` es servido por su respectivo módulo desacoplado.
- **Supabase**: Base de datos PostgreSQL alojada en el Free Tier con conexión por pooler transaccional, SSL y RLS activo.
- **Resiliencia Offline / Mock Store**: En caso de no configurar de inmediato las credenciales de Supabase, el sistema cuenta con un motor de almacenamiento en memoria con datos presembrados idénticos a `database/seed.sql`, garantizando que las pruebas y la navegación funcionen al 100%.
