// ==============================================================================
// ArenaUFPS: Definiciones de Tipos y Contratos REST
// Modelo de Dominio en correspondencia exacta con la Actividad SOA
// ==============================================================================

// API 1: SERVICIO DE LIGA (Principal)
export interface Videojuego {
  id: string; // 'valorant', 'league-of-legends', 'rocket-league'
  nombre: string;
  genero: string;
  tamanio_equipo: number;
  imagen_url: string;
  activo: boolean;
  creado_en?: string;
}

export interface Jugador {
  id: string;
  nickname: string;
  nombre: string;
  correo: string;
  codigo_estudiantil?: string;
  carrera: string;
  creado_en?: string;
}

export interface Equipo {
  id: string;
  nombre: string;
  tag: string;
  capitan_id: string;
  capitan?: Jugador;
  videojuego_id: string;
  videojuego?: Videojuego;
  facultad: string;
  creado_en?: string;
}

export interface Integrante {
  id: string;
  equipo_id: string;
  jugador_id: string;
  jugador?: Jugador;
  rol: 'capitan' | 'titular' | 'suplente';
  fecha_ingreso: string;
}

export type FormatoTorneo = 'liguilla' | 'eliminacion_directa';
export type EstadoTorneo = 'abierto' | 'en_curso' | 'finalizado' | 'cancelado';

export interface Torneo {
  id: string;
  nombre: string;
  videojuego_id: string;
  videojuego?: Videojuego;
  descripcion?: string;
  formato: FormatoTorneo;
  estado: EstadoTorneo;
  max_equipos: number;
  fecha_inicio: string;
  fecha_fin?: string;
  premio?: string;
  creado_en?: string;
  inscritos_count?: number;
}

export interface Inscripcion {
  id: string;
  torneo_id: string;
  equipo_id: string;
  equipo?: Equipo;
  estado: 'pendiente' | 'confirmada' | 'rechazada';
  fecha_registro: string;
}

export type EstadoPartido = 'pendiente' | 'en_juego' | 'finalizado' | 'cancelado';

export interface Partido {
  id: string;
  torneo_id: string;
  torneo?: Torneo;
  ronda: number;
  equipo_local_id: string;
  equipo_local?: Equipo;
  equipo_visitante_id: string;
  equipo_visitante?: Equipo;
  fecha_programada: string;
  estado: EstadoPartido;
  equipo_ganador_id?: string;
  equipo_ganador?: Equipo;
  creado_en?: string;
}

// API 2: SERVICIO DE RESULTADOS Y CLASIFICACIÓN (Complementario)
export interface Resultado {
  id: string;
  partido_id: string;
  torneo_id: string;
  marcador_local: number;
  marcador_visitante: number;
  equipo_ganador_id?: string;
  fecha_reporte: string;
  validado_con_api_liga: boolean;
  notas?: string;
}

export interface Posicion {
  id: string;
  torneo_id: string;
  equipo_id: string;
  equipo?: Equipo;
  partidos_jugados: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  puntos_favor: number;
  puntos_contra: number;
  diferencia: number;
  puntos: number;
  posicion: number;
  actualizado_en: string;
}

// Solicitud de reporte de resultado (Payload de entrada para API 2)
export interface ReportarResultadoDTO {
  partido_id: string;
  torneo_id: string;
  marcador_local: number;
  marcador_visitante: number;
  notas?: string;
}

// Respuesta de la validación inter-servicio HTTP
export interface ValidacionPartidoResponse {
  valido: boolean;
  mensaje: string;
  partido?: Partido;
}
