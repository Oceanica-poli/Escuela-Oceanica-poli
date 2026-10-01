import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';

// Auth pages
import Login    from './pages/auth/Login';
import Registro from './pages/auth/Registro';

// Shared layout
import Navbar  from './components/shared/Navbar';
import Sidebar from './components/shared/Sidebar';

// Profesor pages
import DashboardProfesor from './pages/profesor/DashboardProfesor';
import MisClases         from './pages/profesor/MisClases';

// Estudiante pages
import DashboardEstudiante from './pages/estudiante/DashboardEstudiante';
import MisClasesEstudiante from './pages/estudiante/MisClasesEstudiante';
import ClasesDisponibles   from './pages/estudiante/ClasesDisponibles';
import MiProgreso          from './pages/estudiante/MiProgreso';
import Inscribirse         from './pages/estudiante/inscribirse/Inscribirse';

// ─── Componente de ruta protegida por rol ────────────────────────────────────
interface PrivateRouteProps {
  element: React.ReactElement;
  rolesPermitidos: number[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, rolesPermitidos }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!rolesPermitidos.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

// ─── Rutas con layout (Navbar + Sidebar) ────────────────────────────────────
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <Navbar />}
      {isAuthenticated && <Sidebar />}
      <Routes>
        {/* Públicas */}
        <Route path="/login"    element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/"         element={<Navigate to="/login" replace />} />

        {/* Profesor — idPerfil: 2 */}
        <Route
          path="/profesor"
          element={<PrivateRoute element={<DashboardProfesor />} rolesPermitidos={[2]} />}
        />
        <Route
          path="/profesor/mis-clases"
          element={<PrivateRoute element={<MisClases />} rolesPermitidos={[2]} />}
        />

        {/* Estudiante — idPerfil: 3 */}
        <Route
          path="/estudiante"
          element={<PrivateRoute element={<DashboardEstudiante />} rolesPermitidos={[3]} />}
        />
        <Route
          path="/estudiante/mis-clases"
          element={<PrivateRoute element={<MisClasesEstudiante />} rolesPermitidos={[3]} />}
        />
        <Route
          path="/estudiante/clases-disponibles"
          element={<PrivateRoute element={<ClasesDisponibles />} rolesPermitidos={[3]} />}
        />
        <Route
          path="/estudiante/mi-progreso"
          element={<PrivateRoute element={<MiProgreso />} rolesPermitidos={[3]} />}
        />
        <Route
          path="/estudiante/inscribirse/:idClase"
          element={<PrivateRoute element={<Inscribirse />} rolesPermitidos={[3]} />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

// ─── App raíz ────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;