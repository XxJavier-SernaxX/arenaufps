'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Trophy, 
  Gamepad2, 
  Users, 
  Calendar, 
  BarChart3, 
  Send, 
  Network, 
  Menu, 
  X,
  Server,
  RotateCcw
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const navLinks = [
    { href: '/', label: 'Inicio', icon: Trophy },
    { href: '/torneos', label: 'Torneos', icon: Gamepad2 },
    { href: '/equipos', label: 'Equipos', icon: Users },
    { href: '/partidos', label: 'Calendario', icon: Calendar },
    { href: '/posiciones', label: 'Posiciones', icon: BarChart3 },
    { href: '/reportar', label: 'Reportar Resultado', icon: Send, highlight: true },
    { href: '/arquitectura', label: 'Arquitectura SOA', icon: Network },
  ];

  const handleReset = async () => {
    if (!confirm('¿Deseas reiniciar la base de datos a los valores semilla iniciales de la UFPS?')) return;
    setResetting(true);
    try {
      await fetch('/api/v1/reset', { method: 'POST' });
      alert('Base de datos reiniciada correctamente.');
      window.location.reload();
    } catch {
      alert('Error al reiniciar.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-esport-dark/80 border-b border-esport-border">
      {/* Top microservice status banner */}
      <div className="bg-black/40 border-b border-esport-border/40 px-4 py-1.5 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-ufps-500" />
              Estado de Microservicios SOA:
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              API 1 (Servicio de Liga): <span className="font-mono">ONLINE</span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              API 2 (Resultados y Clasif.): <span className="font-mono">ONLINE</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={resetting}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
              title="Reiniciar datos semilla"
            >
              <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
              Reiniciar Datos Demo
            </button>
            <span className="text-gray-600">|</span>
            <span className="text-ufps-500 font-bold tracking-wider">UFPS e-Sports</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ufps-600 to-ufps-900 flex items-center justify-center shadow-lg shadow-ufps-900/30 group-hover:scale-105 transition-transform">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-white">ARENA</span>
                <span className="font-black text-xl tracking-tight text-ufps-500">UFPS</span>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest -mt-1 font-semibold">
                Liga Universitaria SOA
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    link.highlight
                      ? 'bg-ufps-600 text-white hover:bg-ufps-500 shadow-md shadow-ufps-600/30'
                      : isActive
                      ? 'bg-esport-card text-white border border-ufps-600/40 text-ufps-400'
                      : 'text-gray-300 hover:text-white hover:bg-esport-card/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-esport-card"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-esport-border bg-esport-dark px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-esport-card text-ufps-500 font-bold'
                    : 'text-gray-300 hover:text-white hover:bg-esport-card/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
