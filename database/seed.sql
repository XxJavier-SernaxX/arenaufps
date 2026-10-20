-- ==============================================================================
-- ArenaUFPS: Datos Semilla Oficiales (UFPS)
-- ==============================================================================

-- 1. Videojuegos
INSERT INTO public.videojuegos (id, nombre, genero, tamanio_equipo, imagen_url) VALUES
('valorant', 'Valorant', 'FPS Táctico', 5, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'),
('league-of-legends', 'League of Legends', 'MOBA', 5, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80'),
('rocket-league', 'Rocket League', 'Deportes / Autos', 3, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

-- 2. Jugadores UFPS
INSERT INTO public.jugadores (id, nickname, nombre, correo, codigo_estudiantil, carrera) VALUES
('11111111-1111-1111-1111-111111111111', 'RedStrike', 'Julián Camilo Pérez', 'julian.perez@ufps.edu.co', '1152001', 'Ingeniería de Sistemas'),
('11111111-1111-1111-1111-111111111112', 'VoltMaster', 'Andrea Marcela Rangel', 'andrea.rangel@ufps.edu.co', '1152002', 'Ingeniería Electrónica'),
('11111111-1111-1111-1111-111111111113', 'IronGear', 'Sebastián Mora', 'sebastian.mora@ufps.edu.co', '1152003', 'Ingeniería Mecánica'),
('11111111-1111-1111-1111-111111111114', 'CúcutaAim', 'Natalia Suárez', 'natalia.suarez@ufps.edu.co', '1152004', 'Ingeniería Industrial')
ON CONFLICT (id) DO NOTHING;

-- 3. Equipos UFPS
INSERT INTO public.equipos (id, nombre, tag, capitan_id, videojuego_id, facultad) VALUES
('22222222-2222-2222-2222-222222222221', 'Sistemas Gaming UFPS', 'SIS-UFPS', '11111111-1111-1111-1111-111111111111', 'valorant', 'Facultad de Ingeniería'),
('22222222-2222-2222-2222-222222222222', 'Electrónica eSports', 'ELEC-UFPS', '11111111-1111-1111-1111-111111111112', 'valorant', 'Facultad de Ingeniería'),
('22222222-2222-2222-2222-222222222223', 'Mecatrónica Titans', 'MECA-UFPS', '11111111-1111-1111-1111-111111111113', 'valorant', 'Facultad de Ingeniería'),
('22222222-2222-2222-2222-222222222224', 'Industrial Warriors', 'INDU-UFPS', '11111111-1111-1111-1111-111111111114', 'valorant', 'Facultad de Ingeniería')
ON CONFLICT (id) DO NOTHING;

-- 4. Torneo Inaugural
INSERT INTO public.torneos (id, nombre, videojuego_id, descripcion, formato, estado, max_equipos, fecha_inicio, premio) VALUES
('33333333-3333-3333-3333-333333333331', 'Copa Universitaria ArenaUFPS 2026', 'valorant', 
 'Torneo interfacultades oficial de la Universidad Francisco de Paula Santander.', 
 'liguilla', 'en_curso', 4, timezone('utc'::text, now() - INTERVAL '2 days'), 
 '$1.500.000 COP + Trofeo Institucional UFPS')
ON CONFLICT (id) DO NOTHING;

-- 5. Inscripciones
INSERT INTO public.inscripciones (torneo_id, equipo_id, estado) VALUES
('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 'confirmada'),
('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222222', 'confirmada'),
('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222223', 'confirmada'),
('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222224', 'confirmada')
ON CONFLICT DO NOTHING;

-- 6. Partidos Programados
-- Partido 1: Sistemas vs Electrónica (Finalizado)
INSERT INTO public.partidos (id, torneo_id, ronda, equipo_local_id, equipo_visitante_id, fecha_programada, estado, equipo_ganador_id) VALUES
('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', 1, 
 '22222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 
 timezone('utc'::text, now() - INTERVAL '1 days'), 'finalizado', '22222222-2222-2222-2222-222222222221')
ON CONFLICT (id) DO NOTHING;

-- Partido 2: Mecatrónica vs Industrial (Pendiente - Listo para probar el ciclo completo)
INSERT INTO public.partidos (id, torneo_id, ronda, equipo_local_id, equipo_visitante_id, fecha_programada, estado) VALUES
('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333331', 1, 
 '22222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222224', 
 timezone('utc'::text, now() + INTERVAL '1 days'), 'pendiente')
ON CONFLICT (id) DO NOTHING;

-- 7. Resultados (Registrados por API 2)
INSERT INTO public.resultados (id, partido_id, torneo_id, marcador_local, marcador_visitante, equipo_ganador_id, validado_con_api_liga, notas) VALUES
('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', 
 13, 9, '22222222-2222-2222-2222-222222222221', true, 'Partida inaugural. Gran actuación de Sistemas Gaming UFPS')
ON CONFLICT (id) DO NOTHING;

-- 8. Posiciones iniciales (Mantenidas por API 2)
INSERT INTO public.posiciones (torneo_id, equipo_id, partidos_jugados, ganados, empatados, perdidos, puntos_favor, puntos_contra, diferencia, puntos, posicion) VALUES
('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 1, 1, 0, 0, 13, 9, 4, 3, 1),
('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222223', 0, 0, 0, 0, 0, 0, 0, 0, 2),
('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222224', 0, 0, 0, 0, 0, 0, 0, 0, 3),
('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222222', 1, 0, 0, 1, 9, 13, -4, 0, 4)
ON CONFLICT (torneo_id, equipo_id) DO NOTHING;
