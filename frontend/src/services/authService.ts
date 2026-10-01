const BASE_URL = 'http://localhost:3001/api/auth';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface LoginCredentials {
  correo:   string;
  password: string;
}

export interface RegisterData {
  nombres:          string;
  primerApellido:   string;
  segundoApellido?: string;
  correo:           string;
  password:         string;
  idPerfil?:        number;
  idSexo?:          number;
  fechaNac?:        string;
  telefono?:        string;
  celular?:         string;
  direccion?:       string;
}

export interface LoginResponse {
  success: boolean;
  token:   string;
  user: {
    idUsuario:      number;
    idPerfil:       number;
    nombres:        string;
    primerApellido: string;
    correo:         string;
  };
}

// ─── Funciones ────────────────────────────────────────────────────────────────

/**
 * Llama a POST /api/auth/login.
 * Retorna el token y los datos básicos del usuario.
 */
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al iniciar sesión');
  }
  return data;
};

/**
 * Llama a POST /api/auth/register.
 */
export const registerUser = async (userData: RegisterData): Promise<void> => {
  const response = await fetch(`${BASE_URL}/register`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al registrar usuario');
  }
};

/**
 * Llama a GET /api/auth/user para rehidratar la sesión al recargar la página.
 * Requiere el token en el header Authorization.
 */
export const fetchUserData = async (token: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}/user`, {
    method:  'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':  'application/json',
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Sesión inválida');
  }
  return data;
};