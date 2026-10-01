import oracledb from 'oracledb';
import { getConnection } from '../db/connection';

export interface SesionData {
  idSesion?:    number | null;
  idClase?:     number | null;
  idProfesor?:  number | null;
  fecha?:       Date | null;
  horaInicio?:  string | null;
  horaFin?:     string | null;
  estado?:      'Programada' | 'Realizada' | 'Cancelada';
}

export class Sesion {
  idSesion:   number | null;
  idClase:    number | null;
  idProfesor: number | null;
  fecha:      Date | null;
  horaInicio: string | null;
  horaFin:    string | null;
  estado:     'Programada' | 'Realizada' | 'Cancelada';

  constructor(data: SesionData) {
    this.idSesion   = data.idSesion   ?? null;
    this.idClase    = data.idClase    ?? null;
    this.idProfesor = data.idProfesor ?? null;
    this.fecha      = data.fecha      ?? null;
    this.horaInicio = data.horaInicio ?? null;
    this.horaFin    = data.horaFin    ?? null;
    this.estado     = data.estado     ?? 'Programada';
  }

  /** Inserta una nueva sesión. */
  async save(): Promise<this> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `INSERT INTO Sesion_Clase_Oceanica
           (ID_Clase, ID_Profesor, Fecha, Hora_Inicio, Hora_Fin, Estado)
         VALUES
           (:idClase, :idProfesor, :fecha, :horaInicio, :horaFin, :estado)
         RETURNING ID_Sesion INTO :idSesion`,
        {
          idClase:    this.idClase,
          idProfesor: this.idProfesor,
          fecha:      this.fecha,
          horaInicio: this.horaInicio,
          horaFin:    this.horaFin,
          estado:     this.estado,
          idSesion: {
            dir:  oracledb.BIND_OUT,
            type: oracledb.NUMBER,
          },
        },
        { autoCommit: true }
      );
      const outBinds = result.outBinds as { idSesion: number[] };
      this.idSesion = outBinds.idSesion[0];
      return this;
    } finally {
      await connection.close();
    }
  }

  /** Actualiza el estado de una sesión. */
  async updateEstado(nuevoEstado: 'Programada' | 'Realizada' | 'Cancelada'): Promise<void> {
    const connection = await getConnection();
    try {
      this.estado = nuevoEstado;
      await connection.execute(
        `UPDATE Sesion_Clase_Oceanica
         SET Estado = :estado
         WHERE ID_Sesion = :idSesion`,
        { estado: this.estado, idSesion: this.idSesion },
        { autoCommit: true }
      );
    } finally {
      await connection.close();
    }
  }

  /** Retorna todas las sesiones (para el admin). */
  static async findAll(): Promise<Sesion[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT s.ID_Sesion, s.ID_Clase, s.ID_Profesor, s.Fecha,
                s.Hora_Inicio, s.Hora_Fin, s.Estado,
                c.Nombre AS Nombre_Clase
         FROM Sesion_Clase_Oceanica s
         JOIN Clase_Oceanica c ON s.ID_Clase = c.ID_Clase
         ORDER BY s.Fecha DESC, s.Hora_Inicio`,
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => {
        const ses = new Sesion({
          idSesion:   row.ID_SESION,
          idClase:    row.ID_CLASE,
          idProfesor: row.ID_PROFESOR,
          fecha:      row.FECHA,
          horaInicio: row.HORA_INICIO,
          horaFin:    row.HORA_FIN,
          estado:     row.ESTADO,
        });
        (ses as any).nombreClase = row.NOMBRE_CLASE;
        return ses;
      });
    } finally {
      await connection.close();
    }
  }

  /** Retorna las sesiones de una clase específica. */
  static async findByClaseId(idClase: number): Promise<Sesion[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT ID_Sesion, ID_Clase, ID_Profesor, Fecha,
                Hora_Inicio, Hora_Fin, Estado
         FROM Sesion_Clase_Oceanica
         WHERE ID_Clase = :idClase
         ORDER BY Fecha DESC, Hora_Inicio`,
        { idClase },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => new Sesion({
        idSesion:   row.ID_SESION,
        idClase:    row.ID_CLASE,
        idProfesor: row.ID_PROFESOR,
        fecha:      row.FECHA,
        horaInicio: row.HORA_INICIO,
        horaFin:    row.HORA_FIN,
        estado:     row.ESTADO,
      }));
    } finally {
      await connection.close();
    }
  }

  /**
   * Retorna las sesiones asignadas a un profesor.
   * Este método faltaba y causaba crash en profesorService.
   */
  static async findByProfesorId(idProfesor: number): Promise<Sesion[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT s.ID_Sesion, s.ID_Clase, s.ID_Profesor, s.Fecha,
                s.Hora_Inicio, s.Hora_Fin, s.Estado,
                c.Nombre AS Nombre_Clase
         FROM Sesion_Clase_Oceanica s
         JOIN Clase_Oceanica c ON s.ID_Clase = c.ID_Clase
         WHERE s.ID_Profesor = :idProfesor
         ORDER BY s.Fecha DESC, s.Hora_Inicio`,
        { idProfesor },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => {
        const ses = new Sesion({
          idSesion:   row.ID_SESION,
          idClase:    row.ID_CLASE,
          idProfesor: row.ID_PROFESOR,
          fecha:      row.FECHA,
          horaInicio: row.HORA_INICIO,
          horaFin:    row.HORA_FIN,
          estado:     row.ESTADO,
        });
        (ses as any).nombreClase = row.NOMBRE_CLASE;
        return ses;
      });
    } finally {
      await connection.close();
    }
  }
}