// 📁 src/pages/PrestamosPage/PrestamosPage.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { EquipoData, PrestamoData } from '../../types/spacehub.types';

export interface PrestamosPageProps {
  equipos: EquipoData[];
  prestamos: PrestamoData[];
  onCrearPrestamo: (p: PrestamoData) => void;
  onDevolver: (id: number) => void;
}

export default function PrestamosPage({ equipos, prestamos, onCrearPrestamo, onDevolver }: PrestamosPageProps) {
  const { user } = useAuth();
  const esAprendiz = user?.role === 'Aprendiz';
  const operativos = equipos.filter((e) => e.estado === 'Operativo');

  const [mostrarForm, setMostrarForm] = useState(false);
  const [aprendiz, setAprendiz] = useState('');
  const [ficha, setFicha] = useState('');
  const [equipoSel, setEquipoSel] = useState(operativos[0]?.placaSena ?? '');

  // Autocompletado de sesión: si es Aprendiz, su nombre se toma del AuthContext
  // (el token JWT del backend no incluye número de ficha, así que ese campo queda editable)
  useEffect(() => {
    if (esAprendiz && user) {
      setAprendiz(user.nombreCompleto);
    }
  }, [esAprendiz, user]);

  const activos = prestamos.filter((p) => p.estado === 'Activo');

  const confirmar = () => {
    if (!aprendiz || !ficha || !equipoSel) return;
    onCrearPrestamo({
      id: Date.now(),
      aprendiz,
      ficha,
      equipoPlaca: equipoSel,
      horaInicio: 'Ahora mismo',
      estado: 'Activo',
    });
    setMostrarForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">📋 Gestión de Solicitudes de Préstamo</h3>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-sena-green text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-600"
        >
          Solicitar Préstamo
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <p className="text-xs text-sky-400 bg-sky-950/60 p-3 rounded-xl border border-sky-800">
            {esAprendiz
              ? `⚡ Datos autocompletados desde tu sesión: ${aprendiz} (Ficha #${ficha}).`
              : '🛠️ Modo Operario: puedes registrar la entrega a cualquier aprendiz.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <input
              value={aprendiz}
              disabled={esAprendiz}
              onChange={(e) => setAprendiz(e.target.value)}
              placeholder="Nombre Aprendiz"
              className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white disabled:opacity-70"
            />
            <input
              value={ficha}
              disabled={esAprendiz}
              onChange={(e) => setFicha(e.target.value)}
              placeholder="Ficha"
              className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white disabled:opacity-70"
            />
            <select
              value={equipoSel}
              onChange={(e) => setEquipoSel(e.target.value)}
              className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-white"
            >
              {operativos.map((eq) => (
                <option key={eq.id} value={eq.placaSena}>
                  {eq.placaSena} - {eq.marcaModelo}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setMostrarForm(false)} className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-xl">
              Cancelar
            </button>
            <button onClick={confirmar} className="bg-sena-green text-white font-bold text-xs px-4 py-1.5 rounded-xl">
              Confirmar Solicitud
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activos.map((p) => (
          <div key={p.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <span className="bg-sena-green/10 text-sena-green text-[10px] font-bold px-2 py-0.5 rounded">
                Ficha #{p.ficha}
              </span>
              <span className="text-[10px] text-slate-400">{p.horaInicio}</span>
            </div>
            <div>
              <h5 className="font-bold text-xs text-white">{p.aprendiz}</h5>
              <p className="text-[11px] text-slate-400">
                Equipo: <strong className="text-sena-green">{p.equipoPlaca}</strong>
              </p>
            </div>
            <button
              onClick={() => onDevolver(p.id)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-bold py-1.5 rounded-xl border border-slate-800"
            >
              ✅ Registrar Devolución
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
