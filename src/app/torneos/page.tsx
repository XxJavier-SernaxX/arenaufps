'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Gamepad2, 
  Plus, 
  Users, 
  Calendar, 
  Trophy, 
  Sparkles,
  Shuffle,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Torneo, Equipo, Videojuego } from '@/types';

export default function TorneosPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [videojuegos, setVideojuegos] = useState<Videojuego[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInscribeModal, setShowInscribeModal] = useState(false);
  const [selectedTorneoId, setSelectedTorneoId] = useState('');
  const [selectedEquipoId, setSelectedEquipoId] = useState('');

  // New Tournament form
  const [nombre, setNombre] = useState('');
  const [videojuegoId, setVideojuegoId] = useState('valorant');
  const [maxEquipos, setMaxEquipos] = useState(4);
  const [premio, setPremio] = useState('$1.000.000 COP');
  const [descripcion, setDescripcion] = useState('');

  const [actionMessage, setActionMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);
    try {
      const [resT, resV, resE] = await Promise.all([
        fetch('/api/v1/liga/torneos'),
        fetch('/api/v1/liga/videojuegos'),
        fetch('/api/v1/liga/equipos'),
      ]);
      const dataT = await resT.json();
      const dataV = await resV.json();
      const dataE = await resE.json();

      if (Array.isArray(dataT)) setTorneos(dataT);
      if (Array.isArray(dataV)) setVideojuegos(dataV);
      if (Array.isArray(dataE)) setEquipos(dataE);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateTorneo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setActionMessage(null);

    try {
      const res = await fetch('/api/v1/liga/torneos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          videojuego_id: videojuegoId,
          descripcion,
          formato: 'liguilla',
          estado: 'abierto',
          max_equipos: Number(maxEquipos),
          fecha_inicio: new Date().toISOString(),
          premio,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al crear torneo');

      setActionMessage({ text: 'Torneo creado con éxito en API 1 (Servicio de Liga)' });
      setShowCreateModal(false);
      setNombre('');
      cargarDatos();
    } catch (err: any) {
      setActionMessage({ text: err.message, error: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInscribirEquipo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTorneoId || !selectedEquipoId) return;

    setSubmitting(true);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/v1/liga/torneos/${selectedTorneoId}/inscripciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipo_id: selectedEquipoId }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al inscribir equipo');

      setActionMessage({ text: 'Equipo inscrito con éxito en el torneo' });
      setShowInscribeModal(false);
      cargarDatos();
    } catch (err: any) {
      setActionMessage({ text: err.message, error: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerarFixture = async (torneoId: string) => {
    if (!confirm('¿Deseas generar los enfrentamientos todos contra todos (liguilla) para los equipos inscritos?')) return;
    setSubmitting(true);
    setActionMessage(null);

    try {
      const res = await fetch(`/api/v1/liga/torneos/${torneoId}/generar-fixture`, {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al generar fixture');

      setActionMessage({ text: json.mensaje });
      cargarDatos();
    } catch (err: any) {
      setActionMessage({ text: err.message, error: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufps-600/20 border border-ufps-500/30 text-ufps-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            API 1: Servicio de Liga (Principal)
          </div>
          <h1 className="text-3xl font-black text-white">Torneos Universitarios</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestión del ciclo de vida de competiciones, inscripciones de equipos y generación de calendarios de juego.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInscribeModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-esport-card hover:bg-slate-800 border border-esport-border text-xs font-semibold text-gray-200 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            Inscribir Equipo
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white text-xs font-bold shadow-md shadow-ufps-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Torneo
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMessage && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
          actionMessage.error 
            ? 'bg-red-950/40 border-red-500/50 text-red-300' 
            : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
        }`}>
          {actionMessage.error ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Grid de Torneos */}
      {loading ? (
        <div className="p-12 text-center text-gray-500">Cargando torneos universitarios...</div>
      ) : torneos.length === 0 ? (
        <div className="p-12 text-center text-gray-500">No hay torneos registrados. ¡Crea el primero!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {torneos.map((t) => (
            <div
              key={t.id}
              className="bg-esport-card border border-esport-border hover:border-ufps-600/40 rounded-xl p-6 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    t.estado === 'en_curso'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {t.estado === 'en_curso' ? 'En Curso' : t.estado}
                  </span>
                  <span className="text-xs text-gray-400 font-mono capitalize">
                    {t.videojuego_id}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{t.nombre}</h3>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">
                  {t.descripcion || 'Torneo de videojuegos competitivos de la Universidad Francisco de Paula Santander.'}
                </p>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-black/40 border border-esport-border/60 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Inscritos</span>
                    <span className="font-bold text-ufps-400">{t.inscritos_count || 0} / {t.max_equipos}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Formato</span>
                    <span className="font-bold text-gray-200 capitalize">{t.formato}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase">Premio</span>
                    <span className="font-bold text-amber-400 truncate block">{t.premio || 'Trofeo'}</span>
                  </div>
                </div>
              </div>

              {/* Botones de acción del Torneo */}
              <div className="pt-2 border-t border-esport-border/60 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleGenerarFixture(t.id)}
                  disabled={submitting}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  title="Generar fixture automático de liguilla"
                >
                  <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                  Generar Fixture
                </button>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/partidos?torneo_id=${t.id}`}
                    className="px-3 py-2 rounded-lg bg-esport-dark hover:bg-black border border-esport-border text-xs font-semibold text-gray-300 hover:text-white transition-colors"
                  >
                    Ver Partidos
                  </Link>
                  <Link
                    href={`/posiciones?torneo_id=${t.id}`}
                    className="px-3 py-2 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white text-xs font-bold transition-colors"
                  >
                    Clasificación
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Crear Torneo */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-esport-card border border-esport-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-ufps-500" />
              Crear Nuevo Torneo (API 1: Liga)
            </h3>

            <form onSubmit={handleCreateTorneo} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Nombre del Torneo</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Copa Relámpago UFPS"
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Videojuego</label>
                <select
                  value={videojuegoId}
                  onChange={(e) => setVideojuegoId(e.target.value)}
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                >
                  {videojuegos.map((v) => (
                    <option key={v.id} value={v.id}>{v.nombre} ({v.genero})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Máx Equipos</label>
                  <input
                    type="number"
                    min="2"
                    max="16"
                    value={maxEquipos}
                    onChange={(e) => setMaxEquipos(Number(e.target.value))}
                    className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Premio</label>
                  <input
                    type="text"
                    value={premio}
                    onChange={(e) => setPremio(e.target.value)}
                    className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={2}
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                  placeholder="Detalles sobre el reglamento y modalidades..."
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-gray-300 font-semibold hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white font-bold"
                >
                  {submitting ? 'Creando...' : 'Crear Torneo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Inscribir Equipo */}
      {showInscribeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-esport-card border border-esport-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Inscribir Equipo a Torneo
            </h3>

            <form onSubmit={handleInscribirEquipo} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Seleccionar Torneo</label>
                <select
                  value={selectedTorneoId}
                  onChange={(e) => setSelectedTorneoId(e.target.value)}
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                  required
                >
                  <option value="">-- Elige un torneo --</option>
                  {torneos.map((t) => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Seleccionar Equipo</label>
                <select
                  value={selectedEquipoId}
                  onChange={(e) => setSelectedEquipoId(e.target.value)}
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                  required
                >
                  <option value="">-- Elige un equipo --</option>
                  {equipos.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.nombre} ({eq.tag})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInscribeModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-gray-300 font-semibold hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white font-bold"
                >
                  {submitting ? 'Inscribiendo...' : 'Confirmar Inscripción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
