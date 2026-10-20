import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/v1/resultados/posiciones?torneo_id=xxx
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const torneoId = searchParams.get('torneo_id');

    if (!torneoId) {
      return NextResponse.json(
        { error: 'Debe proporcionar el parámetro torneo_id' },
        { status: 400 }
      );
    }

    const posiciones = store.getPosiciones(torneoId);
    return NextResponse.json(posiciones);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar posiciones', detalle: error.message },
      { status: 500 }
    );
  }
}
