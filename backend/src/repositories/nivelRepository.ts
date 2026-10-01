import oracledb from 'oracledb';
import { getConnection } from '../db/connection';

export interface NivelData {
  idNivel?:     number | null;
  nombre?:      string;
  descripcion?: string | null;
  clasesMin?:   number;
}

export class Nivel {
  idNivel:     number | null;
  nombre:      string;
  descripcion: string | null;
  clasesMin:   number;

  constructor(data: NivelData) {
    this.idNivel     = data.idNivel     ?? null;
    this.nombre      = data.nombre      ?? '';
    this.descripcion = data.descripcion ?? null;
    this.clasesMin   = data.clasesMin   ?? 0;
  }

  /** Inserta un nuevo nivel. */
  async save(): Promise<this> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `INSERT INTO Nivel_Oceanica (Nombre, Descripcion, Clases_Min)
         VALUES (:nombre, :descripcion, :clasesMin)
         RETURNING ID_Nivel INTO :idNivel`,
        {
          nombre:      this.nombre,
          descripcion: this.descripcion,
          clasesMin:   this.clasesMin,
          idNivel: {
            dir:  oracledb.BIND_OUT,
            type: oracledb.NUMBER,
          },
        },
        { autoCommit: true }
      );
      const outBinds = result.outBinds as { idNivel: number[] };
      this.idNivel = outBinds.idNivel[0];
      return this;
    } finally {
      await connection.close();
    }
  }

  /** Actualiza un nivel existente. */
  async update(): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(
        `UPDATE Nivel_Oceanica
         SET Nombre = :nombre, Descripcion = :descripcion, Clases_Min = :clasesMin
         WHERE ID_Nivel = :idNivel`,
        {
          nombre:      this.nombre,
          descripcion: this.descripcion,
          clasesMin:   this.clasesMin,
          idNivel:     this.idNivel,
        },
        { autoCommit: true }
      );
    } finally {
      await connection.close();
    }
  }

  /** Elimina el nivel. */
  async delete(): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(
        `DELETE FROM Nivel_Oceanica WHERE ID_Nivel = :idNivel`,
        { idNivel: this.idNivel },
        { autoCommit: true }
      );
    } finally {
      await connection.close();
    }
  }

  /** Retorna todos los niveles. */
  static async findAll(): Promise<Nivel[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT ID_Nivel, Nombre, Descripcion, Clases_Min
         FROM Nivel_Oceanica
         ORDER BY ID_Nivel`,
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => new Nivel({
        idNivel:     row.ID_NIVEL,
        nombre:      row.NOMBRE,
        descripcion: row.DESCRIPCION,
        clasesMin:   row.CLASES_MIN,
      }));
    } finally {
      await connection.close();
    }
  }

  /** Busca un nivel por ID. Retorna null si no existe. */
  static async findById(id: number): Promise<Nivel | null> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT ID_Nivel, Nombre, Descripcion, Clases_Min
         FROM Nivel_Oceanica
         WHERE ID_Nivel = :id`,
        { id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows || result.rows.length === 0) return null;
      const row: any = result.rows[0];
      return new Nivel({
        idNivel:     row.ID_NIVEL,
        nombre:      row.NOMBRE,
        descripcion: row.DESCRIPCION,
        clasesMin:   row.CLASES_MIN,
      });
    } finally {
      await connection.close();
    }
  }
}