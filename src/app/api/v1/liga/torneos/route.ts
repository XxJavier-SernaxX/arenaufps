import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/v1/liga/torneos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videojuegoId = searchParams.get('videojuego_id') || undefined;
    const estado = searchParams.get('estado') || undefined;
    const torneos = store.getTorneos(videojuegoId, estado);
    return NextResponse.json(torneos);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar los torneos', detalle: error.message },
      { status: 500 }
    );
  }
}

// POST /api/v1/liga/torneos
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.nombre || !body.videojuego_id || !body.fecha_inicio) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre, videojuego_id, fecha_inicio' },
        { status: 400 }
      );
    }

    const nuevo = store.crearTorneo({
      nombre: body.nombre,
      videojuego_id: body.videojuego_id,
      descripcion: body.descripcion || '',
      formato: body.formato || 'liguilla',
      estado: body.estado || 'abierto',
      max_equipos: body.max_equipos || 4,
      fecha_inicio: body.fecha_inicio,
      fecha_fin: body.fecha_fin,
      premio: body.premio,
    });

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al crear el torneo', detalle: error.message },
      { status: 500 }
    );
  }
}
