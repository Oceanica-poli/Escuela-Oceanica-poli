const BASE_URL = 'http://localhost:3001/api/estudiante';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type':  'application/json',
});

/** GET /api/estudiante/mis-clases */
export const fetchMisClases = async (): Promise<any[]> => {
  const response = await fetch(`${BASE_URL}/mis-clases`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'No se pudieron obtener tus clases');
  return data.data;
};

/** GET /api/estudiante/clases-disponibles */
export const fetchClasesDisponibles = async (): Promise<any[]> => {
  const response = await fetch(`${BASE_URL}/clases-disponibles`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'No se pudieron obtener las clases disponibles');
  return data.data;
};

/** GET /api/estudiante/progreso */
export const fetchMiProgreso = async (): Promise<any[]> => {
  const response = await fetch(`${BASE_URL}/progreso`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'No se pudo obtener el progreso');
  return data.data;
};

/** GET /api/estudiante/asistencia */
export const fetchMiAsistencia = async (): Promise<any[]> => {
  const response = await fetch(`${BASE_URL}/asistencia`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'No se pudo obtener la asistencia');
  return data.data;
};

/** POST /api/estudiante/inscribirse/:idClase */
export const inscribirseEnClase = async (
  idClase: number,
  idSexoProfPref?: number
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/inscribirse/${idClase}`, {
    method:  'POST',
    headers: getAuthHeaders(),
    body:    JSON.stringify({ idSexoProfPref: idSexoProfPref ?? null }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al inscribirse en la clase');
};

/** DELETE /api/estudiante/inscripcion/:idClase */
export const cancelarInscripcion = async (idClase: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/inscripcion/${idClase}`, {
    method:  'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error al cancelar la inscripción');
};