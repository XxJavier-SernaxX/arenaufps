'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Plus, 
  Gamepad2, 
  GraduationCap, 
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Equipo, Jugador, Videojuego } from '@/types';

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [videojuegos, setVideojuegos] = useState<Videojuego[]>([]);
  const [loading, setLoading] = useState(true);

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState(false);

  // New Team form
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [tagEquipo, setTagEquipo] = useState('');
  const [capitanId, setCapitanId] = useState('');
  const [videojuegoId, setVideojuegoId] = useState('valorant');
  const [facultad, setFacultad] = useState('Facultad de Ingeniería');

  // New Player form
  const [nickname, setNickname] = useState('');
  const [nombreJugador, setNombreJugador] = useState('');
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [carrera, setCarrera] = useState('Ingeniería de Sistemas');

  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);
    try {
      const [resE, resJ, resV] = await Promise.all([
        fetch('/api/v1/liga/equipos'),
        fetch('/api/v1/liga/jugadores'),
        fetch('/api/v1/liga/videojuegos'),
      ]);
      const dataE = await resE.json();
      const dataJ = await resJ.json();
      const dataV = await resV.json();

      if (Array.isArray(dataE)) setEquipos(dataE);
      if (Array.isArray(dataJ)) setJugadores(dataJ);
      if (Array.isArray(dataV)) setVideojuegos(dataV);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCrearEquipo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/v1/liga/equipos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombreEquipo,
          tag: tagEquipo.toUpperCase(),
          capitan_id: capitanId || jugadores[0]?.id,
          videojuego_id: videojuegoId,
          facultad,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al crear equipo');

      setMessage({ text: 'Equipo registrado con éxito en API 1 (Servicio de Liga)' });
      setShowTeamModal(false);
      setNombreEquipo('');
      setTagEquipo('');
      cargarDatos();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCrearJugador = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/v1/liga/jugadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          nombre: nombreJugador,
          correo,
          codigo_estudiantil: codigo,
          carrera,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al crear jugador');

      setMessage({ text: 'Jugador registrado con éxito en API 1' });
      setShowPlayerModal(false);
      setNickname('');
      setNombreJugador('');
      setCorreo('');
      cargarDatos();
    } catch (err: any) {
      setMessage({ text: err.message, error: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufps-600/20 border border-ufps-500/30 text-ufps-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            API 1: Servicio de Liga
          </div>
          <h1 className="text-3xl font-black text-white">Equipos y Jugadores UFPS</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestión de plantillas, capitanes y estudiantes competidores de las diferentes facultades.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPlayerModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-esport-card hover:bg-slate-800 border border-esport-border text-xs font-semibold text-gray-200 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
            Nuevo Jugador
          </button>
          <button
            onClick={() => setShowTeamModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white text-xs font-bold shadow-md shadow-ufps-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear Equipo
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
          message.error ? 'bg-red-950/40 border-red-500/50 text-red-300' : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
        }`}>
          {message.error ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Sección Equipos */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-ufps-500" />
          Escuadras Registradas ({equipos.length})
        </h2>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando escuadras...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {equipos.map((eq) => (
              <div
                key={eq.id}
                className="bg-esport-card border border-esport-border hover:border-ufps-600/40 rounded-xl p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-ufps-400 bg-ufps-950/40 border border-ufps-600/30 px-2 py-0.5 rounded">
                    {eq.tag}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400 capitalize">
                    {eq.videojuego_id}
                  </span>
                </div>

                <h3 className="font-bold text-base text-white">{eq.nombre}</h3>
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                  {eq.facultad}
                </p>

                <div className="pt-2 border-t border-esport-border/60 text-xs text-gray-400">
                  <span className="text-[10px] uppercase text-gray-500 block">Capitán:</span>
                  <span className="font-semibold text-gray-200">
                    {eq.capitan?.nickname || 'Por asignar'} ({eq.capitan?.nombre?.split(' ')[0] || ''})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección Jugadores */}
      <div className="space-y-4 pt-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Directorio de Jugadores Estudiantiles ({jugadores.length})
        </h2>

        <div className="bg-esport-card border border-esport-border rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/40 text-gray-400 uppercase text-[11px] border-b border-esport-border">
                <tr>
                  <th className="py-3 px-4">Nickname</th>
                  <th className="py-3 px-4">Nombre Completo</th>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Carrera / Programa</th>
                  <th className="py-3 px-4">Correo Institucional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-esport-border/40">
                {jugadores.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-ufps-400 font-mono">
                      {j.nickname}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-200">{j.nombre}</td>
                    <td className="py-3 px-4 font-mono text-gray-400">{j.codigo_estudiantil || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-300">{j.carrera}</td>
                    <td className="py-3 px-4 font-mono text-gray-400 flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-gray-500" />
                      {j.correo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Crear Equipo */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-esport-card border border-esport-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-ufps-500" />
              Crear Nuevo Equipo (API 1: Liga)
            </h3>

            <form onSubmit={handleCrearEquipo} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Nombre del Equipo</label>
                <input
                  type="text"
                  value={nombreEquipo}
                  onChange={(e) => setNombreEquipo(e.target.value)}
                  placeholder="Ej: Mecánica e-Sports"
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">TAG (Sigla)</label>
                  <input
                    type="text"
                    maxLength={8}
                    value={tagEquipo}
                    onChange={(e) => setTagEquipo(e.target.value.toUpperCase())}
                    placeholder="MECA"
                    className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white uppercase font-mono focus:border-ufps-500 focus:outline-none"
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
                      <option key={v.id} value={v.id}>{v.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Capitán</label>
                <select
                  value={capitanId}
                  onChange={(e) => setCapitanId(e.target.value)}
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                >
                  <option value="">-- Selecciona un jugador --</option>
                  {jugadores.map((j) => (
                    <option key={j.id} value={j.id}>{j.nickname} ({j.nombre})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Facultad</label>
                <input
                  type="text"
                  value={facultad}
                  onChange={(e) => setFacultad(e.target.value)}
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-gray-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white font-bold"
                >
                  {submitting ? 'Creando...' : 'Crear Equipo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Crear Jugador */}
      {showPlayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-esport-card border border-esport-border rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-cyan-400" />
              Registrar Jugador UFPS
            </h3>

            <form onSubmit={handleCrearJugador} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Nickname (GamerTag)</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Ej: PhantomSniper"
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white font-mono focus:border-ufps-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Nombre Completo</label>
                <input
                  type="text"
                  value={nombreJugador}
                  onChange={(e) => setNombreJugador(e.target.value)}
                  placeholder="Ej: Daniel Rodríguez"
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Código Estudiantil</label>
                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="1152099"
                    className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white font-mono focus:border-ufps-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1 font-semibold">Carrera</label>
                  <input
                    type="text"
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                    className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Correo Institucional</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="estudiante@ufps.edu.co"
                  className="w-full bg-black/60 border border-esport-border rounded-lg p-2.5 text-white focus:border-ufps-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPlayerModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-gray-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white font-bold"
                >
                  {submitting ? 'Guardando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
