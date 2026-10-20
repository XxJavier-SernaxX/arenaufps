'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Gamepad2, 
  Calendar, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Swords,
  ChevronRight,
  Flame
} from 'lucide-react';
import { Torneo, Partido, Posicion, Resultado } from '@/types';

export default function HomePage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [posiciones, setPosiciones] = useState<Posicion[]>([]);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resTorneos, resPartidos, resResultados] = await Promise.all([
          fetch('/api/v1/liga/torneos'),
          fetch('/api/v1/liga/torneos/33333333-3333-3333-3333-333333333331/partidos'),
          fetch('/api/v1/resultados?torneo_id=33333333-3333-3333-3333-333333333331'),
        ]);

        const torneosData = await resTorneos.json();
        const partidosData = await resPartidos.json();
        const resultadosData = await resResultados.json();

        setTorneos(Array.isArray(torneosData) ? torneosData : []);
        setPartidos(Array.isArray(partidosData) ? partidosData : []);
        setResultados(Array.isArray(resultadosData) ? resultadosData : []);

        // Consultar tabla de posiciones desde API 2
        const resPos = await fetch('/api/v1/posiciones?torneo_id=33333333-3333-3333-3333-333333333331');
        const posData = await resPos.json();
        setPosiciones(Array.isArray(posData) ? posData : []);
      } catch (err) {
        console.error('Error cargando datos de inicio:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const torneoActivo = torneos.find((t) => t.id === '33333333-3333-3333-3333-333333333331') || torneos[0];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-ufps-950/40 via-esport-card to-esport-dark border border-esport-border p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ufps-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufps-600/20 border border-ufps-500/30 text-ufps-400 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-ufps-500" />
            Liga Universitaria de e-Sports UFPS 2026
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Compite. Domina. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ufps-500 via-red-400 to-amber-400">
              Conquista la Arena.
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            La plataforma oficial para gestionar los torneos de videojuegos de la <strong>Universidad Francisco de Paula Santander</strong>. Construida bajo una <strong>Arquitectura Orientada a Servicios (SOA)</strong> con validación inter-servicio y clasificación en tiempo real.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/reportar"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-ufps-600 hover:bg-ufps-500 text-white font-bold text-sm shadow-lg shadow-ufps-600/30 transition-all hover:scale-105"
            >
              <Send className="w-4 h-4" />
              Reportar Resultado (Consola SOA)
            </Link>

            <Link
              href="/posiciones"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-esport-card hover:bg-slate-800 text-gray-200 border border-esport-border font-semibold text-sm transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Ver Clasificación
            </Link>

            <Link
              href="/arquitectura"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              Arquitectura SOA & Diagramas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ciclo Completo de la Actividad (Puntos 1 a 8) */}
      <section className="bg-esport-card/70 border border-esport-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-ufps-500" />
              Ciclo Completo Demostrable en la Nube
            </h2>
            <p className="text-xs text-gray-400">
              Validación y comunicación bidireccional entre API 1 (Servicio de Liga) y API 2 (Servicio de Resultados)
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
            SOA v1.0 • REST / JSON
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-black/40 border border-esport-border/80">
            <span className="text-ufps-500 font-bold block mb-1">Paso 1 & 2</span>
            <p className="font-semibold text-gray-200">Crear Torneo e Inscribir Equipos</p>
            <p className="text-gray-400 text-[11px] mt-0.5">API 1 registra equipos y valida cupo máximo.</p>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-esport-border/80">
            <span className="text-ufps-500 font-bold block mb-1">Paso 3</span>
            <p className="font-semibold text-gray-200">Programar Partidos</p>
            <p className="text-gray-400 text-[11px] mt-0.5">Generación de fixture en estado 'pendiente'.</p>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-esport-border/80">
            <span className="text-cyan-400 font-bold block mb-1">Paso 4 & 5</span>
            <p className="font-semibold text-gray-200">Reportar y Validar por HTTP</p>
            <p className="text-gray-400 text-[11px] mt-0.5">API 2 consulta a API 1 si el partido es válido.</p>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-esport-border/80">
            <span className="text-emerald-400 font-bold block mb-1">Paso 6, 7 & 8</span>
            <p className="font-semibold text-gray-200">Cierre y Clasificación</p>
            <p className="text-gray-400 text-[11px] mt-0.5">API 2 avisa cierre a API 1 y actualiza tabla.</p>
          </div>
        </div>
      </section>

      {/* Main Grid: Torneo Activo & Clasificación Rápida */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col (2 cols): Torneo y Partidos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Torneo Destacado */}
          {torneoActivo && (
            <div className="bg-esport-card border border-esport-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {torneoActivo.estado === 'en_curso' ? 'En Curso' : torneoActivo.estado}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {torneoActivo.formato === 'liguilla' ? 'Formato: Liguilla (Todos vs Todos)' : torneoActivo.formato}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white mb-2">{torneoActivo.nombre}</h2>
              <p className="text-gray-400 text-sm mb-4">{torneoActivo.descripcion}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 border-t border-esport-border/60 pt-4">
                <div>
                  <span className="text-gray-500 block">Juego:</span>
                  <span className="font-bold text-white capitalize">{torneoActivo.videojuego_id}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Equipos Inscritos:</span>
                  <span className="font-bold text-ufps-400">{torneoActivo.inscritos_count || 4} / {torneoActivo.max_equipos}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Premio:</span>
                  <span className="font-bold text-amber-400">{torneoActivo.premio || 'Trofeo Institucional'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Partidos Programados */}
          <div className="bg-esport-card border border-esport-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-ufps-500" />
                Calendario de Partidos (API 1: Servicio de Liga)
              </h3>
              <Link href="/partidos" className="text-xs text-ufps-400 hover:text-ufps-300 flex items-center gap-1 font-semibold">
                Ver todos <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500 py-4">Cargando enfrentamientos...</p>
            ) : partidos.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No hay partidos programados actualmente.</p>
            ) : (
              <div className="space-y-3">
                {partidos.map((partido) => {
                  const resultado = resultados.find((r) => r.partido_id === partido.id);
                  const esFinalizado = partido.estado === 'finalizado';

                  return (
                    <div
                      key={partido.id}
                      className="p-4 rounded-xl bg-black/40 border border-esport-border hover:border-ufps-600/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                        <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-gray-400">
                          Ronda {partido.ronda}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className={`font-bold text-sm ${partido.equipo_ganador_id === partido.equipo_local_id ? 'text-emerald-400' : 'text-white'}`}>
                            {partido.equipo_local?.nombre || 'Equipo Local'}
                          </span>
                          <span className="text-xs text-gray-500 font-bold">VS</span>
                          <span className={`font-bold text-sm ${partido.equipo_ganador_id === partido.equipo_visitante_id ? 'text-emerald-400' : 'text-white'}`}>
                            {partido.equipo_visitante?.nombre || 'Equipo Visitante'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        {esFinalizado && resultado ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base bg-ufps-950/80 text-white border border-ufps-600/40 px-3 py-1 rounded">
                              {resultado.marcador_local} - {resultado.marcador_visitante}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                              Finalizado
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                              Pendiente
                            </span>
                            <Link
                              href={`/reportar?partido_id=${partido.id}`}
                              className="text-xs bg-ufps-600 hover:bg-ufps-500 text-white px-3 py-1 rounded font-bold transition-colors"
                            >
                              Reportar
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Tabla de Posiciones Rápida */}
        <div className="space-y-6">
          <div className="bg-esport-card border border-esport-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Clasificación Oficial
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                API 2
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Puntos calculados automáticamente por el Servicio de Resultados (3 por victoria, 1 por empate).
            </p>

            {loading ? (
              <p className="text-sm text-gray-500 py-4">Cargando clasificación...</p>
            ) : posiciones.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No hay datos de clasificación aún.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] text-gray-400 uppercase bg-black/40 border-b border-esport-border">
                    <tr>
                      <th className="py-2 px-2">#</th>
                      <th className="py-2 px-2">Equipo</th>
                      <th className="py-2 px-2 text-center">PJ</th>
                      <th className="py-2 px-2 text-center">DIF</th>
                      <th className="py-2 px-2 text-center font-bold text-white">PTS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-esport-border/40">
                    {posiciones.map((pos) => (
                      <tr key={pos.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-2 font-mono font-bold">
                          {pos.posicion === 1 ? (
                            <span className="text-amber-400 flex items-center gap-0.5">
                              🥇 1
                            </span>
                          ) : (
                            <span className="text-gray-400">{pos.posicion}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="font-bold text-gray-200 block truncate max-w-[130px]">
                            {pos.equipo?.nombre || 'Equipo'}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            {pos.equipo?.tag || ''}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-gray-400">
                          {pos.partidos_jugados}
                        </td>
                        <td className={`py-2.5 px-2 text-center font-mono font-semibold ${pos.diferencia > 0 ? 'text-emerald-400' : pos.diferencia < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                          {pos.diferencia > 0 ? `+${pos.diferencia}` : pos.diferencia}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-black text-sm text-ufps-400">
                          {pos.puntos}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-esport-border flex justify-end">
              <Link href="/posiciones" className="text-xs text-ufps-400 hover:text-ufps-300 font-semibold flex items-center gap-1">
                Ver tabla completa con GF/GC <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-esport-card to-black border border-esport-border rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Accesos Rápidos
            </h4>
            <div className="space-y-2 text-xs">
              <Link
                href="/torneos"
                className="flex items-center justify-between p-2.5 rounded-lg bg-esport-dark/60 hover:bg-esport-dark border border-esport-border text-gray-300 hover:text-white transition-colors"
              >
                <span>Crear nuevo torneo</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              </Link>
              <Link
                href="/equipos"
                className="flex items-center justify-between p-2.5 rounded-lg bg-esport-dark/60 hover:bg-esport-dark border border-esport-border text-gray-300 hover:text-white transition-colors"
              >
                <span>Registrar equipo o jugador</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              </Link>
              <Link
                href="/arquitectura"
                className="flex items-center justify-between p-2.5 rounded-lg bg-esport-dark/60 hover:bg-esport-dark border border-esport-border text-gray-300 hover:text-white transition-colors"
              >
                <span>Inspeccionar contratos REST</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
