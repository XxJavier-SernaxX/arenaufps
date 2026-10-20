import React from 'react';
import Link from 'next/link';
import { Trophy, Github, Network, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-esport-border bg-black/60 text-gray-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-ufps-600 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg text-white">ARENA<span className="text-ufps-500">UFPS</span></span>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              Plataforma web para organizar y seguir la liga universitaria de videojuegos y e-sports de la Universidad Francisco de Paula Santander (UFPS). Desarrollada con Arquitectura Orientada a Servicios (SOA).
            </p>
            <div className="text-xs text-gray-500">
              Inspirado en el diseño desacoplado de <span className="text-gray-300">didierguerreros/coordinacion-emergencia</span>
            </div>
          </div>

          {/* Column 2: Servicios SOA */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Servicios SOA</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/torneos" className="hover:text-ufps-400 transition-colors">
                  API 1: Servicio de Liga
                </Link>
              </li>
              <li>
                <Link href="/posiciones" className="hover:text-ufps-400 transition-colors">
                  API 2: Resultados y Clasif.
                </Link>
              </li>
              <li>
                <Link href="/reportar" className="hover:text-ufps-400 transition-colors">
                  Validación Inter-Servicio HTTP
                </Link>
              </li>
              <li>
                <a href="/api/v1/openapi.json" target="_blank" className="hover:text-ufps-400 transition-colors flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  Contrato OpenAPI 3.0
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Tecnologías y Enlaces */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Tecnologías</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Next.js 14 & TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Supabase PostgreSQL
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                Vercel Free Tier
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ufps-500"></span>
                Vitest SOA Tests
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-esport-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© 2026 ArenaUFPS - Universidad Francisco de Paula Santander. Proyecto de Arquitectura Orientada a Servicios.</p>
          <div className="flex items-center gap-4">
            <Link href="/arquitectura" className="hover:text-gray-300 flex items-center gap-1">
              <Network className="w-3.5 h-3.5" />
              Diagrama de Arquitectura
            </Link>
            <span>•</span>
            <span className="text-gray-400">Despliegue Serverless</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
