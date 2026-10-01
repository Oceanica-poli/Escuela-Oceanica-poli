import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../services/authService';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type UserRole = 1 | 2 | 3; // 1=Admin, 2=Profesor, 3=Estudiante

export interface AuthUser {
  idUsuario:      number;
  idPerfil:       UserRole;
  nombres:        string;
  primerApellido: string;
  correo:         string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole:        UserRole;
  user:            AuthUser | null;
  token:           string | null;
  login:           (token: string, user: AuthUser) => void;
  logout:          () => void;
}

// ─── Contexto ─────────────────────────────────────────────────────────────────
// Se exporta para que useAuth.ts pueda importarlo
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole]               = useState<UserRole>(3);
  const [user, setUser]                       = useState<AuthUser | null>(null);
  const [token, setToken]                     = useState<string | null>(null);
  const [loading, setLoading]                 = useState(true);

  // useNavigate está dentro de <Router> porque AuthProvider
  // se monta dentro de <Router> en App.tsx
  const navigate = useNavigate();

  // Al cargar la app, rehidratar sesión desde localStorage
  useEffect(() => {
    const rehidratarSesion = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchUserData(storedToken);
        if (data.success && data.user) {
          setToken(storedToken);
          setIsAuthenticated(true);
          setUser(data.user);
          setUserRole(data.user.idPerfil as UserRole);
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    rehidratarSesion();
  }, []);

  /** Llamado desde la página de Login tras recibir respuesta exitosa del backend */
  const login = (newToken: string, userData: AuthUser) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    setUser(userData);
    setUserRole(userData.idPerfil);

    // Redirigir según rol
    if (userData.idPerfil === 1) navigate('/admin');
    else if (userData.idPerfil === 2) navigate('/profesor');
    else navigate('/estudiante');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(3);
    navigate('/login');
  };

  // Mientras se rehidrata la sesión no se renderiza nada para evitar flashes
  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};