import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ArenaUFPS - Liga Universitaria de Videojuegos y e-Sports | SOA',
  description: 'Plataforma web universitaria para organizar y seguir la liga de videojuegos y e-sports de la UFPS con Arquitectura Orientada a Servicios (SOA).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen flex flex-col bg-esport-dark text-gray-100 antialiased selection:bg-ufps-600 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
