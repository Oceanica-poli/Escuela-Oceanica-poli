import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarItem {
  path:  string;
  label: string;
  icon:  string; // nombre del ícono de Bootstrap Icons
}

const itemsPorRol: Record<number, SidebarItem[]> = {
  1: [ // Administrador
    { path: '/admin',           label: 'Dashboard',         icon: 'speedometer2' },
    { path: '/admin/usuarios',  label: 'Usuarios',          icon: 'people' },
    { path: '/admin/clases',    label: 'Clases',            icon: 'journal-text' },
    { path: '/admin/auditoria', label: 'Auditoría',         icon: 'shield-check' },
  ],
  2: [ // Profesor
    { path: '/profesor',             label: 'Dashboard',  icon: 'speedometer2' },
    { path: '/profesor/mis-clases',  label: 'Mis Clases', icon: 'journal-text' },
  ],
  3: [ // Estudiante
    { path: '/estudiante',                       label: 'Dashboard',          icon: 'speedometer2' },
    { path: '/estudiante/mis-clases',            label: 'Mis Clases',         icon: 'journal-text' },
    { path: '/estudiante/clases-disponibles',    label: 'Clases Disponibles', icon: 'search' },
    { path: '/estudiante/mi-progreso',           label: 'Mi Progreso',        icon: 'bar-chart-line' },
  ],
};

const Sidebar: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) return null;

  const items: SidebarItem[] = itemsPorRol[userRole] ?? [];

  return (
    <div
      className="d-flex flex-column bg-light border-end"
      style={{ width: '220px', minHeight: '100vh', padding: '1rem 0' }}
    >
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path.split('/').length === 2} // exact solo para la raíz del rol
          className={({ isActive }) =>
            `d-flex align-items-center gap-2 px-3 py-2 text-decoration-none
             ${isActive ? 'bg-primary text-white' : 'text-dark'}`
          }
          style={{ fontSize: '0.95rem', borderRadius: '6px', margin: '2px 8px' }}
        >
          {/* Template literal corregido — antes usaba "{item.icon}" como string literal */}
          <i className={`bi bi-${item.icon}`} style={{ fontSize: '1.1rem' }}></i>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;