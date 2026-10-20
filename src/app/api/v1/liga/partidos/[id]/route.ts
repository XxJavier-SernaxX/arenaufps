import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/v1/liga/partidos/:id (Punto de validación consumido por API 2 vía HTTP)
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const partido = store.getPartidoPorId(params.id);
    if (!partido) {
      return NextResponse.json(
        { error: 'Partido no encontrado en el Servicio de Liga' },
        { status: 404 }
      );
    }
    return NextResponse.json(partido);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar el partido', detalle: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/liga/partidos/:id (Punto de cierre llamado por API 2 tras calcular puntos)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const actualizado = store.actualizarPartido(params.id, {
      estado: body.estado || 'finalizado',
      equipo_ganador_id: body.equipo_ganador_id !== undefined ? body.equipo_ganador_id : undefined,
    });

    if (!actualizado) {
      return NextResponse.json(
        { error: 'Partido no encontrado para actualizar' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      mensaje: 'Partido actualizado con éxito en el Servicio de Liga',
      partido: actualizado,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al actualizar el partido', detalle: error.message },
      { status: 500 }
    );
  }
}
