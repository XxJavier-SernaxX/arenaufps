import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

// POST /api/v1/reset
export async function POST() {
  try {
    store.resetToDefault();
    return NextResponse.json({
      mensaje: 'Base de datos reiniciada al estado semilla oficial de ArenaUFPS',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al reiniciar datos', detalle: error.message },
      { status: 500 }
    );
  }
}
