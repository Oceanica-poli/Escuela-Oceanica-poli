import oracledb from 'oracledb';
import { getConnection } from '../db/connection';

export interface InscripcionData {
  idInscripcion?:   number | null;
  idEstudiante?:    number | null;
  idClase?:         number | null;
  fechaInicio?:     Date | null;
  estado?:          'Pendiente' | 'Activa' | 'Completada' | 'Cancelada';
  idSexoProfPref?:  number | null;
}

export class Inscripcion {
  idInscripcion:   number | null;
  idEstudiante:    number | null;
  idClase:         number | null;
  fechaInicio:     Date | null;
  estado:          'Pendiente' | 'Activa' | 'Completada' | 'Cancelada';
  idSexoProfPref:  number | null;

  constructor(data: InscripcionData) {
    this.idInscripcion  = data.idInscripcion  ?? null;
    this.idEstudiante   = data.idEstudiante   ?? null;
    this.idClase        = data.idClase        ?? null;
    this.fechaInicio    = data.fechaInicio    ?? null;
    this.estado         = data.estado         ?? 'Pendiente';
    this.idSexoProfPref = data.idSexoProfPref ?? null;
  }

  /** Inserta una nueva inscripción. */
  async save(): Promise<this> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `INSERT INTO Inscripcion_Oceanica
           (ID_Estudiante, ID_Clase, Fecha_Inicio, Estado, ID_Sexo_Prof_Pref)
         VALUES
           (:idEstudiante, :idClase, :fechaInicio, :estado, :idSexoProfPref)
         RETURNING ID_Inscripcion INTO :idInscripcion`,
        {
          idEstudiante:   this.idEstudiante,
          idClase:        this.idClase,
          fechaInicio:    this.fechaInicio,
          estado:         this.estado,
          idSexoProfPref: this.idSexoProfPref,
          idInscripcion: {
            dir:  oracledb.BIND_OUT,
            type: oracledb.NUMBER,
          },
        },
        { autoCommit: true }
      );
      const outBinds = result.outBinds as { idInscripcion: number[] };
      this.idInscripcion = outBinds.idInscripcion[0];
      return this;
    } finally {
      await connection.close();
    }
  }

  /** Actualiza el estado de la inscripción. */
  async updateEstado(nuevoEstado: 'Pendiente' | 'Activa' | 'Completada' | 'Cancelada'): Promise<void> {
    const connection = await getConnection();
    try {
      this.estado = nuevoEstado;
      await connection.execute(
        `UPDATE Inscripcion_Oceanica
         SET Estado = :estado
         WHERE ID_Inscripcion = :idInscripcion`,
        { estado: this.estado, idInscripcion: this.idInscripcion },
        { autoCommit: true }
      );
    } finally {
      await connection.close();
    }
  }

  /** Retorna todas las inscripciones de un estudiante. */
  static async findByEstudianteId(idEstudiante: number): Promise<Inscripcion[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT i.ID_Inscripcion, i.ID_Estudiante, i.ID_Clase,
                i.Fecha_Inicio, i.Estado, i.ID_Sexo_Prof_Pref,
                c.Nombre AS Nombre_Clase, n.Nombre AS Nombre_Nivel
         FROM Inscripcion_Oceanica i
         JOIN Clase_Oceanica c ON i.ID_Clase = c.ID_Clase
         LEFT JOIN Nivel_Oceanica n ON c.ID_Nivel = n.ID_Nivel
         WHERE i.ID_Estudiante = :idEstudiante
         ORDER BY i.ID_Inscripcion`,
        { idEstudiante },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => {
        const ins = new Inscripcion({
          idInscripcion:  row.ID_INSCRIPCION,
          idEstudiante:   row.ID_ESTUDIANTE,
          idClase:        row.ID_CLASE,
          fechaInicio:    row.FECHA_INICIO,
          estado:         row.ESTADO,
          idSexoProfPref: row.ID_SEXO_PROF_PREF,
        });
        (ins as any).nombreClase = row.NOMBRE_CLASE;
        (ins as any).nombreNivel = row.NOMBRE_NIVEL;
        return ins;
      });
    } finally {
      await connection.close();
    }
  }

  /** Busca una inscripción específica de un estudiante en una clase. */
  static async findByEstudianteYClase(idEstudiante: number, idClase: number): Promise<Inscripcion | null> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT ID_Inscripcion, ID_Estudiante, ID_Clase,
                Fecha_Inicio, Estado, ID_Sexo_Prof_Pref
         FROM Inscripcion_Oceanica
         WHERE ID_Estudiante = :idEstudiante AND ID_Clase = :idClase`,
        { idEstudiante, idClase },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows || result.rows.length === 0) return null;
      const row: any = result.rows[0];
      return new Inscripcion({
        idInscripcion:  row.ID_INSCRIPCION,
        idEstudiante:   row.ID_ESTUDIANTE,
        idClase:        row.ID_CLASE,
        fechaInicio:    row.FECHA_INICIO,
        estado:         row.ESTADO,
        idSexoProfPref: row.ID_SEXO_PROF_PREF,
      });
    } finally {
      await connection.close();
    }
  }

  /** Retorna todas las inscripciones (para el admin). */
  static async findAll(): Promise<Inscripcion[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT i.ID_Inscripcion, i.ID_Estudiante, i.ID_Clase,
                i.Fecha_Inicio, i.Estado, i.ID_Sexo_Prof_Pref,
                c.Nombre AS Nombre_Clase
         FROM Inscripcion_Oceanica i
         JOIN Clase_Oceanica c ON i.ID_Clase = c.ID_Clase
         ORDER BY i.ID_Inscripcion`,
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => {
        const ins = new Inscripcion({
          idInscripcion:  row.ID_INSCRIPCION,
          idEstudiante:   row.ID_ESTUDIANTE,
          idClase:        row.ID_CLASE,
          fechaInicio:    row.FECHA_INICIO,
          estado:         row.ESTADO,
          idSexoProfPref: row.ID_SEXO_PROF_PREF,
        });
        (ins as any).nombreClase = row.NOMBRE_CLASE;
        return ins;
      });
    } finally {
      await connection.close();
    }
  }
}