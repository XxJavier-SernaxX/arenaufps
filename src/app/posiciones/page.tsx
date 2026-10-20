'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  BarChart3, 
  Send, 
  Info, 
  RefreshCw,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Posicion, Torneo } from '@/types';

export default function PosicionesPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [selectedTorneoId, setSelectedTorneoId] = useState<string>('33333333-3333-3333-3333-333333333331');
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function cargarTorneos() {
      try {
        const res = await fetch('/api/v1/liga/torneos');
        const data = await res.json();
        if (Array.isArray(data)) setTorneos(data);
      } catch (err) {
        console.error(err);
      }
    }
    cargarTorneos();
  }, []);

  useEffect(() => {
    if (selectedTorneoId) {
      cargarPosiciones(selectedTorneoId);
    }
  }, [selectedTorneoId]);

  async function cargarPosiciones(torneoId: string) {
    setLoading(true);
    try {
      // Demostración de consulta recíproca: API 1 solicita a API 2 el ranking actualizado
      const res = await fetch(`/api/v1/liga/torneos/${torneoId}/posiciones`);
      const data = await res.json();
      if (data.posiciones && Array.isArray(data.posiciones)) {
        setPosiciones(data.posiciones);
      } else {
        // Fallback directo a endpoint de API 2
        const resDirect = await fetch(`/api/v1/posiciones?torneo_id=${torneoId}`);
        const dataDirect = await resDirect.json();
        if (Array.isArray(dataDirect)) setPosiciones(dataDirect);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    cargarPosiciones(selectedTorneoId);
  };

  const torneoActual = torneos.find((t) => t.id === selectedTorneoId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Servicio de Resultados y Clasificación (API 2)
          </div>
          <h1 className="text-3xl font-black text-white">Tabla de Posiciones Oficial</h1>
          <p className="text-gray-400 text-sm mt-1">
            Ranking calculado en tiempo real tras la validación y cierre de cada partido disputado.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-esport-card hover:bg-slate-800 border border-esport-border text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-ufps-400' : ''}`} />
            Actualizar
          </button>
          <Link
            href="/reportar"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white text-xs font-bold shadow-md shadow-ufps-600/30 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Reportar Partido
          </Link>
        </div>
      </div>

      {/* Selector de Torneo & Detalle */}
      <div className="bg-esport-card border border-esport-border rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold uppercase text-gray-400 whitespace-nowrap">
            Torneo:
          </label>
          <select
            value={selectedTorneoId}
            onChange={(e) => setSelectedTorneoId(e.target.value)}
            className="bg-black/60 border border-esport-border rounded-lg px-3 py-2 text-xs text-white focus:border-ufps-500 focus:outline-none w-full sm:w-auto"
          >
            {torneos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre} ({t.formato.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>Juego: <strong className="text-gray-200 capitalize">{torneoActual?.videojuego_id}</strong></span>
          <span>•</span>
          <span>Formato: <strong className="text-gray-200">Liguilla (3 pts victoria, 1 pt empate)</strong></span>
        </div>
      </div>

      {/* Nota de Integración SOA */}
      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 text-xs flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Interacción REST comprobable:</span> Cuando abres esta vista, la <strong>API 1 (Servicio de Liga)</strong> invoca internamente por HTTP a la <strong>API 2 (Servicio de Resultados)</strong> mediante el endpoint <code className="bg-black/50 px-1 py-0.5 rounded text-cyan-200">GET /api/v1/liga/torneos/:id/posiciones</code> para obtener el ranking oficial.
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="bg-esport-card border border-esport-border rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/50 text-xs uppercase tracking-wider text-gray-400 border-b border-esport-border">
              <tr>
                <th className="py-3.5 px-4">Pos</th>
                <th className="py-3.5 px-4">Equipo</th>
                <th className="py-3.5 px-3 text-center" title="Partidos Jugados">PJ</th>
                <th className="py-3.5 px-3 text-center text-emerald-400" title="Partidos Ganados">PG</th>
                <th className="py-3.5 px-3 text-center text-amber-400" title="Partidos Empatados">PE</th>
                <th className="py-3.5 px-3 text-center text-red-400" title="Partidos Perdidos">PP</th>
                <th className="py-3.5 px-3 text-center" title="Puntos a Favor (Rondas/Goles anotados)">GF</th>
                <th className="py-3.5 px-3 text-center" title="Puntos en Contra (Rondas/Goles recibidos)">GC</th>
                <th className="py-3.5 px-3 text-center" title="Diferencia de Puntos">DIF</th>
                <th className="py-3.5 px-4 text-center font-black text-white bg-ufps-950/30" title="Puntos Totales">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-esport-border/40">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-500">
                    Cargando tabla de posiciones...
                  </td>
                </tr>
              ) : posiciones.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-500">
                    No hay equipos con partidos registrados en este torneo.
                  </td>
                </tr>
              ) : (
                posiciones.map((pos) => {
                  const esPrimero = pos.posicion === 1;
                  return (
                    <tr 
                      key={pos.id} 
                      className={`hover:bg-slate-800/40 transition-colors ${
                        esPrimero ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-mono font-bold">
                        {esPrimero ? (
                          <span className="flex items-center gap-1.5 text-amber-400 font-black">
                            <Trophy className="w-4 h-4 fill-amber-400" />
                            1°
                          </span>
                        ) : (
                          <span className="text-gray-400">{pos.posicion}°</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            esPrimero ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-gray-300'
                          }`}>
                            {pos.equipo?.tag?.slice(0, 3) || 'EQ'}
                          </div>
                          <div>
                            <span className="font-bold text-gray-200 block">
                              {pos.equipo?.nombre || 'Equipo'}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              Tag: {pos.equipo?.tag} • {pos.equipo?.facultad || 'UFPS'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center font-mono text-gray-300 font-semibold">{pos.partidos_jugados}</td>
                      <td className="py-4 px-3 text-center font-mono text-emerald-400 font-semibold">{pos.ganados}</td>
                      <td className="py-4 px-3 text-center font-mono text-amber-400 font-semibold">{pos.empatados}</td>
                      <td className="py-4 px-3 text-center font-mono text-red-400 font-semibold">{pos.perdidos}</td>
                      <td className="py-4 px-3 text-center font-mono text-gray-400">{pos.puntos_favor}</td>
                      <td className="py-4 px-3 text-center font-mono text-gray-400">{pos.puntos_contra}</td>
                      <td className={`py-4 px-3 text-center font-mono font-bold ${
                        pos.diferencia > 0 ? 'text-emerald-400' : pos.diferencia < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {pos.diferencia > 0 ? `+${pos.diferencia}` : pos.diferencia}
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-black text-lg text-ufps-400 bg-ufps-950/20">
                        {pos.puntos}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reglas de Desempate y Puntuación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-400">
        <div className="p-4 rounded-xl bg-esport-card border border-esport-border space-y-1">
          <span className="font-bold text-white block">Victoria (PG)</span>
          <p>Otorga <strong>3 puntos</strong> al equipo ganador del partido validado.</p>
        </div>
        <div className="p-4 rounded-xl bg-esport-card border border-esport-border space-y-1">
          <span className="font-bold text-white block">Empate (PE)</span>
          <p>Otorga <strong>1 punto</strong> a cada escuadra en caso de empate reglamentario.</p>
        </div>
        <div className="p-4 rounded-xl bg-esport-card border border-esport-border space-y-1">
          <span className="font-bold text-white block">Criterio de Desempate</span>
          <p>Ordenado por <strong>Puntos Totales</strong>, luego <strong>Diferencia de Rondas (DIF)</strong> y <strong>Puntos a Favor (GF)</strong>.</p>
        </div>
      </div>
    </div>
  );
}
