import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/v1/liga/jugadores
export async function GET() {
  try {
    const jugadores = store.getJugadores();
    return NextResponse.json(jugadores);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar los jugadores', detalle: error.message },
      { status: 500 }
    );
  }
}

// POST /api/v1/liga/jugadores
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.nickname || !body.nombre || !body.correo || !body.carrera) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: nickname, nombre, correo, carrera' },
        { status: 400 }
      );
    }

    const nuevo = store.crearJugador({
      nickname: body.nickname,
      nombre: body.nombre,
      correo: body.correo,
      codigo_estudiantil: body.codigo_estudiantil,
      carrera: body.carrera,
    });

    return NextResponse.json(nuevo, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al registrar el jugador', detalle: error.message },
      { status: 500 }
    );
  }
}
