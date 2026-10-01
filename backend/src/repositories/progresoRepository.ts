import oracledb from 'oracledb';
import { getConnection } from '../db/connection';

export interface ProgresoData {
  idProgreso?:    number | null;
  idInscripcion?: number | null;
  idNivel?:       number | null;
  observaciones?: string | null;
  fecha?:         Date | null;
}

export class Progreso {
  idProgreso:    number | null;
  idInscripcion: number | null;
  idNivel:       number | null;
  observaciones: string | null;
  fecha:         Date | null;

  constructor(data: ProgresoData) {
    this.idProgreso    = data.idProgreso    ?? null;
    this.idInscripcion = data.idInscripcion ?? null;
    this.idNivel       = data.idNivel       ?? null;
    this.observaciones = data.observaciones ?? null;
    this.fecha         = data.fecha         ?? null;
  }

  /** Inserta un nuevo registro de progreso. */
  async save(): Promise<this> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `INSERT INTO Progreso_Oceanica
           (ID_Inscripcion, ID_Nivel, Observaciones, Fecha)
         VALUES
           (:idInscripcion, :idNivel, :observaciones, :fecha)
         RETURNING ID_Progreso INTO :idProgreso`,
        {
          idInscripcion: this.idInscripcion,
          idNivel:       this.idNivel,
          observaciones: this.observaciones,
          fecha:         this.fecha,
          idProgreso: {
            dir:  oracledb.BIND_OUT,
            type: oracledb.NUMBER,
          },
        },
        { autoCommit: true }
      );
      const outBinds = result.outBinds as { idProgreso: number[] };
      this.idProgreso = outBinds.idProgreso[0];
      return this;
    } finally {
      await connection.close();
    }
  }

  /** Actualiza las observaciones de un registro de progreso. */
  async update(): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(
        `UPDATE Progreso_Oceanica
         SET ID_Nivel = :idNivel, Observaciones = :observaciones, Fecha = :fecha
         WHERE ID_Progreso = :idProgreso`,
        {
          idNivel:       this.idNivel,
          observaciones: this.observaciones,
          fecha:         this.fecha,
          idProgreso:    this.idProgreso,
        },
        { autoCommit: true }
      );
    } finally {
      await connection.close();
    }
  }

  /** Retorna progresos por ID de inscripción. */
  static async findByInscripcionId(inscripcionId: number): Promise<Progreso[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT p.ID_Progreso, p.ID_Inscripcion, p.ID_Nivel,
                p.Observaciones, p.Fecha, n.Nombre AS Nombre_Nivel
         FROM Progreso_Oceanica p
         LEFT JOIN Nivel_Oceanica n ON p.ID_Nivel = n.ID_Nivel
         WHERE p.ID_Inscripcion = :inscripcionId
         ORDER BY p.Fecha DESC`,
        { inscripcionId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => {
        const prog = new Progreso({
          idProgreso:    row.ID_PROGRESO,
          idInscripcion: row.ID_INSCRIPCION,
          idNivel:       row.ID_NIVEL,
          observaciones: row.OBSERVACIONES,
          fecha:         row.FECHA,
        });
        (prog as any).nombreNivel = row.NOMBRE_NIVEL;
        return prog;
      });
    } finally {
      await connection.close();
    }
  }

  /**
   * Retorna todos los progresos de un estudiante
   * a través de sus inscripciones.
   */
  static async findByEstudianteId(idEstudiante: number): Promise<Progreso[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT p.ID_Progreso, p.ID_Inscripcion, p.ID_Nivel,
                p.Observaciones, p.Fecha, n.Nombre AS Nombre_Nivel
         FROM Progreso_Oceanica p
         JOIN Inscripcion_Oceanica i ON p.ID_Inscripcion = i.ID_Inscripcion
         LEFT JOIN Nivel_Oceanica n ON p.ID_Nivel = n.ID_Nivel
         WHERE i.ID_Estudiante = :idEstudiante
         ORDER BY p.Fecha DESC`,
        { idEstudiante },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => {
        const prog = new Progreso({
          idProgreso:    row.ID_PROGRESO,
          idInscripcion: row.ID_INSCRIPCION,
          idNivel:       row.ID_NIVEL,
          observaciones: row.OBSERVACIONES,
          fecha:         row.FECHA,
        });
        (prog as any).nombreNivel = row.NOMBRE_NIVEL;
        return prog;
      });
    } finally {
      await connection.close();
    }
  }
}