import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

// GET /api/v1/liga/videojuegos
export async function GET() {
  try {
    const videojuegos = store.getVideojuegos();
    return NextResponse.json(videojuegos);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error al consultar los videojuegos', detalle: error.message },
      { status: 500 }
    );
  }
}
