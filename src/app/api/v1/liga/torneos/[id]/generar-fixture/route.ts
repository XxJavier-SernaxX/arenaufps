import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

// POST /api/v1/liga/torneos/:id/generar-fixture
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fixture = store.generarFixtureLiguilla(params.id);
    return NextResponse.json({
      mensaje: `Fixture de liguilla generado con éxito (${fixture.length} partidos creados).`,
      partidos: fixture,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al generar el fixture', detalle: error.message },
      { status: 400 }
    );
  }
}
