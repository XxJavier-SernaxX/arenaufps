'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Network, 
  Server, 
  Database, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Code2, 
  ShieldCheck, 
  Play,
  Terminal,
  ExternalLink
} from 'lucide-react';

export default function ArquitecturaPage() {
  const [testEndpoint, setTestEndpoint] = useState('/api/v1/liga/torneos');
  const [testMethod, setTestMethod] = useState('GET');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  const sampleEndpoints = [
    { label: 'API 1: Listar Videojuegos', url: '/api/v1/liga/videojuegos', method: 'GET' },
    { label: 'API 1: Listar Torneos', url: '/api/v1/liga/torneos', method: 'GET' },
    { label: 'API 1: Consultar Partido (Validación)', url: '/api/v1/liga/partidos/44444444-4444-4444-4444-444444444441', method: 'GET' },
    { label: 'API 1: Pedir Clasificación a API 2', url: '/api/v1/liga/torneos/33333333-3333-3333-3333-333333333331/posiciones', method: 'GET' },
    { label: 'API 2: Consultar Posiciones Oficiales', url: '/api/v1/posiciones?torneo_id=33333333-3333-3333-3333-333333333331', method: 'GET' },
    { label: 'API 2: Historial de Resultados', url: '/api/v1/resultados', method: 'GET' },
    { label: 'Contrato OpenAPI 3.0', url: '/api/v1/openapi.json', method: 'GET' },
  ];

  const handleExecuteTest = async (urlToTest = testEndpoint) => {
    setTestLoading(true);
    setTestResponse(null);
    try {
      const res = await fetch(urlToTest);
      const data = await res.json();
      setTestResponse({
        status: res.status,
        ok: res.ok,
        data,
      });
    } catch (err: any) {
      setTestResponse({ status: 500, ok: false, error: err.message });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ufps-600/20 border border-ufps-500/30 text-ufps-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Network className="w-3.5 h-3.5" />
          Documentación Académica & SOA
        </div>
        <h1 className="text-3xl font-black text-white">Arquitectura Orientada a Servicios (SOA)</h1>
        <p className="text-gray-400 text-sm mt-1 max-w-3xl">
          Estructura de ArenaUFPS inspirada en la separación de responsabilidades del proyecto de referencia docente 
          (<code className="text-gray-300">didierguerreros/coordinacion-emergencia</code>).
        </p>
      </div>

      {/* Diagrama Visual de Arquitectura (Idéntico al esquema de la actividad) */}
      <section className="bg-esport-card border border-esport-border rounded-2xl p-6 md:p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Network className="w-5 h-5 text-ufps-500" />
          Esquema de Arquitectura del Sistema
        </h2>
        <p className="text-xs text-gray-400 mb-8">
          Dos APIs independientes comunicadas entre sí por REST sobre HTTP y consumidas por la aplicación Web.
        </p>

        {/* Interactive Diagram Canvas */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top: Frontend Web */}
          <div className="mx-auto max-w-lg p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/10 text-center">
            <div className="flex items-center justify-center gap-2 text-white font-black text-lg mb-1">
              <Globe className="w-5 h-5 text-cyan-400" />
              Frontend Web (Next.js & Tailwind)
            </div>
            <p className="text-xs text-gray-300">
              Torneos, equipos, calendario, resultados y posiciones
            </p>
          </div>

          {/* Connectors Down */}
          <div className="flex justify-around text-xs text-gray-400 font-mono font-bold">
            <span className="flex items-center gap-1 text-cyan-400">
              ↓ REST
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              ↓ REST
            </span>
          </div>

          {/* Middle: API 1 <-> API 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* API 1 */}
            <div className="p-5 rounded-2xl bg-black/60 border-2 border-ufps-600/70 shadow-lg shadow-ufps-900/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-ufps-400 font-bold bg-ufps-950/60 px-2 py-0.5 rounded border border-ufps-600/30">
                  Microservicio 1 (Puerto 8001 / /api/v1/liga)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-ufps-500" />
                API 1: Servicio de Liga (Principal)
              </h3>
              <p className="text-xs text-gray-300">
                Gestiona videojuegos, jugadores, equipos, torneos, inscripciones y partidos programados.
              </p>
            </div>

            {/* Inter-Service Connection Badge */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
              <div className="bg-slate-900 border border-esport-border text-[11px] font-mono font-bold text-amber-400 px-3 py-1.5 rounded-full shadow-lg z-10 flex items-center gap-1">
                REST (valida y consulta) ⇄
              </div>
            </div>

            {/* API 2 */}
            <div className="p-5 rounded-2xl bg-black/60 border-2 border-amber-500/70 shadow-lg shadow-amber-900/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/30">
                  Microservicio 2 (Puerto 8002 / /api/v1/resultados)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-500" />
                API 2: Resultados y Clasif. (Complementario)
              </h3>
              <p className="text-xs text-gray-300">
                Valida resultados vía HTTP con API 1, calcula puntos y mantiene el ranking actualizado.
              </p>
            </div>
          </div>

          {/* Connectors Down to DB */}
          <div className="flex justify-around text-xs text-gray-400 font-mono font-bold">
            <span className="flex items-center gap-1 text-emerald-400">
              ↓ SQL
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              ↓ SQL
            </span>
          </div>

          {/* Bottom: Database */}
          <div className="mx-auto max-w-lg p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10 text-center">
            <div className="flex items-center justify-center gap-2 text-white font-black text-lg mb-1">
              <Database className="w-5 h-5 text-emerald-400" />
              Base de Datos en la Nube (Supabase PostgreSQL)
            </div>
            <p className="text-xs text-gray-300">
              Esquemas y tablas propios de cada servicio con políticas RLS
            </p>
          </div>
        </div>
      </section>

      {/* Las 3 Interacciones Obligatorias */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Las 3 Reglas de Comunicación Inter-Servicios SOA
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-esport-card border border-esport-border rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-ufps-600/20 text-ufps-400 font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-bold text-white text-sm">Validación de Partido</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Al llegar un resultado a <strong>API 2</strong>, consulta a la <strong>API 1</strong> mediante <code className="bg-black/50 text-gray-200 px-1 py-0.5 rounded">GET /api/v1/liga/partidos/:id</code> para certificar que el partido exista, esté pendiente y qué equipos participan. Si no es válido, lo rechaza.
            </p>
          </div>

          <div className="bg-esport-card border border-esport-border rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-bold text-white text-sm">Cierre de Enfrentamiento</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tras calcular los puntos, la <strong>API 2</strong> avisa a la <strong>API 1</strong> mediante <code className="bg-black/50 text-gray-200 px-1 py-0.5 rounded">PATCH /api/v1/liga/partidos/:id</code> para cambiar el estado a <strong className="text-white">'finalizado'</strong> y registrar al equipo ganador.
            </p>
          </div>

          <div className="bg-esport-card border border-esport-border rounded-xl p-5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-bold text-white text-sm">Consulta de Clasificación</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Cuando el usuario abre la tabla de posiciones en la aplicación, la <strong>API 1</strong> le solicita por REST a la <strong>API 2</strong> el ranking actualizado en vivo mediante <code className="bg-black/50 text-gray-200 px-1 py-0.5 rounded">GET /api/v1/posiciones</code>.
            </p>
          </div>
        </div>
      </section>

      {/* Explorador Interactivo de Endpoints (Swagger / Try-Out) */}
      <section className="bg-esport-card border border-esport-border rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              Explorador Interactivo de Endpoints REST
            </h2>
            <p className="text-xs text-gray-400">
              Prueba en tiempo real las respuestas de las APIs desacopladas.
            </p>
          </div>
          <a
            href="/api/v1/openapi.json"
            target="_blank"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono font-semibold"
          >
            Ver openapi.json <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Quick Buttons */}
        <div className="flex flex-wrap gap-2">
          {sampleEndpoints.map((ep, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTestEndpoint(ep.url);
                setTestMethod(ep.method);
                handleExecuteTest(ep.url);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 border ${
                testEndpoint === ep.url
                  ? 'bg-ufps-600 border-ufps-500 text-white font-bold'
                  : 'bg-black/40 border-esport-border text-gray-300 hover:border-gray-500'
              }`}
            >
              <span className="text-[10px] text-gray-400 font-bold">{ep.method}</span>
              <span>{ep.label}</span>
            </button>
          ))}
        </div>

        {/* Endpoint Input Bar */}
        <div className="flex items-center gap-2 bg-black/60 border border-esport-border rounded-xl p-2">
          <span className="px-3 py-1.5 bg-slate-800 text-cyan-400 font-mono text-xs font-bold rounded-lg">
            {testMethod}
          </span>
          <input
            type="text"
            value={testEndpoint}
            onChange={(e) => setTestEndpoint(e.target.value)}
            className="flex-1 bg-transparent text-xs font-mono text-white focus:outline-none"
          />
          <button
            onClick={() => handleExecuteTest(testEndpoint)}
            disabled={testLoading}
            className="px-4 py-2 rounded-lg bg-ufps-600 hover:bg-ufps-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {testLoading ? 'Consultando...' : 'Ejecutar'}
          </button>
        </div>

        {/* Response Viewer */}
        {testResponse && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">Respuesta HTTP:</span>
              <span className={`px-2 py-0.5 rounded font-bold ${
                testResponse.ok ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                Status {testResponse.status}
              </span>
            </div>
            <pre className="p-4 rounded-xl bg-black/80 border border-esport-border text-xs text-gray-200 font-mono overflow-x-auto max-h-96">
              {JSON.stringify(testResponse.data || testResponse.error, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
}
