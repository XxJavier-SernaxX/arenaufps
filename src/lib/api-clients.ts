// ==============================================================================
// ArenaUFPS: Clientes de Comunicación HTTP Inter-Servicios SOA
// Implementa las llamadas REST entre API 1 (Liga) y API 2 (Resultados)
// ==============================================================================
import { Partido, Posicion, ValidacionPartidoResponse } from '@/types';
import { store } from '@/lib/store';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const API_LIGA_URL = process.env.API_LIGA_URL || `${SITE_URL}/api/v1/liga`;
export const API_RESULTADOS_URL = process.env.API_RESULTADOS_URL || `${SITE_URL}/api/v1/resultados`;

/**
 * Cliente usado por API 2 (Resultados) para comunicarse con API 1 (Liga)
 */
export class LigaServiceClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_LIGA_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  /**
   * Validación de Partido (Paso 1 del caso de uso inter-servicio):
   * API 2 consulta a API 1 si el partido existe, está pendiente y qué equipos participan.
   */
  async validarPartido(partidoId: string, torneoId?: string): Promise<ValidacionPartidoResponse> {
    try {
      const url = `${this.baseUrl}/partidos/${partidoId}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });

      if (res.status === 404) {
        return {
          valido: false,
          mensaje: `El partido con ID ${partidoId} no existe en el Servicio de Liga (API 1).`,
        };
      }

      if (!res.ok) {
        // En caso de estar en pruebas o ejecución interna sin servidor HTTP levantado, fallback a store
        const partidoStore = store.getPartidoPorId(partidoId);
        if (!partidoStore) {
          return { valido: false, mensaje: `El partido ${partidoId} no existe en la base de datos de Liga.` };
        }
        return this.evaluarPartido(partidoStore, torneoId);
      }

      const partido: Partido = await res.json();
      return this.evaluarPartido(partido, torneoId);
    } catch {
      // Fallback local resiliente en pruebas unitarias
      const partidoStore = store.getPartidoPorId(partidoId);
      if (!partidoStore) {
        return { valido: false, mensaje: `El partido ${partidoId} no existe en el Servicio de Liga.` };
      }
      return this.evaluarPartido(partidoStore, torneoId);
    }
  }

  private evaluarPartido(partido: Partido, torneoId?: string): ValidacionPartidoResponse {
    if (torneoId && partido.torneo_id !== torneoId) {
      return {
        valido: false,
        mensaje: `El partido no corresponde al torneo especificado (${torneoId}).`,
        partido,
      };
    }

    if (partido.estado === 'finalizado') {
      return {
        valido: false,
        mensaje: `El partido ya fue finalizado previamente y tiene resultado registrado.`,
        partido,
      };
    }

    if (partido.estado === 'cancelado') {
      return {
        valido: false,
        mensaje: `El partido se encuentra cancelado.`,
        partido,
      };
    }

    return {
      valido: true,
      mensaje: 'Partido verificado y apto para registro de resultado.',
      partido,
    };
  }

  /**
   * Cierre de Partido (Paso 2 del caso de uso inter-servicio):
   * API 2 notifica a API 1 para marcar el partido como finalizado y asignar ganador.
   */
  async marcarPartidoFinalizado(partidoId: string, equipoGanadorId?: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/partidos/${partidoId}`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: 'finalizado',
          equipo_ganador_id: equipoGanadorId || null,
        }),
      });

      if (!res.ok) {
        store.actualizarPartido(partidoId, {
          estado: 'finalizado',
          equipo_ganador_id: equipoGanadorId,
        });
        return true;
      }

      return true;
    } catch {
      store.actualizarPartido(partidoId, {
        estado: 'finalizado',
        equipo_ganador_id: equipoGanadorId,
      });
      return true;
    }
  }
}

/**
 * Cliente usado por API 1 (Liga) para comunicarse con API 2 (Resultados)
 */
export class ResultadosServiceClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_RESULTADOS_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  /**
   * Consulta de Clasificación:
   * Cuando en API 1 se pide la tabla de posiciones de un torneo,
   * API 1 consulta a API 2 por el ranking actualizado.
   */
  async obtenerPosiciones(torneoId: string): Promise<Posicion[]> {
    try {
      const url = `${this.baseUrl}/posiciones?torneo_id=${torneoId}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
      });

      if (!res.ok) {
        return store.getPosiciones(torneoId);
      }

      return await res.json();
    } catch {
      return store.getPosiciones(torneoId);
    }
  }
}

export const ligaClient = new LigaServiceClient();
export const resultadosClient = new ResultadosServiceClient();
