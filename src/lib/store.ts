// ==============================================================================
// ArenaUFPS: Capa de Persistencia y Almacén de Datos (In-Memory + Supabase Ready)
// ==============================================================================
import {
  Videojuego,
  Jugador,
  Equipo,
  Torneo,
  Inscripcion,
  Partido,
  Resultado,
  Posicion,
} from '@/types';

// DATOS SEMILLA OFICIALES (UFPS)
const DEFAULT_VIDEOJUEGOS: Videojuego[] = [
  {
    id: 'valorant',
    nombre: 'Valorant',
    genero: 'FPS Táctico',
    tamanio_equipo: 5,
    imagen_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
    activo: true,
  },
  {
    id: 'league-of-legends',
    nombre: 'League of Legends',
    genero: 'MOBA',
    tamanio_equipo: 5,
    imagen_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    activo: true,
  },
  {
    id: 'rocket-league',
    nombre: 'Rocket League',
    genero: 'Deportes / Autos',
    tamanio_equipo: 3,
    imagen_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
    activo: true,
  },
];

const DEFAULT_JUGADORES: Jugador[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    nickname: 'RedStrike',
    nombre: 'Julián Camilo Pérez',
    correo: 'julian.perez@ufps.edu.co',
    codigo_estudiantil: '1152001',
    carrera: 'Ingeniería de Sistemas',
    creado_en: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111111112',
    nickname: 'VoltMaster',
    nombre: 'Andrea Marcela Rangel',
    correo: 'andrea.rangel@ufps.edu.co',
    codigo_estudiantil: '1152002',
    carrera: 'Ingeniería Electrónica',
    creado_en: new Date(Date.now() - 86400000 * 18).toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111111113',
    nickname: 'IronGear',
    nombre: 'Sebastián Mora',
    correo: 'sebastian.mora@ufps.edu.co',
    codigo_estudiantil: '1152003',
    carrera: 'Ingeniería Mecánica',
    creado_en: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111111114',
    nickname: 'CúcutaAim',
    nombre: 'Natalia Suárez',
    correo: 'natalia.suarez@ufps.edu.co',
    codigo_estudiantil: '1152004',
    carrera: 'Ingeniería Industrial',
    creado_en: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
];

