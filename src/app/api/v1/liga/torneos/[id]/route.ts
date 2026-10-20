import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/v1/liga/torneos/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const torneo = store.getTorneoPorId(params.id);
    if (!torneo) {
      return NextResponse.json({ error: 'Torneo no encontrado' }, { status: 404 });
    }
    return NextResponse.json(torneo);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar el torneo', detalle: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/liga/torneos/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const actualizado = store.actualizarTorneo(params.id, body);
    if (!actualizado) {
      return NextResponse.json({ error: 'Torneo no encontrado' }, { status: 404 });
    }
    return NextResponse.json(actualizado);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al actualizar el torneo', detalle: error.message },
      { status: 500 }
    );
  }
}
