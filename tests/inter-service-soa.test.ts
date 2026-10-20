// ==============================================================================
// ArenaUFPS: Pruebas Automatizadas de Arquitectura SOA y Comunicación Inter-Servicios
// ==============================================================================
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../src/lib/store';
import { ligaClient, resultadosClient } from '../src/lib/api-clients';

describe('ArenaUFPS: Pruebas de Servicios SOA (API 1 Liga <-> API 2 Resultados)', () => {
  beforeEach(() => {
    store.resetToDefault();
  });

  it('1. Debe consultar el catálogo de videojuegos y equipos en API 1 (Servicio de Liga)', () => {
    const videojuegos = store.getVideojuegos();
    expect(videojuegos.length).toBeGreaterThanOrEqual(3);
    expect(videojuegos.some((v) => v.id === 'valorant')).toBe(true);

    const equipos = store.getEquipos();
    expect(equipos.length).toBeGreaterThanOrEqual(4);
    expect(equipos[0].nombre).toContain('Sistemas Gaming UFPS');
  });

  it('2. Ciclo Completo: Crear torneo, inscribir 2 equipos y programar partido en API 1', () => {
    // A. Crear torneo
    const nuevoTorneo = store.crearTorneo({
      nombre: 'Torneo Prueba SOA UFPS',
      videojuego_id: 'valorant',
      formato: 'liguilla',
      estado: 'abierto',
      max_equipos: 4,
      fecha_inicio: new Date().toISOString(),
    });
    expect(nuevoTorneo.id).toBeDefined();

    // B. Crear e inscribir dos equipos
    const capitan1 = store.getJugadores()[0];
    const capitan2 = store.getJugadores()[1];

    const eqA = store.crearEquipo({
      nombre: 'Red Team UFPS',
      tag: 'RED',
      capitan_id: capitan1.id,
      videojuego_id: 'valorant',
      facultad: 'Ingeniería',
    });

    const eqB = store.crearEquipo({
      nombre: 'Black Team UFPS',
      tag: 'BLK',
      capitan_id: capitan2.id,
      videojuego_id: 'valorant',
      facultad: 'Ingeniería',
    });

    const ins1 = store.inscribirEquipo(nuevoTorneo.id, eqA.id);
    const ins2 = store.inscribirEquipo(nuevoTorneo.id, eqB.id);
    expect(ins1.estado).toBe('confirmada');
    expect(ins2.estado).toBe('confirmada');

    // C. Programar partido
    const partido = store.programarPartido({
      torneo_id: nuevoTorneo.id,
      ronda: 1,
      equipo_local_id: eqA.id,
      equipo_visitante_id: eqB.id,
      fecha_programada: new Date().toISOString(),
      estado: 'pendiente',
    });
    expect(partido.estado).toBe('pendiente');
  });

  it('3. Rechazo de Validación SOA: API 2 debe rechazar resultados para partidos inexistentes', async () => {
    const validacion = await ligaClient.validarPartido('partido-fantasma-999', 'torneo-xyz');
    expect(validacion.valido).toBe(false);
    expect(validacion.mensaje).toContain('no existe');
  });

  it('4. Rechazo de Validación SOA: API 2 debe rechazar resultado si el partido ya está finalizado', async () => {
    // El partido 44444444-4444-4444-4444-444444444441 ya viene finalizado de semilla
    const validacion = await ligaClient.validarPartido(
      '44444444-4444-4444-4444-444444444441',
      '33333333-3333-3333-3333-333333333331'
    );
    expect(validacion.valido).toBe(false);
    expect(validacion.mensaje).toContain('ya fue finalizado previamente');
  });

  it('5. Flujo Exitoso Inter-Servicio: API 2 valida partido con API 1, asienta marcador, notifica cierre y calcula puntos', async () => {
    const partidoPendienteId = '44444444-4444-4444-4444-444444444442'; // Mecatrónica vs Industrial
    const torneoId = '33333333-3333-3333-3333-333333333331';

    // Paso 1: API 2 valida el partido contra API 1
    const validacion = await ligaClient.validarPartido(partidoPendienteId, torneoId);
    expect(validacion.valido).toBe(true);
    expect(validacion.partido).toBeDefined();

    // Paso 2: Mecatrónica gana 13 - 7
    const nuevoResultado = store.guardarResultado({
      partido_id: partidoPendienteId,
      torneo_id: torneoId,
      marcador_local: 13,
      marcador_visitante: 7,
      equipo_ganador_id: validacion.partido!.equipo_local_id,
      validado_con_api_liga: true,
      notas: 'Prueba automatizada de integración SOA',
    });
    expect(nuevoResultado.id).toBeDefined();

    // Paso 3: API 2 notifica a API 1 para cerrar el partido
    await ligaClient.marcarPartidoFinalizado(partidoPendienteId, validacion.partido!.equipo_local_id);
    const partidoActualizado = store.getPartidoPorId(partidoPendienteId);
    expect(partidoActualizado?.estado).toBe('finalizado');
    expect(partidoActualizado?.equipo_ganador_id).toBe(validacion.partido!.equipo_local_id);

    // Paso 4: API 2 calcula y actualiza la tabla de posiciones
    const tabla = store.getPosiciones(torneoId);
    expect(tabla.length).toBe(4);

    const mecatronica = tabla.find((p) => p.equipo_id === '22222222-2222-2222-2222-222222222223');
    expect(mecatronica).toBeDefined();
    expect(mecatronica?.puntos).toBe(3); // 3 puntos por victoria
    expect(mecatronica?.ganados).toBe(1);
    expect(mecatronica?.puntos_favor).toBe(13);
    expect(mecatronica?.puntos_contra).toBe(7);
    expect(mecatronica?.diferencia).toBe(6);

    const industrial = tabla.find((p) => p.equipo_id === '22222222-2222-2222-2222-222222222224');
    expect(industrial?.puntos).toBe(0);
    expect(industrial?.perdidos).toBe(1);
  });

  it('6. Consulta Recíproca: API 1 solicita las posiciones a API 2 y recibe el ranking oficial', async () => {
    const torneoId = '33333333-3333-3333-3333-333333333331';
    const posiciones = await resultadosClient.obtenerPosiciones(torneoId);
    expect(posiciones).toBeDefined();
    expect(Array.isArray(posiciones)).toBe(true);
    expect(posiciones.length).toBe(4);
    // El primer puesto debe tener 3 puntos
    expect(posiciones[0].puntos).toBe(3);
    expect(posiciones[0].posicion).toBe(1);
  });
});
