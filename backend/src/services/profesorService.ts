import { Request, Response } from 'express';
import { Sesion } from '../repositories/sesionRepository';
import { Asistencia } from '../repositories/asistenciaRepository';
import { Progreso } from '../repositories/progresoRepository';
import { Inscripcion } from '../repositories/inscripcionRepository';

/** GET /api/profesor/mis-clases — Sesiones asignadas al profesor autenticado */
export const getMisSesiones = async (req: Request, res: Response): Promise<void> => {
  try {
    // ID del profesor viene del JWT
    const idProfesor: number = (req as any).user.idUsuario;
    const sesiones = await Sesion.findByProfesorId(idProfesor);
    res.json({ success: true, data: sesiones });
  } catch (error) {
    console.error('Error al obtener sesiones del profesor:', error);
    res.status(500).json({ success: false, message: 'Error al obtener sesiones' });
  }
};

/** GET /api/profesor/sesion/:idSesion/asistencia — Lista de asistencia de una sesión */
export const getAsistenciaSesion = async (req: Request, res: Response): Promise<void> => {
  try {
    const idSesion = Number(req.params.idSesion);
    const asistencias = await Asistencia.findBySesionId(idSesion);
    res.json({ success: true, data: asistencias });
  } catch (error) {
    console.error('Error al obtener asistencia de sesión:', error);
    res.status(500).json({ success: false, message: 'Error al obtener asistencia' });
  }
};

/** POST /api/profesor/asistencia — Registrar asistencia de un estudiante */
export const registrarAsistencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idInscripcion, idSesion, asistio, motivoAusencia } = req.body;

    if (!idInscripcion || !idSesion || !asistio) {
      res.status(400).json({ success: false, message: 'idInscripcion, idSesion y asistio son requeridos' });
      return;
    }

    const asistencia = new Asistencia({
      idInscripcion,
      idSesion,
      asistio,
      motivoAusencia: motivoAusencia ?? null,
    });

    await asistencia.save();
    res.status(201).json({ success: true, message: 'Asistencia registrada exitosamente' });
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
    res.status(500).json({ success: false, message: 'Error al registrar asistencia' });
  }
};

/** PUT /api/profesor/asistencia — Actualizar un registro de asistencia existente */
export const actualizarAsistencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idAsistencia, asistio, motivoAusencia } = req.body;

    if (!idAsistencia || !asistio) {
      res.status(400).json({ success: false, message: 'idAsistencia y asistio son requeridos' });
      return;
    }

    const registro = new Asistencia({
      idAsistencia,
      asistio,
      motivoAusencia: motivoAusencia ?? null,
    });

    await registro.update();
    res.json({ success: true, message: 'Asistencia actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar asistencia:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar asistencia' });
  }
};

/** GET /api/profesor/estudiante/:idEstudiante/progreso — Ver progreso de un estudiante */
export const getProgresoEstudiante = async (req: Request, res: Response): Promise<void> => {
  try {
    const idEstudiante = Number(req.params.idEstudiante);
    const progreso = await Progreso.findByEstudianteId(idEstudiante);
    res.json({ success: true, data: progreso });
  } catch (error) {
    console.error('Error al obtener progreso del estudiante:', error);
    res.status(500).json({ success: false, message: 'Error al obtener progreso' });
  }
};

/** POST /api/profesor/progreso — Registrar avance de nivel de un estudiante */
export const registrarProgreso = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idInscripcion, idNivel, observaciones } = req.body;

    if (!idInscripcion || !idNivel) {
      res.status(400).json({ success: false, message: 'idInscripcion e idNivel son requeridos' });
      return;
    }

    const progreso = new Progreso({
      idInscripcion,
      idNivel,
      observaciones: observaciones ?? null,
      fecha: new Date(),
    });

    await progreso.save();
    res.status(201).json({ success: true, message: 'Progreso registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar progreso:', error);
    res.status(500).json({ success: false, message: 'Error al registrar progreso' });
  }
};

/** GET /api/profesor/clase/:idClase/inscripciones — Estudiantes de una clase */
export const getInscripcionesClase = async (req: Request, res: Response): Promise<void> => {
  try {
    const idClase = Number(req.params.idClase);
    // Se reutiliza findAll filtrado — si en el futuro el volumen crece,
    // conviene agregar Inscripcion.findByClaseId en el repositorio.
    const todas = await Inscripcion.findAll();
    const deEstaClase = todas.filter(i => i.idClase === idClase);
    res.json({ success: true, data: deEstaClase });
  } catch (error) {
    console.error('Error al obtener inscripciones de la clase:', error);
    res.status(500).json({ success: false, message: 'Error al obtener inscripciones' });
  }
};