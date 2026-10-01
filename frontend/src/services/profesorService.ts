const BASE_URL = 'http://localhost:3001/api/profesor';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type':  'application/json',
});

/** GET /api/profesor/mis-clases */
export const fetchMisSesiones = async (): Promise<any[]> => {
  const response = await fetch(`${BASE_URL}/mis-clases`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'No se pudieron obtener las sesiones');
  return data.data;
};

/** GET /api/profesor/sesion/:idSesion/asistencia */
export const fetchAsistenciaSesion = async (idSesion: number): Promise<any[]> => {
  const response = await fetch(`${BASE_URL}/sesion/${idSesion}/asistencia`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'No se pudo obtener la asistencia');
  return data.data;
};

/** POST /api/profesor/asistencia — Registrar asistencia */
export const registrarAsistencia = async (payload: {
  idInscripcion:  number;
  idSesion:       number;
  asistio:        'S' | 'N';
  motivoAusencia?: string;
}): Promise<void> => {
  const response = await fetch(`${BASE_URL}/asistencia`, {
    method:  'POST',
    headers: getAuthHeaders(),
    body:    JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al registrar asistencia');
};

/** PUT /api/profesor/asistencia — Actualizar asistencia */
export const actualizarAsistencia = async (payload: {
  idAsistencia:   number;
  asistio:        'S' | 'N';
  motivoAusencia?: string;
}): Promise<void> => {
  const response = await fetch(`${BASE_URL}/asistencia`, {
    method:  'PUT',
    headers: getAuthHeaders(),
    body:    JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al actualizar asistencia');
};

/** GET /api/profesor/estudiante/:idEstudiante/progreso */
export const fetchProgresoEstudiante = async (idEstudiante: number): Promise<any[]> => {
  const response = await fetch(`${BASE_URL}/estudiante/${idEstudiante}/progreso`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'No se pudo obtener el progreso');
  return data.data;
};

/** POST /api/profesor/progreso — Registrar progreso */
export const registrarProgreso = async (payload: {
  idInscripcion:  number;
  idNivel:        number;
  observaciones?: string;
}): Promise<void> => {
  const response = await fetch(`${BASE_URL}/progreso`, {
    method:  'POST',
    headers: getAuthHeaders(),
    body:    JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al registrar progreso');
};

/** GET /api/profesor/clase/:idClase/inscripciones */
export const fetchInscripcionesClase = async (idClase: number): Promise<any[]> => {
  const response = await fetch(`${BASE_URL}/clase/${idClase}/inscripciones`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'No se pudieron obtener las inscripciones');
  return data.data;
};