import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/v1/liga/torneos/:id/partidos
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const partidos = store.getPartidos(params.id);
    return NextResponse.json(partidos);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar los partidos', detalle: error.message },
      { status: 500 }
    );
  }
}

// POST /api/v1/liga/torneos/:id/partidos
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    if (!body.equipo_local_id || !body.equipo_visitante_id || !body.fecha_programada) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: equipo_local_id, equipo_visitante_id, fecha_programada' },
        { status: 400 }
      );
    }

    if (body.equipo_local_id === body.equipo_visitante_id) {
      return NextResponse.json(
        { error: 'Un equipo no puede jugar contra sí mismo' },
        { status: 400 }
      );
    }

    const nuevo = store.programarPartido({
      torneo_id: params.id,
      ronda: body.ronda || 1,
      equipo_local_id: body.equipo_local_id,
      equipo_visitante_id: body.equipo_visitante_id,
      fecha_programada: body.fecha_programada,
      estado: 'pendiente',
    });

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al programar el partido', detalle: error.message },
      { status: 500 }
    );
  }
}
