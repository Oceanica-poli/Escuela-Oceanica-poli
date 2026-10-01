import oracledb from 'oracledb';
import { getConnection } from '../db/connection';

export interface AsistenciaData {
  idAsistencia?:   number | null;
  idInscripcion?:  number | null;
  idSesion?:       number | null;
  asistio?:        'S' | 'N';
  motivoAusencia?: string | null;
}

export class Asistencia {
  idAsistencia:   number | null;
  idInscripcion:  number | null;
  idSesion:       number | null;
  asistio:        'S' | 'N';
  motivoAusencia: string | null;

  constructor(data: AsistenciaData) {
    this.idAsistencia   = data.idAsistencia   ?? null;
    this.idInscripcion  = data.idInscripcion  ?? null;
    this.idSesion       = data.idSesion       ?? null;
    this.asistio        = data.asistio        ?? 'S';
    this.motivoAusencia = data.motivoAusencia ?? null;
  }

  /** Inserta un nuevo registro de asistencia. */
  async save(): Promise<this> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `INSERT INTO Asistencia_Oceanica
           (ID_Inscripcion, ID_Sesion, Asistio, Motivo_Ausencia)
         VALUES
           (:idInscripcion, :idSesion, :asistio, :motivoAusencia)
         RETURNING ID_Asistencia INTO :idAsistencia`,
        {
          idInscripcion:  this.idInscripcion,
          idSesion:       this.idSesion,
          asistio:        this.asistio,
          motivoAusencia: this.motivoAusencia,
          idAsistencia: {
            dir:  oracledb.BIND_OUT,
            type: oracledb.NUMBER,
          },
        },
        { autoCommit: true }
      );
      const outBinds = result.outBinds as { idAsistencia: number[] };
      this.idAsistencia = outBinds.idAsistencia[0];
      return this;
    } finally {
      await connection.close();
    }
  }

  /** Actualiza el registro de asistencia existente. */
  async update(): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(
        `UPDATE Asistencia_Oceanica
         SET Asistio = :asistio, Motivo_Ausencia = :motivoAusencia
         WHERE ID_Asistencia = :idAsistencia`,
        {
          asistio:        this.asistio,
          motivoAusencia: this.motivoAusencia,
          idAsistencia:   this.idAsistencia,
        },
        { autoCommit: true }
      );
    } finally {
      await connection.close();
    }
  }

  /** Obtiene asistencias por ID de inscripción. */
  static async findByInscripcionId(inscripcionId: number): Promise<Asistencia[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT ID_Asistencia, ID_Inscripcion, ID_Sesion, Asistio, Motivo_Ausencia
         FROM Asistencia_Oceanica
         WHERE ID_Inscripcion = :inscripcionId
         ORDER BY ID_Asistencia`,
        { inscripcionId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => new Asistencia({
        idAsistencia:   row.ID_ASISTENCIA,
        idInscripcion:  row.ID_INSCRIPCION,
        idSesion:       row.ID_SESION,
        asistio:        row.ASISTIO,
        motivoAusencia: row.MOTIVO_AUSENCIA,
      }));
    } finally {
      await connection.close();
    }
  }

  /**
   * Obtiene todas las asistencias de un estudiante
   * a través de sus inscripciones.
   */
  static async findByEstudianteId(idEstudiante: number): Promise<Asistencia[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT a.ID_Asistencia, a.ID_Inscripcion, a.ID_Sesion,
                a.Asistio, a.Motivo_Ausencia
         FROM Asistencia_Oceanica a
         JOIN Inscripcion_Oceanica i ON a.ID_Inscripcion = i.ID_Inscripcion
         WHERE i.ID_Estudiante = :idEstudiante
         ORDER BY a.ID_Asistencia`,
        { idEstudiante },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => new Asistencia({
        idAsistencia:   row.ID_ASISTENCIA,
        idInscripcion:  row.ID_INSCRIPCION,
        idSesion:       row.ID_SESION,
        asistio:        row.ASISTIO,
        motivoAusencia: row.MOTIVO_AUSENCIA,
      }));
    } finally {
      await connection.close();
    }
  }

  /** Obtiene asistencias por ID de sesión (útil para el profesor al registrar). */
  static async findBySesionId(idSesion: number): Promise<Asistencia[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT ID_Asistencia, ID_Inscripcion, ID_Sesion, Asistio, Motivo_Ausencia
         FROM Asistencia_Oceanica
         WHERE ID_Sesion = :idSesion
         ORDER BY ID_Asistencia`,
        { idSesion },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => new Asistencia({
        idAsistencia:   row.ID_ASISTENCIA,
        idInscripcion:  row.ID_INSCRIPCION,
        idSesion:       row.ID_SESION,
        asistio:        row.ASISTIO,
        motivoAusencia: row.MOTIVO_AUSENCIA,
      }));
    } finally {
      await connection.close();
    }
  }
}