const DEFAULT_EQUIPOS: Equipo[] = [
  {
    id: '22222222-2222-2222-2222-222222222221',
    nombre: 'Sistemas Gaming UFPS',
    tag: 'SIS-UFPS',
    capitan_id: '11111111-1111-1111-1111-111111111111',
    videojuego_id: 'valorant',
    facultad: 'Facultad de Ingeniería',
    creado_en: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    nombre: 'Electrónica eSports',
    tag: 'ELEC-UFPS',
    capitan_id: '11111111-1111-1111-1111-111111111112',
    videojuego_id: 'valorant',
    facultad: 'Facultad de Ingeniería',
    creado_en: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222223',
    nombre: 'Mecatrónica Titans',
    tag: 'MECA-UFPS',
    capitan_id: '11111111-1111-1111-1111-111111111113',
    videojuego_id: 'valorant',
    facultad: 'Facultad de Ingeniería',
    creado_en: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222224',
    nombre: 'Industrial Warriors',
    tag: 'INDU-UFPS',
    capitan_id: '11111111-1111-1111-1111-111111111114',
    videojuego_id: 'valorant',
    facultad: 'Facultad de Ingeniería',
    creado_en: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

const DEFAULT_TORNEOS: Torneo[] = [
  {
    id: '33333333-3333-3333-3333-333333333331',
    nombre: 'Copa Universitaria ArenaUFPS 2026',
    videojuego_id: 'valorant',
    descripcion: 'Torneo interfacultades oficial de la Universidad Francisco de Paula Santander.',
    formato: 'liguilla',
    estado: 'en_curso',
    max_equipos: 4,
    fecha_inicio: new Date(Date.now() - 86400000 * 2).toISOString(),
    premio: '$1.500.000 COP + Trofeo Institucional UFPS',
    creado_en: new Date(Date.now() - 86400000 * 4).toISOString(),
    inscritos_count: 4,
  },
  {
    id: '33333333-3333-3333-3333-333333333332',
    nombre: 'Torneo Relámpago LoL UFPS 2026',
    videojuego_id: 'league-of-legends',
    descripcion: 'Edición abierta para la comunidad estudiantil y docentes en la Grieta del Invocador.',
    formato: 'liguilla',
    estado: 'abierto',
    max_equipos: 6,
    fecha_inicio: new Date(Date.now() + 86400000 * 5).toISOString(),
    premio: '$1.000.000 COP',
    creado_en: new Date(Date.now() - 86400000 * 1).toISOString(),
    inscritos_count: 2,
  },
];

const DEFAULT_INSCRIPCIONES: Inscripcion[] = [
  {
    id: 'ins-001',
    torneo_id: '33333333-3333-3333-3333-333333333331',
    equipo_id: '22222222-2222-2222-2222-222222222221',
    estado: 'confirmada',
    fecha_registro: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'ins-002',
    torneo_id: '33333333-3333-3333-3333-333333333331',
    equipo_id: '22222222-2222-2222-2222-222222222222',
    estado: 'confirmada',
    fecha_registro: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'ins-003',
    torneo_id: '33333333-3333-3333-3333-333333333331',
    equipo_id: '22222222-2222-2222-2222-222222222223',
    estado: 'confirmada',
    fecha_registro: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'ins-004',
    torneo_id: '33333333-3333-3333-3333-333333333331',
    equipo_id: '22222222-2222-2222-2222-222222222224',
    estado: 'confirmada',
    fecha_registro: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const DEFAULT_PARTIDOS: Partido[] = [
  {
    id: '44444444-4444-4444-4444-444444444441',
    torneo_id: '33333333-3333-3333-3333-333333333331',
    ronda: 1,
    equipo_local_id: '22222222-2222-2222-2222-222222222221',
    equipo_visitante_id: '22222222-2222-2222-2222-222222222222',
    fecha_programada: new Date(Date.now() - 86400000 * 1).toISOString(),
    estado: 'finalizado',
    equipo_ganador_id: '22222222-2222-2222-2222-222222222221',
    creado_en: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444442',
    torneo_id: '33333333-3333-3333-3333-333333333331',
    ronda: 1,
    equipo_local_id: '22222222-2222-2222-2222-222222222223',
    equipo_visitante_id: '22222222-2222-2222-2222-222222222224',
    fecha_programada: new Date(Date.now() + 86400000 * 1).toISOString(),
    estado: 'pendiente',
    creado_en: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

const DEFAULT_RESULTADOS: Resultado[] = [
  {
    id: '55555555-5555-5555-5555-555555555551',
    partido_id: '44444444-4444-4444-4444-444444444441',
    torneo_id: '33333333-3333-3333-3333-333333333331',
    marcador_local: 13,
    marcador_visitante: 9,
    equipo_ganador_id: '22222222-2222-2222-2222-222222222221',
    fecha_reporte: new Date(Date.now() - 86400000 * 1).toISOString(),
    validado_con_api_liga: true,
    notas: 'Partida inaugural. Victoria contundente de Sistemas Gaming UFPS.',
  },
];

const DEFAULT_POSICIONES: Posicion[] = [
  {
    id: 'pos-001',
    torneo_id: '33333333-3333-3333-3333-333333333331',
    equipo_id: '22222222-2222-2222-2222-222222222221',
    partidos_jugados: 1,
    ganados: 1,
    empatados: 0,
    perdidos: 0,
    puntos_favor: 13,
    puntos_contra: 9,
    diferencia: 4,
    puntos: 3,
    posicion: 1,
    actualizado_en: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'pos-002',
    torneo_id: '33333333-3333-3333-3333-333333333331',
    equipo_id: '22222222-2222-2222-2222-222222222223',
    partidos_jugados: 0,
    ganados: 0,
    empatados: 0,
    perdidos: 0,
    puntos_favor: 0,
    puntos_contra: 0,
    diferencia: 0,
    puntos: 0,
    posicion: 2,
    actualizado_en: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'pos-003',
    torneo_id: '33333333-3333-3333-3333-333333333331',
    equipo_id: '22222222-2222-2222-2222-222222222224',
    partidos_jugados: 0,
    ganados: 0,
    empatados: 0,
    perdidos: 0,
    puntos_favor: 0,
    puntos_contra: 0,
    diferencia: 0,
    puntos: 0,
    posicion: 3,
    actualizado_en: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'pos-004',
    torneo_id: '33333333-3333-3333-3333-333333333331',
    equipo_id: '22222222-2222-2222-2222-222222222222',
    partidos_jugados: 1,
    ganados: 0,
    empatados: 0,
    perdidos: 1,
    puntos_favor: 9,
    puntos_contra: 13,
    diferencia: -4,
    puntos: 0,
    posicion: 4,
    actualizado_en: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

class ArenaUFPSStore {
  // Tablas del Servicio de Liga (API 1)
  private videojuegos: Videojuego[] = JSON.parse(JSON.stringify(DEFAULT_VIDEOJUEGOS));
  private jugadores: Jugador[] = JSON.parse(JSON.stringify(DEFAULT_JUGADORES));
  private equipos: Equipo[] = JSON.parse(JSON.stringify(DEFAULT_EQUIPOS));
  private torneos: Torneo[] = JSON.parse(JSON.stringify(DEFAULT_TORNEOS));
  private inscripciones: Inscripcion[] = JSON.parse(JSON.stringify(DEFAULT_INSCRIPCIONES));
  private partidos: Partido[] = JSON.parse(JSON.stringify(DEFAULT_PARTIDOS));

  // Tablas del Servicio de Resultados y Clasificación (API 2)
  private resultados: Resultado[] = JSON.parse(JSON.stringify(DEFAULT_RESULTADOS));
  private posiciones: Posicion[] = JSON.parse(JSON.stringify(DEFAULT_POSICIONES));

  // --- REINICIAR AL ESTADO SEMILLA ---
  public resetToDefault() {
    this.videojuegos = JSON.parse(JSON.stringify(DEFAULT_VIDEOJUEGOS));
    this.jugadores = JSON.parse(JSON.stringify(DEFAULT_JUGADORES));
    this.equipos = JSON.parse(JSON.stringify(DEFAULT_EQUIPOS));
    this.torneos = JSON.parse(JSON.stringify(DEFAULT_TORNEOS));
    this.inscripciones = JSON.parse(JSON.stringify(DEFAULT_INSCRIPCIONES));
    this.partidos = JSON.parse(JSON.stringify(DEFAULT_PARTIDOS));
    this.resultados = JSON.parse(JSON.stringify(DEFAULT_RESULTADOS));
    this.posiciones = JSON.parse(JSON.stringify(DEFAULT_POSICIONES));
  }

  // ============================================================================
  // OPERACIONES DE API 1: SERVICIO DE LIGA
  // ============================================================================

  // Videojuegos
  public getVideojuegos(): Videojuego[] {
    return this.videojuegos;
  }

  public getVideojuegoPorId(id: string): Videojuego | undefined {
    return this.videojuegos.find((v) => v.id === id);
  }

  // Jugadores
  public getJugadores(): Jugador[] {
    return this.jugadores;
  }

  public getJugadorPorId(id: string): Jugador | undefined {
    return this.jugadores.find((j) => j.id === id);
  }

  public crearJugador(data: Omit<Jugador, 'id' | 'creado_en'>): Jugador {
    const nuevo: Jugador = {
      ...data,
      id: `11111111-1111-${Date.now().toString(16).slice(-4)}-${Math.floor(Math.random() * 10000)}`,
      creado_en: new Date().toISOString(),
    };
    this.jugadores.push(nuevo);
    return nuevo;
  }

  // Equipos
  public getEquipos(videojuegoId?: string): Equipo[] {
    let list = this.equipos.map((e) => {
      const capitan = this.jugadores.find((j) => j.id === e.capitan_id);
      const videojuego = this.videojuegos.find((v) => v.id === e.videojuego_id);
      return { ...e, capitan, videojuego };
    });
    if (videojuegoId) list = list.filter((e) => e.videojuego_id === videojuegoId);
    return list;
  }

  public getEquipoPorId(id: string): Equipo | undefined {
    const e = this.equipos.find((eq) => eq.id === id);
    if (!e) return undefined;
    const capitan = this.jugadores.find((j) => j.id === e.capitan_id);
    const videojuego = this.videojuegos.find((v) => v.id === e.videojuego_id);
    return { ...e, capitan, videojuego };
  }

  public crearEquipo(data: Omit<Equipo, 'id' | 'creado_en'>): Equipo {
    const nuevo: Equipo = {
      ...data,
      id: `22222222-2222-${Date.now().toString(16).slice(-4)}-${Math.floor(Math.random() * 10000)}`,
      creado_en: new Date().toISOString(),
    };
    this.equipos.push(nuevo);
    return this.getEquipoPorId(nuevo.id)!;
  }

  // Torneos
  public getTorneos(videojuegoId?: string, estado?: string): Torneo[] {
    let list = this.torneos.map((t) => {
      const videojuego = this.videojuegos.find((v) => v.id === t.videojuego_id);
      const inscritos = this.inscripciones.filter((i) => i.torneo_id === t.id && i.estado === 'confirmada').length;
      return { ...t, videojuego, inscritos_count: inscritos };
    });
    if (videojuegoId) list = list.filter((t) => t.videojuego_id === videojuegoId);
    if (estado) list = list.filter((t) => t.estado === estado);
    return list;
  }

  public getTorneoPorId(id: string): Torneo | undefined {
    const t = this.torneos.find((tour) => tour.id === id);
    if (!t) return undefined;
    const videojuego = this.videojuegos.find((v) => v.id === t.videojuego_id);
    const inscritos = this.inscripciones.filter((i) => i.torneo_id === t.id && i.estado === 'confirmada').length;
    return { ...t, videojuego, inscritos_count: inscritos };
  }

  public crearTorneo(data: Omit<Torneo, 'id' | 'creado_en' | 'inscritos_count'>): Torneo {
    const nuevo: Torneo = {
      ...data,
      id: `33333333-3333-${Date.now().toString(16).slice(-4)}-${Math.floor(Math.random() * 10000)}`,
      creado_en: new Date().toISOString(),
    };
    this.torneos.push(nuevo);
    return this.getTorneoPorId(nuevo.id)!;
  }

  public actualizarTorneo(id: string, updates: Partial<Torneo>): Torneo | undefined {
    const idx = this.torneos.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;
    this.torneos[idx] = { ...this.torneos[idx], ...updates };
    return this.getTorneoPorId(id);
  }

  // Inscripciones
  public getInscripciones(torneoId: string): Inscripcion[] {
    return this.inscripciones
      .filter((i) => i.torneo_id === torneoId)
      .map((i) => ({ ...i, equipo: this.getEquipoPorId(i.equipo_id) }));
  }

  public inscribirEquipo(torneoId: string, equipoId: string): Inscripcion {
    const torneo = this.getTorneoPorId(torneoId);
    if (!torneo) throw new Error('El torneo no existe');
    const equipo = this.getEquipoPorId(equipoId);
    if (!equipo) throw new Error('El equipo no existe');

    const existe = this.inscripciones.find((i) => i.torneo_id === torneoId && i.equipo_id === equipoId);
    if (existe) throw new Error('El equipo ya está inscrito en este torneo');

    const confirmadas = this.inscripciones.filter((i) => i.torneo_id === torneoId && i.estado === 'confirmada').length;
    if (confirmadas >= torneo.max_equipos) throw new Error('El torneo ha alcanzado el límite máximo de equipos');

    const nueva: Inscripcion = {
      id: `ins-${Date.now()}`,
      torneo_id: torneoId,
      equipo_id: equipoId,
      estado: 'confirmada',
      fecha_registro: new Date().toISOString(),
      equipo,
    };
    this.inscripciones.push(nueva);

    // Asegurar que el equipo tenga una fila inicial en posiciones del torneo
    const tienePosicion = this.posiciones.some((p) => p.torneo_id === torneoId && p.equipo_id === equipoId);
    if (!tienePosicion) {
      this.posiciones.push({
        id: `pos-${torneoId.slice(-4)}-${equipoId.slice(-4)}`,
        torneo_id: torneoId,
        equipo_id: equipoId,
        partidos_jugados: 0,
        ganados: 0,
        empatados: 0,
        perdidos: 0,
        puntos_favor: 0,
        puntos_contra: 0,
        diferencia: 0,
        puntos: 0,
        posicion: this.posiciones.filter((p) => p.torneo_id === torneoId).length + 1,
        actualizado_en: new Date().toISOString(),
      });
    }

    return nueva;
  }

  // Partidos
  public getPartidos(torneoId?: string): Partido[] {
    let list = this.partidos.map((p) => {
      const equipo_local = this.getEquipoPorId(p.equipo_local_id);
      const equipo_visitante = this.getEquipoPorId(p.equipo_visitante_id);
      const equipo_ganador = p.equipo_ganador_id ? this.getEquipoPorId(p.equipo_ganador_id) : undefined;
      const torneo = this.torneos.find((t) => t.id === p.torneo_id);
      return { ...p, equipo_local, equipo_visitante, equipo_ganador, torneo };
    });
    if (torneoId) list = list.filter((p) => p.torneo_id === torneoId);
    return list;
  }

  public getPartidoPorId(id: string): Partido | undefined {
    const p = this.partidos.find((part) => part.id === id);
    if (!p) return undefined;
    const equipo_local = this.getEquipoPorId(p.equipo_local_id);
    const equipo_visitante = this.getEquipoPorId(p.equipo_visitante_id);
    const equipo_ganador = p.equipo_ganador_id ? this.getEquipoPorId(p.equipo_ganador_id) : undefined;
    const torneo = this.torneos.find((t) => t.id === p.torneo_id);
    return { ...p, equipo_local, equipo_visitante, equipo_ganador, torneo };
  }

  public programarPartido(data: Omit<Partido, 'id' | 'creado_en' | 'equipo_local' | 'equipo_visitante' | 'equipo_ganador' | 'torneo'>): Partido {
    const nuevo: Partido = {
      ...data,
      id: `44444444-4444-${Date.now().toString(16).slice(-4)}-${Math.floor(Math.random() * 10000)}`,
      creado_en: new Date().toISOString(),
    };
    this.partidos.push(nuevo);
    return this.getPartidoPorId(nuevo.id)!;
  }

  public actualizarPartido(id: string, updates: Partial<Partido>): Partido | undefined {
    const idx = this.partidos.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.partidos[idx] = { ...this.partidos[idx], ...updates };
    return this.getPartidoPorId(id);
  }

  public generarFixtureLiguilla(torneoId: string): Partido[] {
    const torneo = this.getTorneoPorId(torneoId);
    if (!torneo) throw new Error('Torneo no encontrado');

    const inscritos = this.inscripciones
      .filter((i) => i.torneo_id === torneoId && i.estado === 'confirmada')
      .map((i) => i.equipo_id);

    if (inscritos.length < 2) {
      throw new Error('Se necesitan al menos 2 equipos confirmados para generar los partidos');
    }

    // Limpiar partidos pendientes previos si se regeneran
    this.partidos = this.partidos.filter((p) => p.torneo_id !== torneoId || p.estado === 'finalizado');

    const creados: Partido[] = [];
    let ronda = 1;
    const n = inscritos.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const nuevo: Partido = {
          id: `44444444-4444-${Date.now().toString(16).slice(-4)}-${i}${j}`,
          torneo_id: torneoId,
          ronda: ronda,
          equipo_local_id: inscritos[i],
          equipo_visitante_id: inscritos[j],
          fecha_programada: new Date(Date.now() + 86400000 * ronda).toISOString(),
          estado: 'pendiente',
          creado_en: new Date().toISOString(),
        };
        this.partidos.push(nuevo);
        creados.push(this.getPartidoPorId(nuevo.id)!);
        ronda++;
      }
    }

    this.actualizarTorneo(torneoId, { estado: 'en_curso' });
    return creados;
  }

  // ============================================================================
  // OPERACIONES DE API 2: SERVICIO DE RESULTADOS Y CLASIFICACIÓN
  // ============================================================================

  public getResultados(torneoId?: string): Resultado[] {
    if (torneoId) return this.resultados.filter((r) => r.torneo_id === torneoId);
    return this.resultados;
  }

  public getResultadoPorId(id: string): Resultado | undefined {
    return this.resultados.find((r) => r.id === id || r.partido_id === id);
  }

  public guardarResultado(data: Omit<Resultado, 'id' | 'fecha_reporte'>): Resultado {
    const nuevo: Resultado = {
      ...data,
      id: `55555555-5555-${Date.now().toString(16).slice(-4)}-${Math.floor(Math.random() * 10000)}`,
      fecha_reporte: new Date().toISOString(),
    };
    this.resultados.push(nuevo);
    this.recalcularPosiciones(data.torneo_id);
    return nuevo;
  }

  public recalcularPosiciones(torneoId: string): Posicion[] {
    const resultadosTorneo = this.resultados.filter((r) => r.torneo_id === torneoId);
    const equiposInscritos = this.inscripciones
      .filter((i) => i.torneo_id === torneoId && i.estado === 'confirmada')
      .map((i) => i.equipo_id);

    const tabla: Record<string, {
      pj: number;
      pg: number;
      pe: number;
      pp: number;
      gf: number;
      gc: number;
    }> = {};

    equiposInscritos.forEach((eqId) => {
      tabla[eqId] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0 };
    });

    resultadosTorneo.forEach((res) => {
      const partido = this.partidos.find((p) => p.id === res.partido_id);
      if (!partido) return;

      const loc = partido.equipo_local_id;
      const vis = partido.equipo_visitante_id;

      if (!tabla[loc]) tabla[loc] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0 };
      if (!tabla[vis]) tabla[vis] = { pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0 };

      tabla[loc].pj += 1;
      tabla[vis].pj += 1;

      tabla[loc].gf += res.marcador_local;
      tabla[loc].gc += res.marcador_visitante;

      tabla[vis].gf += res.marcador_visitante;
      tabla[vis].gc += res.marcador_local;

      if (res.marcador_local > res.marcador_visitante) {
        tabla[loc].pg += 1;
        tabla[vis].pp += 1;
      } else if (res.marcador_visitante > res.marcador_local) {
        tabla[vis].pg += 1;
        tabla[loc].pp += 1;
      } else {
        tabla[loc].pe += 1;
        tabla[vis].pe += 1;
      }
    });

    const nuevasPosiciones: Posicion[] = Object.keys(tabla).map((eqId) => {
      const s = tabla[eqId];
      const diff = s.gf - s.gc;
      const pts = s.pg * 3 + s.pe * 1;
      return {
        id: `pos-${torneoId.slice(-4)}-${eqId.slice(-4)}`,
        torneo_id: torneoId,
        equipo_id: eqId,
        equipo: this.getEquipoPorId(eqId),
        partidos_jugados: s.pj,
        ganados: s.pg,
        empatados: s.pe,
        perdidos: s.pp,
        puntos_favor: s.gf,
        puntos_contra: s.gc,
        diferencia: diff,
        puntos: pts,
        posicion: 1,
        actualizado_en: new Date().toISOString(),
      };
    });

    // Ordenar por Puntos DESC, Diferencia DESC, Goles a favor DESC
    nuevasPosiciones.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      if (b.diferencia !== a.diferencia) return b.diferencia - a.diferencia;
      return b.puntos_favor - a.puntos_favor;
    });

    nuevasPosiciones.forEach((pos, idx) => {
      pos.posicion = idx + 1;
    });

    this.posiciones = this.posiciones.filter((p) => p.torneo_id !== torneoId).concat(nuevasPosiciones);
    return nuevasPosiciones;
  }

  public getPosiciones(torneoId: string): Posicion[] {
    const list = this.posiciones
      .filter((p) => p.torneo_id === torneoId)
      .map((p) => ({ ...p, equipo: this.getEquipoPorId(p.equipo_id) }));
    list.sort((a, b) => a.posicion - b.posicion);
    return list;
  }
}

const globalStore = (global as any).__ArenaUFPSStore || new ArenaUFPSStore();
if (process.env.NODE_ENV !== 'production') {
  (global as any).__ArenaUFPSStore = globalStore;
}

export const store = globalStore;
