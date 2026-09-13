import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { USERS, EQUIPOS } from './data';
import { authenticateToken, requireRole, JWT_SECRET, type AuthenticatedRequest } from './middleware';
import type { Equipo } from './types';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ---------- AUTH ----------
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    res.status(401).json({ statusCode: 401, error: 'Unauthorized', message: 'Credenciales inválidas' });
    return;
  }

  const accessToken = jwt.sign(
    { sub: user.id, name: user.nombreCompleto, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({
    statusCode: 200,
    message: 'Autenticación exitosa',
    accessToken,
    user: { id: user.id, nombreCompleto: user.nombreCompleto, email: user.email, role: user.role },
  });
});

app.post('/api/v1/auth/logout', authenticateToken, (_req, res) => {
  res.json({ statusCode: 200, message: 'Sesión cerrada exitosamente en el servidor' });
});

// ---------- EQUIPOS ----------
app.get('/api/v1/equipos', authenticateToken, (_req, res) => {
  res.json(EQUIPOS);
});

app.post('/api/v1/equipos', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena, marcaModelo, ram, ambiente, estado } = req.body as Partial<Equipo>;

  if (!placaSena || !marcaModelo) {
    res.status(400).json({ statusCode: 400, message: 'Faltan campos obligatorios' });
    return;
  }

  const newEquipo: Equipo = {
    id: Date.now(),
    placaSena: placaSena.toUpperCase(),
    marcaModelo,
    ram: ram || '16GB DDR4',
    ambiente: ambiente || 'Ambiente 301 - ADSO',
    estado: estado || 'Operativo',
  };

  EQUIPOS.unshift(newEquipo);
  res.status(201).json(newEquipo);
});

app.put('/api/v1/equipos/:placaSena', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena } = req.params;
  const index = EQUIPOS.findIndex((e) => e.placaSena.toUpperCase() === placaSena.toUpperCase());

  if (index === -1) {
    res.status(404).json({ statusCode: 404, message: 'Equipo no encontrado' });
    return;
  }

  EQUIPOS[index] = { ...EQUIPOS[index], ...(req.body as Partial<Equipo>) };
  res.json(EQUIPOS[index]);
});

app.delete('/api/v1/equipos/:placaSena', authenticateToken, requireRole('Administrador'), (req, res) => {
  const { placaSena } = req.params;
  const index = EQUIPOS.findIndex((e) => e.placaSena.toUpperCase() === placaSena.toUpperCase());

  if (index === -1) {
    res.status(404).json({ statusCode: 404, message: 'Equipo no encontrado' });
    return;
  }

  EQUIPOS.splice(index, 1);
  res.json({ message: `Equipo ${placaSena} eliminado con éxito` });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/api/v1`);
});
