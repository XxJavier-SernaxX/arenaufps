// ==============================================================================
// ArenaUFPS: API 2 - Servicio de Resultados y Clasificación (Microservicio Autónomo)
// Puerto por defecto: 8002
// Responsabilidad: Validación HTTP con API 1, registro de resultados, cierre y posiciones
// ==============================================================================
import http from 'http';
import { parse } from 'url';
import { store } from '../src/lib/store';
import { ligaClient } from '../src/lib/api-clients';

const PORT = process.env.PORT || 8002;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
    if (pathname === '/' || pathname === '/health') {
      return jsonResponse({
        servicio: 'API 2: Servicio de Resultados y Clasificación (ArenaUFPS)',
        version: '1.0.0',
        estado: 'operativo',
        puerto: PORT,
      });
    }

    // 1. Registro y Consulta de Resultados
    if (pathname === '/resultados' || pathname === '/api/v1/resultados') {
      if (req.method === 'GET') {
        const torneoId = query.torneo_id as string | undefined;
        return jsonResponse(store.getResultados(torneoId));
      }

      if (req.method === 'POST') {
        const body = await getBody();
        const { partido_id, torneo_id, marcador_local, marcador_visitante, notas } = body;

        if (!partido_id || !torneo_id || marcador_local === undefined || marcador_visitante === undefined) {
          return jsonResponse({ error: 'Faltan campos obligatorios' }, 400);
        }

        // COMUNICACIÓN SOA: Consulta a API 1 para validación
        const validacion = await ligaClient.validarPartido(partido_id, torneo_id);
        if (!validacion.valido) {
          return jsonResponse({
            error: 'Rechazo de validación inter-servicio (API 2 -> API 1)',
            motivo: validacion.mensaje,
          }, 400);
        }

        const partido = validacion.partido!;
        let equipoGanadorId: string | undefined = undefined;
        if (marcador_local > marcador_visitante) equipoGanadorId = partido.equipo_local_id;
        else if (marcador_visitante > marcador_local) equipoGanadorId = partido.equipo_visitante_id;

        // Guardar resultado
        const nuevoResultado = store.guardarResultado({
          partido_id,
          torneo_id,
          marcador_local,
          marcador_visitante,
          equipo_ganador_id: equipoGanadorId,
          validado_con_api_liga: true,
          notas: notas || 'Resultado registrado en ArenaUFPS',
        });

        // COMUNICACIÓN SOA: Notificar cierre a API 1
        await ligaClient.marcarPartidoFinalizado(partido_id, equipoGanadorId);

        const posiciones = store.getPosiciones(torneo_id);

        return jsonResponse({
          mensaje: 'Resultado validado y registrado exitosamente por API 2',
          resultado: nuevoResultado,
          comunicacion_soa: {
            validacion_api_1: 'EXITOSA',
            cierre_partido_api_1: 'NOTIFICADO',
            calculo_posiciones_api_2: 'COMPLETADO',
          },
          posiciones,
        }, 201);
      }
    }

    // 2. Consulta de Clasificación / Posiciones
    if (pathname === '/posiciones' || pathname === '/api/v1/resultados/posiciones') {
      const torneoId = query.torneo_id as string;
      if (!torneoId) return jsonResponse({ error: 'Debe indicar torneo_id' }, 400);
      return jsonResponse(store.getPosiciones(torneoId));
    }

    return jsonResponse({ error: 'Ruta no encontrada en Servicio de Resultados' }, 404);
  } catch (error: any) {
    return jsonResponse({ error: error.message }, 500);
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[ArenaUFPS] API 2 (Servicio de Resultados) ejecutándose en http://localhost:${PORT}`);
  });
}

export default server;
