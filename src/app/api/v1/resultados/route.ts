import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { ligaClient } from '@/lib/api-clients';

// GET /api/v1/resultados
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const torneoId = searchParams.get('torneo_id') || undefined;
    const resultados = store.getResultados(torneoId);
    return NextResponse.json(resultados);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar los resultados', detalle: error.message },
      { status: 500 }
    );
  }
}

// POST /api/v1/resultados
// Flujo Central SOA: API 2 recibe resultado, valida con API 1 por HTTP,
// guarda resultado, avisa cierre a API 1 y recalcula posiciones.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { partido_id, torneo_id, marcador_local, marcador_visitante, notas } = body;

    // 1. Validación de campos obligatorios en el payload
    if (!partido_id || !torneo_id || marcador_local === undefined || marcador_visitante === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: partido_id, torneo_id, marcador_local, marcador_visitante' },
        { status: 400 }
      );
    }

    if (typeof marcador_local !== 'number' || typeof marcador_visitante !== 'number' || marcador_local < 0 || marcador_visitante < 0) {
      return NextResponse.json(
        { error: 'Los marcadores deben ser números enteros no negativos' },
        { status: 400 }
      );
    }

    // 2. COMUNICACIÓN SOA: API 2 consulta a API 1 mediante REST HTTP
    // "Al llegar un resultado, consulta a la API 1 que el partido exista, esté pendiente y qué equipos participan; si no es válido, lo rechaza."
    const validacion = await ligaClient.validarPartido(partido_id, torneo_id);
    if (!validacion.valido) {
      return NextResponse.json(
        {
          error: 'Rechazo de validación inter-servicio (API 2 -> API 1)',
          motivo: validacion.mensaje,
          servicio_validador: 'API 1 (Servicio de Liga)',
        },
        { status: 400 }
      );
    }

    const partido = validacion.partido!;

    // Determinar ganador
    let equipoGanadorId: string | undefined = undefined;
    if (marcador_local > marcador_visitante) {
      equipoGanadorId = partido.equipo_local_id;
    } else if (marcador_visitante > marcador_local) {
      equipoGanadorId = partido.equipo_visitante_id;
    }

    // 3. Guardar el resultado en la base de datos de API 2
    const nuevoResultado = store.guardarResultado({
      partido_id,
      torneo_id,
      marcador_local,
      marcador_visitante,
      equipo_ganador_id: equipoGanadorId,
      validado_con_api_liga: true,
      notas: notas || 'Resultado verificado por la plataforma ArenaUFPS',
    });

    // 4. COMUNICACIÓN SOA: Cierre de partido
    // "Tras calcular los puntos, avisa a la API 1 para marcar el partido como finalizado."
    await ligaClient.marcarPartidoFinalizado(partido_id, equipoGanadorId);

    // 5. Obtener posiciones recién computadas
    const posicionesActualizadas = store.getPosiciones(torneo_id);

    return NextResponse.json(
      {
        mensaje: 'Resultado registrado y procesado exitosamente mediante arquitectura SOA',
        resultado: nuevoResultado,
        comunicacion_soa: {
          validacion_api_1: 'EXITOSA (Partido verificado en Servicio de Liga)',
          cierre_partido_api_1: 'NOTIFICADO (Estado cambiado a finalizado en Servicio de Liga)',
          calculo_posiciones_api_2: 'COMPLETADO (Puntos y diferencias actualizadas)',
        },
        posiciones_actualizadas: posicionesActualizadas,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error interno al procesar el resultado en API 2', detalle: error.message },
      { status: 500 }
    );
  }
}
