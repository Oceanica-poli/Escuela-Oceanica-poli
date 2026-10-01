import oracledb from 'oracledb';
import { getConnection } from '../db/connection';

export interface ClaseData {
  idClase?:     number | null;
  idNivel?:     number | null;
  nombre?:      string;
  cupoMaximo?:  number;
}

export class Clase {
  idClase:    number | null;
  idNivel:    number | null;
  nombre:     string;
  cupoMaximo: number;

  constructor(data: ClaseData) {
    this.idClase    = data.idClase    ?? null;
    this.idNivel    = data.idNivel    ?? null;
    this.nombre     = data.nombre     ?? '';
    this.cupoMaximo = data.cupoMaximo ?? 0;
  }

  /** Inserta una nueva clase en BD. */
  async save(): Promise<this> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `INSERT INTO Clase_Oceanica (ID_Nivel, Nombre, Cupo_Maximo)
         VALUES (:idNivel, :nombre, :cupoMaximo)
         RETURNING ID_Clase INTO :idClase`,
        {
          idNivel:    this.idNivel,
          nombre:     this.nombre,
          cupoMaximo: this.cupoMaximo,
          idClase: {
            dir:  oracledb.BIND_OUT,
            type: oracledb.NUMBER,
          },
        },
        { autoCommit: true }
      );
      const outBinds = result.outBinds as { idClase: number[] };
      this.idClase = outBinds.idClase[0];
      return this;
    } finally {
      await connection.close();
    }
  }

  /** Actualiza una clase existente. */
  async update(): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(
        `UPDATE Clase_Oceanica
         SET ID_Nivel = :idNivel, Nombre = :nombre, Cupo_Maximo = :cupoMaximo
         WHERE ID_Clase = :idClase`,
        {
          idNivel:    this.idNivel,
          nombre:     this.nombre,
          cupoMaximo: this.cupoMaximo,
          idClase:    this.idClase,
        },
        { autoCommit: true }
      );
    } finally {
      await connection.close();
    }
  }

  /** Elimina la clase de la BD (método de instancia, no estático). */
  async delete(): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(
        `DELETE FROM Clase_Oceanica WHERE ID_Clase = :idClase`,
        { idClase: this.idClase },
        { autoCommit: true }
      );
    } finally {
      await connection.close();
    }
  }

  /** Retorna todas las clases con su nivel. */
  static async findAll(): Promise<Clase[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT c.ID_Clase, c.ID_Nivel, c.Nombre, c.Cupo_Maximo,
                n.Nombre AS Nombre_Nivel
         FROM Clase_Oceanica c
         LEFT JOIN Nivel_Oceanica n ON c.ID_Nivel = n.ID_Nivel
         ORDER BY c.ID_Clase`,
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => {
        const clase = new Clase({
          idClase:    row.ID_CLASE,
          idNivel:    row.ID_NIVEL,
          nombre:     row.NOMBRE,
          cupoMaximo: row.CUPO_MAXIMO,
        });
        (clase as any).nombreNivel = row.NOMBRE_NIVEL;
        return clase;
      });
    } finally {
      await connection.close();
    }
  }

  /** Busca una clase por ID. Retorna null si no existe. */
  static async findById(id: number): Promise<Clase | null> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT ID_Clase, ID_Nivel, Nombre, Cupo_Maximo
         FROM Clase_Oceanica
         WHERE ID_Clase = :id`,
        { id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows || result.rows.length === 0) return null;
      const row: any = result.rows[0];
      return new Clase({
        idClase:    row.ID_CLASE,
        idNivel:    row.ID_NIVEL,
        nombre:     row.NOMBRE,
        cupoMaximo: row.CUPO_MAXIMO,
      });
    } finally {
      await connection.close();
    }
  }

  /**
   * Retorna las clases con cupo disponible (cupo actual < cupo máximo).
   * Útil para la vista de clases disponibles del estudiante.
   */
  static async findDisponibles(): Promise<any[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT c.ID_Clase, c.ID_Nivel, c.Nombre, c.Cupo_Maximo,
                n.Nombre AS Nombre_Nivel,
                c.Cupo_Maximo - COUNT(i.ID_Inscripcion) AS Cupo_Disponible
         FROM Clase_Oceanica c
         LEFT JOIN Nivel_Oceanica n ON c.ID_Nivel = n.ID_Nivel
         LEFT JOIN Inscripcion_Oceanica i
           ON c.ID_Clase = i.ID_Clase AND i.Estado IN ('Activa','Pendiente')
         GROUP BY c.ID_Clase, c.ID_Nivel, c.Nombre, c.Cupo_Maximo, n.Nombre
         HAVING c.Cupo_Maximo - COUNT(i.ID_Inscripcion) > 0
         ORDER BY c.ID_Clase`,
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => ({
        idClase:         row.ID_CLASE,
        idNivel:         row.ID_NIVEL,
        nombre:          row.NOMBRE,
        cupoMaximo:      row.CUPO_MAXIMO,
        nombreNivel:     row.NOMBRE_NIVEL,
        cupoDisponible:  row.CUPO_DISPONIBLE,
      }));
    } finally {
      await connection.close();
    }
  }
}