// 📁 src/pages/DashboardPage/DashboardPage.tsx
// Panel General con métricas de Equipos, Préstamos e Incidencias.
// Usa las clases ya definidas en dashboard.css (antes sin usar en el proyecto).
import './dashboard.css';
import { Link } from 'react-router-dom';
import type { EquipoData, PrestamoData, IncidenciaData } from '../../types/spacehub.types';

export interface DashboardPageProps {
  equipos: EquipoData[];
  prestamos: PrestamoData[];
  incidencias: IncidenciaData[];
}

export default function DashboardPage({ equipos, prestamos, incidencias }: DashboardPageProps) {
  // --- Métricas de Equipos ---
  const totalEquipos = equipos.length;
  const operativos = equipos.filter((e) => e.estado === 'Operativo').length;
  const enMantenimiento = totalEquipos - operativos;
  const porcentajeOperativo = totalEquipos > 0 ? Math.round((operativos / totalEquipos) * 100) : 0;

  // --- Métricas de Préstamos ---
  const activos = prestamos.filter((p) => p.estado === 'Activo').length;
  const devueltos = prestamos.length - activos;
  const porcentajeActivos = prestamos.length > 0 ? Math.round((activos / prestamos.length) * 100) : 0;

  // --- Métricas de Incidencias ---
  const pendientes = incidencias.filter((i) => !i.resuelta);
  const resueltas = incidencias.length - pendientes.length;

  // 'Alta' se resuelve con un estilo inline (rojo) porque dashboard.css no define
  // un tono de alerta fuerte; 'Media' y 'Baja' usan las clases de utilidad existentes.
  const colorPorPrioridad: Record<'Media' | 'Baja', string> = {
    Media: 'text-blue',
    Baja: 'text-green',
  };

  return (
    <div className="dashboard-layout" style={{ maxWidth: 'none', margin: 0, padding: 0 }}>
      {/* Encabezado del panel */}
      <div className="panel-header">
        <div>
          <h3 className="panel-title">📊 Panel General SENA SpaceHub</h3>
          <span className="text-muted">Resumen en tiempo real del inventario, préstamos e incidencias</span>
        </div>
        <div className="status-badge">
          <span className="status-dot" />
          Sistema operativo
        </div>
      </div>

      {/* Alerta de incidencias pendientes */}
      {pendientes.length > 0 && (
        <div className="alert-box">
          <span>
            ⚠️ Tienes <strong>{pendientes.length}</strong>{' '}
            {pendientes.length === 1 ? 'incidencia pendiente' : 'incidencias pendientes'} por resolver.
          </span>
          <Link to="/incidencias" className="btn-alert" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Ver Mesa de Ayuda
          </Link>
        </div>
      )}

      {/* Tarjetas de métricas principales */}
      <div className="stats-grid">
        <div className="card">
          <span className="stat-label">Total Equipos</span>
          <div className="stat-number">{totalEquipos}</div>
          <span className="text-muted">{operativos} operativos · {enMantenimiento} en mantenimiento</span>
        </div>

        <div className="card">
          <span className="stat-label">Préstamos Activos</span>
          <div className="stat-number text-green">{activos}</div>
          <span className="text-muted">{devueltos} devueltos en total</span>
        </div>

        <div className="card">
          <span className="stat-label">Incidencias Pendientes</span>
          <div className="stat-number text-amber">{pendientes.length}</div>
          <span className="text-muted">{resueltas} resueltas</span>
        </div>

        <div className="card">
          <span className="stat-label">% Operatividad</span>
          <div className="stat-number text-blue">{porcentajeOperativo}%</div>
          <span className="text-muted">del inventario disponible</span>
        </div>
      </div>

      {/* Sección principal: distribución de equipos + incidencias */}
      <div className="main-grid">
        {/* Distribución del inventario (donut + leyenda) */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Distribución del Inventario</span>
          </div>

          <div className="distribution-wrapper">
            <div
              className="donut-container"
              style={{
                borderRadius: '50%',
                background: `conic-gradient(var(--green-accent) 0% ${porcentajeOperativo}%, var(--amber-accent) ${porcentajeOperativo}% 100%)`,
              }}
            >
              <div className="donut-overlay">
                <span className="donut-value">{porcentajeOperativo}%</span>
                <span className="donut-label">Operativo</span>
              </div>
            </div>

            <div className="weekly-wrapper">
              <div className="lab-item">
                <div className="lab-info">
                  <span>🟢 Operativos</span>
                  <span className="text-green">{operativos}</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill progress-fill-green" style={{ width: `${porcentajeOperativo}%` }} />
                </div>
              </div>

              <div className="lab-item">
                <div className="lab-info">
                  <span>🟠 En Mantenimiento</span>
                  <span className="text-amber">{enMantenimiento}</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill progress-fill-amber"
                    style={{ width: `${100 - porcentajeOperativo}%` }}
                  />
                </div>
              </div>

              <div className="lab-item">
                <div className="lab-info">
                  <span>🔵 Préstamos Activos</span>
                  <span className="text-blue">{activos} / {prestamos.length}</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill progress-fill-blue" style={{ width: `${porcentajeActivos}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Incidencias recientes */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Incidencias Recientes</span>
            <span className="status-badge">{incidencias.length} en total</span>
          </div>

          {incidencias.length === 0 ? (
            <span className="text-muted">No hay incidencias registradas.</span>
          ) : (
            incidencias.slice(0, 5).map((inc) => (
              <div key={inc.id} className="lab-item">
                <div className="lab-info">
                  <span>{inc.placaSena}</span>
                  <span
                    style={
                      inc.prioridad === 'Alta'
                        ? { color: '#f87171', fontWeight: 700, fontSize: '12px' }
                        : undefined
                    }
                    className={inc.prioridad !== 'Alta' ? colorPorPrioridad[inc.prioridad as 'Media' | 'Baja'] : undefined}
                  >
                    {inc.prioridad}
                  </span>
                </div>
                <span className="text-muted">
                  {inc.descripcion} {inc.resuelta ? '· ✅ Resuelta' : '· ⏳ Pendiente'}
                </span>
              </div>
            ))
          )}

          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <Link to="/incidencias" className="btn btn-blue" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Ir a Mesa de Ayuda →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}