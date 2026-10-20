// ==============================================================================
// ArenaUFPS: API 1 - Servicio de Liga (Microservicio Autónomo)
// Puerto por defecto: 8001
// Responsabilidad: Videojuegos, Jugadores, Equipos, Torneos, Inscripciones, Partidos
// ==============================================================================
import http from 'http';
import { parse } from 'url';
import { store } from '../src/lib/store';
import { resultadosClient } from '../src/lib/api-clients';

const PORT = process.env.PORT || 8001;

const server = http.createServer(async (req, res) => {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const { pathname, query } = parse(req.url || '', true);
  const jsonResponse = (data: any, status: number = 200) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  };

  const getBody = (): Promise<any> => {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
  };

  try {
    // 1. Estado del servicio
    if (pathname === '/' || pathname === '/health') {
      return jsonResponse({
        servicio: 'API 1: Servicio de Liga (ArenaUFPS)',
        version: '1.0.0',
        estado: 'operativo',
        puerto: PORT,
      });
    }

    // 2. Videojuegos
    if (pathname === '/videojuegos' || pathname === '/api/v1/liga/videojuegos') {
      return jsonResponse(store.getVideojuegos());
    }

    // 3. Jugadores
    if (pathname === '/jugadores' || pathname === '/api/v1/liga/jugadores') {
      if (req.method === 'GET') return jsonResponse(store.getJugadores());
      if (req.method === 'POST') {
        const body = await getBody();
        const nuevo = store.crearJugador(body);
        return jsonResponse(nuevo, 201);
      }
    }

    // 4. Equipos
    if (pathname === '/equipos' || pathname === '/api/v1/liga/equipos') {
      if (req.method === 'GET') return jsonResponse(store.getEquipos());
      if (req.method === 'POST') {
        const body = await getBody();
        const nuevo = store.crearEquipo(body);
        return jsonResponse(nuevo, 201);
      }
    }

    // 5. Torneos
    if (pathname === '/torneos' || pathname === '/api/v1/liga/torneos') {
      if (req.method === 'GET') return jsonResponse(store.getTorneos());
      if (req.method === 'POST') {
        const body = await getBody();
        const nuevo = store.crearTorneo(body);
        return jsonResponse(nuevo, 201);
      }
    }

    // 6. Partido individual (PUNTO DE VALIDACIÓN Y CIERRE PARA API 2)
    const partidoMatch = pathname?.match(/^\/(?:api\/v1\/liga\/)?partidos\/([a-zA-Z0-9-]+)$/);
    if (partidoMatch) {
      const partidoId = partidoMatch[1];
      if (req.method === 'GET') {
        const partido = store.getPartidoPorId(partidoId);
        if (!partido) return jsonResponse({ error: 'Partido no encontrado' }, 404);
        return jsonResponse(partido);
      }
      if (req.method === 'PATCH') {
        const body = await getBody();
        const actualizado = store.actualizarPartido(partidoId, {
          estado: body.estado || 'finalizado',
          equipo_ganador_id: body.equipo_ganador_id,
        });
        if (!actualizado) return jsonResponse({ error: 'Partido no encontrado' }, 404);
        return jsonResponse({ mensaje: 'Partido actualizado por API 2', partido: actualizado });
      }
    }

    // 7. Consulta de clasificación (API 1 consulta a API 2)
    const posicionesMatch = pathname?.match(/^\/(?:api\/v1\/liga\/)?torneos\/([a-zA-Z0-9-]+)\/posiciones$/);
    if (posicionesMatch && req.method === 'GET') {
      const torneoId = posicionesMatch[1];
      const posiciones = await resultadosClient.obtenerPosiciones(torneoId);
      return jsonResponse({ torneo_id: torneoId, posiciones });
    }

    return jsonResponse({ error: 'Ruta no encontrada en Servicio de Liga' }, 404);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[ArenaUFPS] API 1 (Servicio de Liga) ejecutándose en http://localhost:${PORT}`);
  });
}

export default server;
