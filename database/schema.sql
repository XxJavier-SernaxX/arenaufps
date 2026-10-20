-- ==============================================================================
-- PROYECTO: ArenaUFPS - Liga Universitaria de Videojuegos y e-Sports
-- ARQUITECTURA ORIENTADA A SERVICIOS (SOA)
-- Base de Datos: PostgreSQL / Supabase
-- Separación de Esquemas: Servicio de Liga (API 1) y Servicio de Resultados (API 2)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- ESQUEMA 1: API 1 - SERVICIO DE LIGA (Principal)
-- Gestiona jugadores, equipos, videojuegos, torneos, inscripciones y partidos
-- ==============================================================================

-- 1. Videojuegos competitivos
CREATE TABLE IF NOT EXISTS public.videojuegos (
    id VARCHAR(50) PRIMARY KEY, -- 'valorant', 'league-of-legends', 'rocket-league', 'cs2'
    nombre VARCHAR(120) NOT NULL,
    genero VARCHAR(80) NOT NULL,
    tamanio_equipo INTEGER DEFAULT 5 NOT NULL,
    imagen_url TEXT,
    activo BOOLEAN DEFAULT true NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Jugadores universitarios UFPS
CREATE TABLE IF NOT EXISTS public.jugadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nickname VARCHAR(80) UNIQUE NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    correo VARCHAR(180) UNIQUE NOT NULL,
    codigo_estudiantil VARCHAR(30) UNIQUE,
    carrera VARCHAR(120) NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Equipos
CREATE TABLE IF NOT EXISTS public.equipos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(120) UNIQUE NOT NULL,
    tag VARCHAR(10) UNIQUE NOT NULL,
    capitan_id UUID REFERENCES public.jugadores(id) ON DELETE RESTRICT,
    videojuego_id VARCHAR(50) REFERENCES public.videojuegos(id) ON DELETE RESTRICT,
    facultad VARCHAR(120) DEFAULT 'Facultad de Ingeniería' NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Integrantes de equipos
CREATE TABLE IF NOT EXISTS public.integrantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipo_id UUID REFERENCES public.equipos(id) ON DELETE CASCADE,
    jugador_id UUID REFERENCES public.jugadores(id) ON DELETE CASCADE,
    rol VARCHAR(50) DEFAULT 'titular' NOT NULL CHECK (rol IN ('capitan', 'titular', 'suplente')),
    fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(equipo_id, jugador_id)
);

-- 5. Torneos universitarios
CREATE TABLE IF NOT EXISTS public.torneos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(180) NOT NULL,
    videojuego_id VARCHAR(50) REFERENCES public.videojuegos(id) ON DELETE RESTRICT,
    descripcion TEXT,
    formato VARCHAR(50) DEFAULT 'liguilla' NOT NULL CHECK (formato IN ('liguilla', 'eliminacion_directa')),
    estado VARCHAR(50) DEFAULT 'abierto' NOT NULL CHECK (estado IN ('abierto', 'en_curso', 'finalizado', 'cancelado')),
    max_equipos INTEGER DEFAULT 8 NOT NULL,
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    premio TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Inscripciones de equipos en torneos
CREATE TABLE IF NOT EXISTS public.inscripciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    torneo_id UUID REFERENCES public.torneos(id) ON DELETE CASCADE,
    equipo_id UUID REFERENCES public.equipos(id) ON DELETE CASCADE,
    estado VARCHAR(50) DEFAULT 'confirmada' NOT NULL CHECK (estado IN ('pendiente', 'confirmada', 'rechazada')),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(torneo_id, equipo_id)
);

-- 7. Partidos programados
CREATE TABLE IF NOT EXISTS public.partidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    torneo_id UUID REFERENCES public.torneos(id) ON DELETE CASCADE,
    ronda INTEGER DEFAULT 1 NOT NULL,
    equipo_local_id UUID REFERENCES public.equipos(id) ON DELETE RESTRICT,
    equipo_visitante_id UUID REFERENCES public.equipos(id) ON DELETE RESTRICT,
    fecha_programada TIMESTAMP WITH TIME ZONE NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente' NOT NULL CHECK (estado IN ('pendiente', 'en_juego', 'finalizado', 'cancelado')),
    equipo_ganador_id UUID REFERENCES public.equipos(id) ON DELETE SET NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ESQUEMA 2: API 2 - SERVICIO DE RESULTADOS Y CLASIFICACIÓN (Complementario)
-- Valida resultados, calcula puntos y mantiene el ranking
-- ==============================================================================

-- 8. Resultados de partidos
CREATE TABLE IF NOT EXISTS public.resultados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partido_id UUID UNIQUE REFERENCES public.partidos(id) ON DELETE CASCADE,
    torneo_id UUID REFERENCES public.torneos(id) ON DELETE CASCADE,
    marcador_local INTEGER NOT NULL CHECK (marcador_local >= 0),
    marcador_visitante INTEGER NOT NULL CHECK (marcador_visitante >= 0),
    equipo_ganador_id UUID REFERENCES public.equipos(id) ON DELETE SET NULL,
    fecha_reporte TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    validado_con_api_liga BOOLEAN DEFAULT true NOT NULL,
    notas TEXT
);

-- 9. Posiciones / Clasificación acumulada por torneo
CREATE TABLE IF NOT EXISTS public.posiciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    torneo_id UUID REFERENCES public.torneos(id) ON DELETE CASCADE,
    equipo_id UUID REFERENCES public.equipos(id) ON DELETE CASCADE,
    partidos_jugados INTEGER DEFAULT 0 NOT NULL,
    ganados INTEGER DEFAULT 0 NOT NULL,
    empatados INTEGER DEFAULT 0 NOT NULL,
    perdidos INTEGER DEFAULT 0 NOT NULL,
    puntos_favor INTEGER DEFAULT 0 NOT NULL,
    puntos_contra INTEGER DEFAULT 0 NOT NULL,
    diferencia INTEGER DEFAULT 0 NOT NULL,
    puntos INTEGER DEFAULT 0 NOT NULL, -- 3 por victoria, 1 por empate
    posicion INTEGER DEFAULT 1 NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(torneo_id, equipo_id)
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_partidos_torneo ON public.partidos(torneo_id);
CREATE INDEX IF NOT EXISTS idx_partidos_estado ON public.partidos(estado);
CREATE INDEX IF NOT EXISTS idx_posiciones_torneo ON public.posiciones(torneo_id, puntos DESC, diferencia DESC);

-- Habilitar RLS
ALTER TABLE public.videojuegos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.torneos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resultados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posiciones ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "Public Read Videojuegos" ON public.videojuegos FOR SELECT USING (true);
CREATE POLICY "Public Read Jugadores" ON public.jugadores FOR SELECT USING (true);
CREATE POLICY "Public Read Equipos" ON public.equipos FOR SELECT USING (true);
CREATE POLICY "Public Read Integrantes" ON public.integrantes FOR SELECT USING (true);
CREATE POLICY "Public Read Torneos" ON public.torneos FOR SELECT USING (true);
CREATE POLICY "Public Read Inscripciones" ON public.inscripciones FOR SELECT USING (true);
CREATE POLICY "Public Read Partidos" ON public.partidos FOR SELECT USING (true);
CREATE POLICY "Public Read Resultados" ON public.resultados FOR SELECT USING (true);
CREATE POLICY "Public Read Posiciones" ON public.posiciones FOR SELECT USING (true);
