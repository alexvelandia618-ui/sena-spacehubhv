// 📁 src/pages/DashboardPage/DashboardPage.tsx — CLASE 5 (API REST)
// El conteo de equipos ya no llega por props: se consulta en vivo desde el backend
// (GET /api/v1/equipos) mediante equiposService, igual que en EquiposPage.
import { useEffect, useState } from 'react';
import { equiposService, type Equipo } from '../../services/equiposService';
import type { PrestamoData, IncidenciaData } from '../../types/spacehub.types';

export interface DashboardPageProps {
  prestamos: PrestamoData[];
  incidencias: IncidenciaData[];
}

export default function DashboardPage({ prestamos, incidencias }: DashboardPageProps) {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loadingEquipos, setLoadingEquipos] = useState(true);

  useEffect(() => {
    equiposService
      .getAll()
      .then(setEquipos)
      .catch(() => setEquipos([]))
      .finally(() => setLoadingEquipos(false));
  }, []);

  const activos = prestamos.filter((p) => p.estado === 'Activo').length;
  const pendientes = incidencias.filter((i) => !i.resuelta).length;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">📊 Panel General SENA SpaceHub</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Equipos (API REST)</span>
          <div className="text-2xl font-black text-white">{loadingEquipos ? '…' : equipos.length}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Préstamos Activos</span>
          <div className="text-2xl font-black text-sena-green">{activos}</div>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Incidencias Pendientes</span>
          <div className="text-2xl font-black text-amber-400">{pendientes}</div>
        </div>
      </div>
    </div>
  );
}
