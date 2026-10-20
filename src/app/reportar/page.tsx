'use client';

import React, { useEffect, useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Network, 
  ArrowRight, 
  Server, 
  Trophy, 
  RotateCcw,
  ShieldAlert
} from 'lucide-react';
import { Partido, Posicion } from '@/types';

export default function ReportarResultadoPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [selectedPartidoId, setSelectedPartidoId] = useState<string>('');
  const [marcadorLocal, setMarcadorLocal] = useState<number>(13);
  const [marcadorVisitante, setMarcadorVisitante] = useState<number>(7);
  const [notas, setNotas] = useState<string>('Partida disputada según reglamento oficial de la liga UFPS');

  const [loading, setLoading] = useState(false);
  const [responseLog, setResponseLog] = useState<any>(null);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [stepActive, setStepActive] = useState<number>(0);
  const [posicionesNuevas, setPosicionesNuevas] = useState<Posicion[]>([]);

  useEffect(() => {
    cargarPartidos();
  }, []);

  async function cargarPartidos() {
    try {
      const res = await fetch('/api/v1/liga/torneos/33333333-3333-3333-3333-333333333331/partidos');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPartidos(data);
        // Pre-seleccionar el primer partido pendiente si existe
        const primerPendiente = data.find((p) => p.estado === 'pendiente');
        if (primerPendiente) {
          setSelectedPartidoId(primerPendiente.id);
        } else if (data.length > 0) {
          setSelectedPartidoId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error cargando partidos:', err);
    }
  }

  const partidoSeleccionado = partidos.find((p) => p.id === selectedPartidoId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartidoId) {
      alert('Seleccione un partido');
      return;
    }

    setLoading(true);
    setErrorLog(null);
    setResponseLog(null);
    setStepActive(1);

    // Animación pedagógica del flujo SOA paso a paso
    await new Promise((r) => setTimeout(r, 400));
    setStepActive(2);

    await new Promise((r) => setTimeout(r, 400));
    setStepActive(3);

    try {
      const res = await fetch('/api/v1/resultados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partido_id: selectedPartidoId,
          torneo_id: partidoSeleccionado?.torneo_id || '33333333-3333-3333-3333-333333333331',
          marcador_local: Number(marcadorLocal),
          marcador_visitante: Number(marcadorVisitante),
          notas,
        }),
      });

      setStepActive(4);
      await new Promise((r) => setTimeout(r, 300));
      setStepActive(5);

      const json = await res.json();

      if (!res.ok) {
        setErrorLog(json.motivo || json.error || 'Error al validar el resultado');
        setLoading(false);
        return;
      }

      setStepActive(6);
      setResponseLog(json);
      if (json.posiciones_actualizadas) {
        setPosicionesNuevas(json.posiciones_actualizadas);
      }

      // Recargar lista de partidos
      cargarPartidos();
    } catch (err: any) {
      setErrorLog(err.message || 'Error de red en la comunicación con API 2');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufps-600/20 border border-ufps-500/30 text-ufps-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Network className="w-3.5 h-3.5" />
          Caso de Uso Principal SOA: Validación y Cierre Inter-Servicios
        </div>
        <h1 className="text-3xl font-black text-white">Reportar Resultado de Partido</h1>
        <p className="text-gray-400 text-sm mt-1">
          La API 2 (Servicio de Resultados) recibe el marcador, consulta vía HTTP REST a la API 1 (Servicio de Liga) para verificar que el partido exista y esté pendiente, guarda el resultado, notifica el cierre a la API 1 y actualiza la clasificación.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario de Reporte (5 cols) */}
        <div className="lg:col-span-5 bg-esport-card border border-esport-border rounded-xl p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white border-b border-esport-border pb-3 flex items-center justify-between">
            <span>Formulario de Árbitro</span>
            <span className="text-xs font-mono text-cyan-400">REST POST</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Selección de Partido */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5">
                Seleccionar Partido (API 1: Liga)
              </label>
              <select
                value={selectedPartidoId}
                onChange={(e) => setSelectedPartidoId(e.target.value)}
                className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-xs text-white focus:border-ufps-500 focus:outline-none"
              >
                {partidos.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.estado.toUpperCase()}] {p.equipo_local?.nombre || 'Local'} vs {p.equipo_visitante?.nombre || 'Visitante'} (Ronda {p.ronda})
                  </option>
                ))}
              </select>
            </div>

            {/* Tarjeta del Partido Seleccionado */}
            {partidoSeleccionado && (
              <div className="p-3.5 rounded-lg bg-black/40 border border-esport-border/60 text-xs space-y-2">
                <div className="flex justify-between items-center text-gray-400 text-[11px]">
                  <span>ID: <code className="text-gray-300 font-mono">{partidoSeleccionado.id.slice(0, 13)}...</code></span>
                  <span className={`px-2 py-0.5 rounded font-bold ${partidoSeleccionado.estado === 'pendiente' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                    {partidoSeleccionado.estado}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold text-sm text-gray-200">
                  <span className="truncate max-w-[130px]">{partidoSeleccionado.equipo_local?.nombre}</span>
                  <span className="text-gray-500 text-xs">VS</span>
                  <span className="truncate max-w-[130px] text-right">{partidoSeleccionado.equipo_visitante?.nombre}</span>
                </div>
              </div>
            )}

            {/* Marcadores */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Marcador Local
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={marcadorLocal}
                  onChange={(e) => setMarcadorLocal(parseInt(e.target.value) || 0)}
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-3 text-center text-xl font-mono font-black text-white focus:border-ufps-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-gray-500 block text-center mt-1 truncate">
                  {partidoSeleccionado?.equipo_local?.tag || 'Local'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Marcador Visitante
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={marcadorVisitante}
                  onChange={(e) => setMarcadorVisitante(parseInt(e.target.value) || 0)}
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-3 text-center text-xl font-mono font-black text-white focus:border-ufps-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-gray-500 block text-center mt-1 truncate">
                  {partidoSeleccionado?.equipo_visitante?.tag || 'Visitante'}
                </span>
              </div>
            </div>

            {/* Notas opcionales */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">
                Observaciones del Encuentro
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={2}
                className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-xs text-white focus:border-ufps-500 focus:outline-none"
              />
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-ufps-600 hover:bg-ufps-500 text-white font-bold text-sm shadow-lg shadow-ufps-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ejecutando Validación SOA...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Reportar y Validar Resultado (API 2)
                </>
              )}
            </button>
          </form>
        </div>

        {/* Visualizador de Secuencia SOA en Vivo (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-esport-card border border-esport-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              Traza de Comunicación Inter-Servicios (SOA Live)
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Muestra la interacción real HTTP entre el Frontend, la API 2 (Resultados) y la API 1 (Liga).
            </p>

            {/* Timeline Steps */}
            <div className="space-y-3">
              {[
                {
                  step: 1,
                  actor: 'Web ➔ API 2',
                  desc: 'Petición POST /api/v1/resultados con el marcador',
                  route: 'POST /api/v1/resultados',
                },
                {
                  step: 2,
                  actor: 'API 2 ➔ API 1',
                  desc: 'Consulta REST HTTP para validar que el partido existe y está pendiente',
                  route: 'GET /api/v1/liga/partidos/:id',
                },
                {
                  step: 3,
                  actor: 'API 1',
                  desc: 'Verificación de estado: ¿Existe? ¿Torneo correcto? ¿Estado pendiente?',
                  route: 'Validación Lógica en Liga',
                },
                {
                  step: 4,
                  actor: 'API 2',
                  desc: 'Persistencia del resultado en la tabla resultados',
                  route: 'INSERT INTO resultados',
                },
                {
                  step: 5,
                  actor: 'API 2 ➔ API 1',
                  desc: 'Notificación HTTP para marcar el partido como finalizado',
                  route: 'PATCH /api/v1/liga/partidos/:id { estado: "finalizado" }',
                },
                {
                  step: 6,
                  actor: 'API 2',
                  desc: 'Cómputo y actualización de la tabla de posiciones (3 pts victoria, 1 empate)',
                  route: 'RECALCULAR posiciones',
                },
              ].map((item) => {
                const isPassed = stepActive >= item.step;
                const isCurrent = stepActive === item.step;

                return (
                  <div
                    key={item.step}
                    className={`p-3 rounded-lg border text-xs transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-ufps-950/40 border-ufps-500 text-white shadow-md'
                        : isPassed
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-gray-200'
                        : 'bg-black/30 border-esport-border/60 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[11px] font-bold ${
                          isPassed
                            ? 'bg-emerald-500 text-black'
                            : 'bg-slate-800 text-gray-400'
                        }`}
                      >
                        {isPassed ? '✓' : item.step}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-300">{item.actor}:</span>
                          <span className="font-mono text-[10px] text-gray-400 bg-black/40 px-1.5 py-0.5 rounded">
                            {item.route}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    {isCurrent && (
                      <Loader2 className="w-4 h-4 text-ufps-400 animate-spin shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Error Message */}
            {errorLog && (
              <div className="mt-4 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Rechazo de Validación SOA:</span>
                  <p>{errorLog}</p>
                  <p className="text-[11px] text-red-400/80 mt-1">
                    Esto demuestra que la API 2 no permite asentar resultados sin la debida certificación de la API 1.
                  </p>
                </div>
              </div>
            )}

            {/* Success Message & Response Payload */}
            {responseLog && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{responseLog.mensaje}</span>
                </div>
                <div className="text-[11px] text-gray-300 bg-black/60 p-2.5 rounded font-mono overflow-x-auto">
                  <pre>{JSON.stringify(responseLog.comunicacion_soa, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Tabla de Posiciones Actualizada tras el reporte */}
          {posicionesNuevas.length > 0 && (
            <div className="bg-esport-card border border-emerald-500/30 rounded-xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Nueva Tabla de Posiciones (Recalculada en Tiempo Real por API 2)
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">Actualizado</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-gray-400 uppercase bg-black/40 border-b border-esport-border">
                    <tr>
                      <th className="py-2 px-2">#</th>
                      <th className="py-2 px-2">Equipo</th>
                      <th className="py-2 px-2 text-center">PJ</th>
                      <th className="py-2 px-2 text-center">PG</th>
                      <th className="py-2 px-2 text-center">PE</th>
                      <th className="py-2 px-2 text-center">PP</th>
                      <th className="py-2 px-2 text-center">GF</th>
                      <th className="py-2 px-2 text-center">GC</th>
                      <th className="py-2 px-2 text-center">DIF</th>
                      <th className="py-2 px-2 text-center font-bold text-white">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-esport-border/40">
                    {posicionesNuevas.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/30">
                        <td className="py-2 px-2 font-mono font-bold text-amber-400">#{p.posicion}</td>
                        <td className="py-2 px-2 font-bold text-white">{p.equipo?.nombre}</td>
                        <td className="py-2 px-2 text-center font-mono">{p.partidos_jugados}</td>
                        <td className="py-2 px-2 text-center font-mono text-emerald-400">{p.ganados}</td>
                        <td className="py-2 px-2 text-center font-mono">{p.empatados}</td>
                        <td className="py-2 px-2 text-center font-mono text-red-400">{p.perdidos}</td>
                        <td className="py-2 px-2 text-center font-mono">{p.puntos_favor}</td>
                        <td className="py-2 px-2 text-center font-mono">{p.puntos_contra}</td>
                        <td className="py-2 px-2 text-center font-mono font-semibold">{p.diferencia > 0 ? `+${p.diferencia}` : p.diferencia}</td>
                        <td className="py-2 px-2 text-center font-mono font-black text-sm text-ufps-400">{p.puntos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
