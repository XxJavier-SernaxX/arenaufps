'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Send, 
  Plus, 
  Clock, 
  Trophy, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Partido, Torneo, Equipo, Resultado } from '@/types';

export default function PartidosPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterTorneoId, setFilterTorneoId] = useState('33333333-3333-3333-3333-333333333331');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  // Modal Programar Partido
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [equipoLocalId, setEquipoLocalId] = useState('');
  const [equipoVisitanteId, setEquipoVisitanteId] = useState('');
  const [ronda, setRonda] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [filterTorneoId]);

  async function cargarDatos() {
    setLoading(true);
    try {
      const [resP, resT, resE, resR] = await Promise.all([
        fetch(`/api/v1/liga/torneos/${filterTorneoId}/partidos`),
        fetch('/api/v1/liga/torneos'),
        fetch('/api/v1/liga/equipos'),
        fetch(`/api/v1/resultados?torneo_id=${filterTorneoId}`),
      ]);

      const dataP = await resP.json();
      const dataT = await resT.json();
      const dataE = await resE.json();
      const dataR = await resR.json();

      if (Array.isArray(dataP)) setPartidos(dataP);
      if (Array.isArray(dataT)) setTorneos(dataT);
      if (Array.isArray(dataE)) setEquipos(dataE);
      if (Array.isArray(dataR)) setResultados(dataR);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleProgramarPartido = async (e: React.FormEvent) => {
    e.preventDefault();
    if (equipoLocalId === equipoVisitanteId) {
      setMessage({ text: 'Los equipos deben ser distintos', error: true });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/v1/liga/torneos/${filterTorneoId}/partidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipo_local_id: equipoLocalId,
          equipo_visitante_id: equipoVisitanteId,
          ronda: Number(ronda),
          fecha_programada: new Date(Date.now() + 86400000 * 2).toISOString(),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al programar partido');

      setMessage({ text: 'Partido programado exitosamente en API 1 (Servicio de Liga)' });
      setShowScheduleModal(false);
      cargarDatos();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setSubmitting(false);
    }
  };

  const partidosFiltrados = partidos.filter((p) => {
    if (filterStatus === 'todos') return true;
    return p.estado === filterStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufps-600/20 border border-ufps-500/30 text-ufps-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5" />
            API 1: Servicio de Liga
          </div>
          <h1 className="text-3xl font-black text-white">Calendario de Partidos</h1>
          <p className="text-gray-400 text-sm mt-1">
            Programación de encuentros universitarios, estados de juego y registro de marcadores oficiales.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white text-xs font-bold shadow-md shadow-ufps-600/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Programar Partido
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
          message.error ? 'bg-red-950/40 border-red-500/50 text-red-300' : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
        }`}>
          {message.error ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-esport-card border border-esport-border rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold uppercase text-gray-400 whitespace-nowrap">Torneo:</label>
          <select
            value={filterTorneoId}
            onChange={(e) => setFilterTorneoId(e.target.value)}
            className="bg-black/60 border border-esport-border rounded-lg px-3 py-2 text-xs text-white focus:border-ufps-500 focus:outline-none w-full md:w-auto"
          >
            {torneos.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Estado:
          </span>
          <div className="flex bg-black/40 border border-esport-border rounded-lg p-1 text-xs">
            {['todos', 'pendiente', 'finalizado'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                  filterStatus === st ? 'bg-ufps-600 text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Partidos */}
      {loading ? (
        <div className="p-12 text-center text-gray-500">Cargando partidos...</div>
      ) : partidosFiltrados.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-esport-card rounded-xl border border-esport-border">
          No hay partidos en estado <strong className="capitalize">{filterStatus}</strong> para este torneo.
        </div>
      ) : (
        <div className="space-y-4">
          {partidosFiltrados.map((partido) => {
            const resultado = resultados.find((r) => r.partido_id === partido.id);
            const esFinalizado = partido.estado === 'finalizado';

            return (
              <div
                key={partido.id}
                className="bg-esport-card border border-esport-border hover:border-ufps-600/40 rounded-xl p-5 shadow-lg transition-all flex flex-col md:flex-row items-center justify-between gap-6"
              >
                {/* Info & Ronda */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-xl bg-black/60 border border-esport-border flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Ronda</span>
                    <span className="font-mono font-black text-white text-base leading-none">{partido.ronda}</span>
                  </div>

                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-block mb-1 ${
                      esFinalizado 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {partido.estado}
                    </span>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 font-mono">
                      <Clock className="w-3 h-3 text-gray-500" />
                      {new Date(partido.fecha_programada).toLocaleDateString('es-CO', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* Equipos & Enfrentamiento */}
                <div className="flex items-center justify-center gap-6 w-full md:w-auto">
                  {/* Local */}
                  <div className="text-right flex-1 md:w-48">
                    <span className={`font-bold text-base block truncate ${
                      partido.equipo_ganador_id === partido.equipo_local_id ? 'text-emerald-400 font-black' : 'text-white'
                    }`}>
                      {partido.equipo_local?.nombre || 'Local'}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {partido.equipo_local?.tag || ''}
                    </span>
                  </div>

                  {/* Marcador o VS */}
                  {esFinalizado && resultado ? (
                    <div className="px-4 py-2 rounded-xl bg-black/80 border border-ufps-600/40 text-center shrink-0">
                      <div className="font-mono font-black text-2xl text-white tracking-widest">
                        {resultado.marcador_local} - {resultado.marcador_visitante}
                      </div>
                      <span className="text-[10px] text-gray-500 block uppercase">Final</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-lg bg-black/40 border border-esport-border text-center shrink-0 font-bold text-xs text-ufps-400 font-mono">
                      VS
                    </div>
                  )}

                  {/* Visitante */}
                  <div className="text-left flex-1 md:w-48">
                    <span className={`font-bold text-base block truncate ${
                      partido.equipo_ganador_id === partido.equipo_visitante_id ? 'text-emerald-400 font-black' : 'text-white'
                    }`}>
                      {partido.equipo_visitante?.nombre || 'Visitante'}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {partido.equipo_visitante?.tag || ''}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {!esFinalizado ? (
                    <Link
                      href={`/reportar?partido_id=${partido.id}`}
                      className="px-4 py-2 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white font-bold text-xs shadow-md shadow-ufps-600/30 transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Reportar Resultado
                    </Link>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Validado por API 2
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Programar Partido */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-esport-card border border-esport-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-ufps-500" />
              Programar Enfrentamiento (API 1: Liga)
            </h3>

            <form onSubmit={handleProgramarPartido} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Equipo Local</label>
                <select
                  value={equipoLocalId}
                  onChange={(e) => setEquipoLocalId(e.target.value)}
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                  required
                >
                  <option value="">-- Elige Equipo Local --</option>
                  {equipos.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre} ({e.tag})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Equipo Visitante</label>
                <select
                  value={equipoVisitanteId}
                  onChange={(e) => setEquipoVisitanteId(e.target.value)}
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                  required
                >
                  <option value="">-- Elige Equipo Visitante --</option>
                  {equipos.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre} ({e.tag})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Número de Ronda</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={ronda}
                  onChange={(e) => setRonda(Number(e.target.value))}
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-gray-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white font-bold"
                >
                  {submitting ? 'Programando...' : 'Programar Partido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
