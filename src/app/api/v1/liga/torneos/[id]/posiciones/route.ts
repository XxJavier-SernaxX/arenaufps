import { NextRequest, NextResponse } from 'next/server';
import { resultadosClient } from '@/lib/api-clients';

// GET /api/v1/liga/torneos/:id/posiciones
// La API 1 le pide a la API 2 el ranking actualizado mediante petición HTTP REST
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const posiciones = await resultadosClient.obtenerPosiciones(params.id);
    return NextResponse.json({
      origen: 'Servicio de Liga (API 1) consultando a Servicio de Resultados (API 2)',
      torneo_id: params.id,
      posiciones,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar posiciones en API 2', detalle: error.message },
      { status: 500 }
    );
  }
}
