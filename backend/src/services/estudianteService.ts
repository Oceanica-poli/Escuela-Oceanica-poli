import { Request, Response } from 'express';
import { Clase } from '../repositories/claseRepository';
import { Asistencia } from '../repositories/asistenciaRepository';
import { Progreso } from '../repositories/progresoRepository';
import { Inscripcion } from '../repositories/inscripcionRepository';

/** GET /api/estudiante/clases-disponibles — Clases con cupo disponible */
export const getClasesDisponibles = async (req: Request, res: Response): Promise<void> => {
  try {
    const clases = await Clase.findDisponibles();
    res.json({ success: true, data: clases });
  } catch (error) {
    console.error('Error al obtener clases disponibles:', error);
    res.status(500).json({ success: false, message: 'Error al obtener clases disponibles' });
  }
};

/** GET /api/estudiante/mis-clases — Inscripciones del estudiante autenticado */
export const getMisClases = async (req: Request, res: Response): Promise<void> => {
  try {
    // El ID del estudiante viene del JWT (puesto por auth.middleware.ts)
    const idEstudiante: number = (req as any).user.idUsuario;
    const inscripciones = await Inscripcion.findByEstudianteId(idEstudiante);
    res.json({ success: true, data: inscripciones });
  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    res.status(500).json({ success: false, message: 'Error al obtener inscripciones' });
  }
};

/** POST /api/estudiante/inscribirse/:idClase — Inscribirse en una clase */
export const inscribirse = async (req: Request, res: Response): Promise<void> => {
  try {
    // ID del estudiante desde el JWT, nunca desde el body/params
    const idEstudiante: number = (req as any).user.idUsuario;
    const idClase = Number(req.params.idClase);
    const { idSexoProfPref } = req.body;

    // Verificar que la clase existe y tiene cupo
    const clase = await Clase.findById(idClase);
    if (!clase) {
      res.status(404).json({ success: false, message: 'Clase no encontrada' });
      return;
    }

    // Verificar inscripción duplicada
    const existente = await Inscripcion.findByEstudianteYClase(idEstudiante, idClase);
    if (existente && ['Pendiente', 'Activa'].includes(existente.estado)) {
      res.status(409).json({ success: false, message: 'Ya estás inscrito en esta clase' });
      return;
    }

    const inscripcion = new Inscripcion({
      idEstudiante,
      idClase,
      fechaInicio:    new Date(),
      estado:         'Pendiente',
      idSexoProfPref: idSexoProfPref ?? null,
    });

    await inscripcion.save();
    res.status(201).json({
      success: true,
      message: 'Inscripción realizada exitosamente',
      idInscripcion: inscripcion.idInscripcion,
    });
  } catch (error: any) {
    console.error('Error al inscribirse:', error);
    res.status(500).json({ success: false, message: 'Error al inscribirse en la clase' });
  }
};

/** DELETE /api/estudiante/inscripcion/:idClase — Cancelar inscripción */
export const cancelarInscripcion = async (req: Request, res: Response): Promise<void> => {
  try {
    const idEstudiante: number = (req as any).user.idUsuario;
    const idClase = Number(req.params.idClase);

    const inscripcion = await Inscripcion.findByEstudianteYClase(idEstudiante, idClase);
    if (!inscripcion) {
      res.status(404).json({ success: false, message: 'Inscripción no encontrada' });
      return;
    }

    await inscripcion.updateEstado('Cancelada');
    res.json({ success: true, message: 'Inscripción cancelada exitosamente' });
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    res.status(500).json({ success: false, message: 'Error al cancelar inscripción' });
  }
};

/** GET /api/estudiante/asistencia — Asistencias del estudiante autenticado */
export const getMiAsistencia = async (req: Request, res: Response): Promise<void> => {
  try {
    const idEstudiante: number = (req as any).user.idUsuario;
    const asistencias = await Asistencia.findByEstudianteId(idEstudiante);
    res.json({ success: true, data: asistencias });
  } catch (error) {
    console.error('Error al obtener asistencia:', error);
    res.status(500).json({ success: false, message: 'Error al obtener asistencia' });
  }
};

/** GET /api/estudiante/progreso — Progreso del estudiante autenticado */
export const getMiProgreso = async (req: Request, res: Response): Promise<void> => {
  try {
    const idEstudiante: number = (req as any).user.idUsuario;
    const progreso = await Progreso.findByEstudianteId(idEstudiante);
    res.json({ success: true, data: progreso });
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    res.status(500).json({ success: false, message: 'Error al obtener progreso' });
  }
};