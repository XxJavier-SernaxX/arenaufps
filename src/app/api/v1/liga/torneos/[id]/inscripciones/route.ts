import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/v1/liga/torneos/:id/inscripciones
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const inscripciones = store.getInscripciones(params.id);
    return NextResponse.json(inscripciones);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar las inscripciones', detalle: error.message },
      { status: 500 }
    );
  }
}

// POST /api/v1/liga/torneos/:id/inscripciones
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    if (!body.equipo_id) {
      return NextResponse.json(
        { error: 'Falta el campo obligatorio: equipo_id' },
        { status: 400 }
      );
    }

    const nueva = store.inscribirEquipo(params.id, body.equipo_id);
    return NextResponse.json(nueva, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al inscribir el equipo', detalle: error.message },
      { status: 400 }
    );
  }
}
