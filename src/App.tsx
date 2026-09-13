// 📁 src/App.tsx — CLASE 5 (API REST)
// El inventario de equipos ahora vive en el servidor (Node.js + Express + JWT) y se
// consume mediante equiposService.ts. Préstamos e Incidencias, al no tener todavía un
// endpoint propio en la API, siguen operando con datos simulados en memoria.
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import EquiposPage from './pages/EquiposPage/EquiposPage';
import NuevoEquipoPage from './pages/NuevoEquipoPage/NuevoEquipoPage';
import DetalleEquipoPage from './pages/DetalleEquipoPage/DetalleEquipoPage';
import PrestamosPage from './pages/PrestamosPage/PrestamosPage';
import IncidenciasPage from './pages/IncidenciasPage/IncidenciasPage';
// 🛡️ Guardia de seguridad: ahora usa <Outlet /> + RBAC por rol
import ProtectedRoute from './routes/ProtectedRoute';
import { equiposIniciales, prestamosIniciales, incidenciasIniciales } from './data/mockData';
import type { PrestamoData, IncidenciaData } from './types/spacehub.types';

export default function App() {
  const [prestamos, setPrestamos] = useState<PrestamoData[]>(prestamosIniciales);
  const [incidencias, setIncidencias] = useState<IncidenciaData[]>(incidenciasIniciales);

  return (
    <Routes>
      {/* 1. Ruta Pública (Accesible para cualquiera) */}
      <Route path="/login" element={<LoginPage />} />

      {/* 2. Nivel 1 de Protección: Requiere cualquier usuario autenticado */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage prestamos={prestamos} incidencias={incidencias} />} />

          {/* Inventario: 100% consumido desde la API REST vía equiposService */}
          <Route path="inventario" element={<EquiposPage />} />

          <Route
            path="prestamos"
            element={
              <PrestamosPage
                equipos={equiposIniciales}
                prestamos={prestamos}
                onCrearPrestamo={(p) => setPrestamos((prev) => [...prev, p])}
                onDevolver={(id) => setPrestamos((prev) => prev.map((p) => (p.id === id ? { ...p, estado: 'Devuelto' } : p)))}
              />
            }
          />

          <Route
            path="incidencias"
            element={
              <IncidenciasPage
                incidencias={incidencias}
                onCrear={(i) => setIncidencias((prev) => [...prev, i])}
                onResolver={(id) => setIncidencias((prev) => prev.map((i) => (i.id === id ? { ...i, resuelta: true } : i)))}
              />
            }
          />

          {/* 3. Nivel 2 de Protección (RBAC): Exclusivo para el rol 'Administrador' */}
          <Route element={<ProtectedRoute requiredRole="Administrador" />}>
            <Route path="inventario/nuevo" element={<NuevoEquipoPage />} />
            <Route path="inventario/:placaSena" element={<DetalleEquipoPage />} />
          </Route>
        </Route>
      </Route>

      {/* Ruta Comodín: Redirige cualquier ruta desconocida al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
