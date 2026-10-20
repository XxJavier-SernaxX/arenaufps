import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/v1/liga/equipos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videojuegoId = searchParams.get('videojuego_id') || undefined;
    const equipos = store.getEquipos(videojuegoId);
    return NextResponse.json(equipos);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar los equipos', detalle: error.message },
      { status: 500 }
    );
  }
}

// POST /api/v1/liga/equipos
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.nombre || !body.tag || !body.capitan_id || !body.videojuego_id) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nombre, tag, capitan_id, videojuego_id' },
        { status: 400 }
      );
    }

    const nuevo = store.crearEquipo({
      nombre: body.nombre,
      tag: body.tag.toUpperCase(),
      capitan_id: body.capitan_id,
      videojuego_id: body.videojuego_id,
      facultad: body.facultad || 'Facultad de Ingeniería',
    });

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al crear el equipo', detalle: error.message },
      { status: 500 }
    );
  }
}
