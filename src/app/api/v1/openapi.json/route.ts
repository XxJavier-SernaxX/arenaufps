import { NextResponse } from 'next/server';

export async function GET() {
  const spec = {
    openapi: '3.0.3',
    info: {
      title: 'ArenaUFPS API - Plataforma SOA de Videojuegos y e-Sports',
      version: '1.0.0',
      description:
        'Especificación OpenAPI de la plataforma ArenaUFPS (Universidad Francisco de Paula Santander). Compuesta por dos microservicios desacoplados: API 1 (Servicio de Liga) y API 2 (Servicio de Resultados y Clasificación) comunicados por REST sobre HTTP.',
      contact: {
        name: 'Equipo ArenaUFPS - UFPS Cúcuta',
        email: 'soporte.esports@ufps.edu.co',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo Local',
      },
      {
        url: 'https://arenaufps.vercel.app',
        description: 'Servidor de Producción Vercel',
      },
    ],
    tags: [
      {
        name: 'API 1: Servicio de Liga (Principal)',
        description: 'Gestión de videojuegos, jugadores, equipos, torneos, inscripciones y partidos programados.',
      },
      {
        name: 'API 2: Servicio de Resultados y Clasificación (Complementario)',
        description: 'Validación HTTP de partidos, registro de marcadores, cierre en API 1 y cómputo de posiciones.',
      },
    ],
    paths: {
      '/api/v1/liga/videojuegos': {
        get: {
          tags: ['API 1: Servicio de Liga (Principal)'],
          summary: 'Consultar videojuegos disponibles',
          responses: {
            200: {
              description: 'Lista de videojuegos soportados',
            },
          },
        },
      },
      '/api/v1/liga/jugadores': {
        get: {
          tags: ['API 1: Servicio de Liga (Principal)'],
          summary: 'Consultar jugadores universitarios',
          responses: { 200: { description: 'Lista de jugadores' } },
        },
        post: {
          tags: ['API 1: Servicio de Liga (Principal)'],
          summary: 'Registrar nuevo jugador',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nickname', 'nombre', 'correo', 'carrera'],
                  properties: {
                    nickname: { type: 'string', example: 'RedStrike' },
                    nombre: { type: 'string', example: 'Julián Pérez' },
                    correo: { type: 'string', example: 'julian@ufps.edu.co' },
                    codigo_estudiantil: { type: 'string', example: '1152001' },
                    carrera: { type: 'string', example: 'Ingeniería de Sistemas' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Jugador creado' } },
        },
      },
      '/api/v1/liga/equipos': {
        get: {
          tags: ['API 1: Servicio de Liga (Principal)'],
          summary: 'Consultar equipos inscritos en la liga',
          responses: { 200: { description: 'Lista de equipos' } },
        },
        post: {
          tags: ['API 1: Servicio de Liga (Principal)'],
          summary: 'Crear nuevo equipo',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nombre', 'tag', 'capitan_id', 'videojuego_id'],
                  properties: {
                    nombre: { type: 'string', example: 'Sistemas Gaming UFPS' },
                    tag: { type: 'string', example: 'SIS-UFPS' },
                    capitan_id: { type: 'string', format: 'uuid' },
                    videojuego_id: { type: 'string', example: 'valorant' },
                    facultad: { type: 'string', example: 'Facultad de Ingeniería' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Equipo creado' } },
        },
      },
      '/api/v1/liga/torneos': {
        get: {
          tags: ['API 1: Servicio de Liga (Principal)'],
          summary: 'Consultar torneos',
          responses: { 200: { description: 'Lista de torneos' } },
        },
        post: {
          tags: ['API 1: Servicio de Liga (Principal)'],
          summary: 'Crear nuevo torneo',
          responses: { 201: { description: 'Torneo creado' } },
        },
      },
      '/api/v1/liga/torneos/{id}/inscripciones': {
        post: {
          tags: ['API 1: Servicio de Liga (Principal)'],
          summary: 'Inscribir equipo en torneo',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['equipo_id'],
                  properties: { equipo_id: { type: 'string' } },
                },
              },
            },
          },
          responses: { 201: { description: 'Inscripción confirmada' } },
        },
      },
      '/api/v1/liga/partidos/{id}': {
        get: {
          tags: ['API 1: Servicio de Liga (Principal)'],
          summary: 'Consultar partido (Punto de validación para API 2)',
          description: 'Endpoint invocado por API 2 mediante HTTP para verificar que el partido exista, esté pendiente y sus participantes sean válidos.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Datos del partido' },
            404: { description: 'Partido no encontrado' },
          },
        },
        patch: {
          tags: ['API 1: Servicio de Liga (Principal)'],
          summary: 'Actualizar estado del partido (Cierre notificado por API 2)',
          description: 'Endpoint invocado por API 2 mediante HTTP tras calcular los puntos para marcar el partido como finalizado.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Partido actualizado a finalizado' } },
        },
      },
      '/api/v1/liga/torneos/{id}/posiciones': {
        get: {
          tags: ['API 1: Servicio de Liga (Principal)'],
          summary: 'Consultar tabla de posiciones (API 1 consulta a API 2)',
          description: 'Demuestra la integración bidireccional: la API 1 le pide por REST a la API 2 el ranking actualizado.',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Posiciones devueltas por API 2' } },
        },
      },
      '/api/v1/resultados': {
        get: {
          tags: ['API 2: Servicio de Resultados y Clasificación (Complementario)'],
          summary: 'Historial de resultados registrados',
          responses: { 200: { description: 'Lista de resultados' } },
        },
        post: {
          tags: ['API 2: Servicio de Resultados y Clasificación (Complementario)'],
          summary: 'Reportar y validar resultado (Flujo Central SOA)',
          description:
            'Recibe el resultado, consulta a API 1 para validar el partido, asienta el marcador, notifica el cierre a API 1 y recalcula automáticamente la tabla de posiciones.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['partido_id', 'torneo_id', 'marcador_local', 'marcador_visitante'],
                  properties: {
                    partido_id: { type: 'string' },
                    torneo_id: { type: 'string' },
                    marcador_local: { type: 'integer', example: 13 },
                    marcador_visitante: { type: 'integer', example: 9 },
                    notas: { type: 'string', example: 'Partida finalizada sin incidencias' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Resultado registrado y validado con éxito' },
            400: { description: 'Rechazo de validación inter-servicio (partido no pendiente o inválido)' },
            404: { description: 'Partido no existe en API 1' },
          },
        },
      },
      '/api/v1/posiciones': {
        get: {
          tags: ['API 2: Servicio de Resultados y Clasificación (Complementario)'],
          summary: 'Obtener tabla de posiciones calculada de un torneo',
          parameters: [
            { name: 'torneo_id', in: 'query', required: true, schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'Tabla de posiciones ordenada por puntos y diferencia' } },
        },
      },
    },
  };

  return NextResponse.json(spec);
}
