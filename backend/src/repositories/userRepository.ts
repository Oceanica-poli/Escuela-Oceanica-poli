import oracledb from 'oracledb';
import { getConnection } from '../db/connection';

export interface UserData {
  idUsuario?: number | null;
  idPerfil?: number | null;
  idSexo?: number | null;
  nombres?: string;
  primerApellido?: string;
  segundoApellido?: string | null;
  fechaNac?: Date | null;
  correo?: string;
  passwordHash?: string;
  telefono?: string | null;
  celular?: string | null;
  direccion?: string | null;
}

export class User {
  idUsuario: number | null;
  idPerfil: number | null;
  idSexo: number | null;
  nombres: string;
  primerApellido: string;
  segundoApellido: string | null;
  fechaNac: Date | null;
  correo: string;
  passwordHash: string;
  telefono: string | null;
  celular: string | null;
  direccion: string | null;

  constructor(data: UserData) {
    this.idUsuario     = data.idUsuario     ?? null;
    this.idPerfil      = data.idPerfil      ?? null;
    this.idSexo        = data.idSexo        ?? null;
    this.nombres       = data.nombres       ?? '';
    this.primerApellido = data.primerApellido ?? '';
    this.segundoApellido = data.segundoApellido ?? null;
    this.fechaNac      = data.fechaNac      ?? null;
    this.correo        = data.correo        ?? '';
    this.passwordHash  = data.passwordHash  ?? '';
    this.telefono      = data.telefono      ?? null;
    this.celular       = data.celular       ?? null;
    this.direccion     = data.direccion     ?? null;
  }

  async save(): Promise<this> {
    const connection = await getConnection();
    try {
      const query = `
        INSERT INTO Usuario_Oceanica (
          ID_Perfil, ID_Sexo, Nombres, Primer_Apellido,
          Segundo_Apellido, Fecha_Nac, Correo, Password_Hash,
          Telefono, Celular, Direccion
        ) VALUES (
          :idPerfil, :idSexo, :nombres, :primerApellido,
          :segundoApellido, :fechaNac, :correo, :passwordHash,
          :telefono, :celular, :direccion
        ) RETURNING ID_Usuario INTO :idUsuario
      `;
      const result = await connection.execute(query, {
        idPerfil:        this.idPerfil,
        idSexo:          this.idSexo,
        nombres:         this.nombres,
        primerApellido:  this.primerApellido,
        segundoApellido: this.segundoApellido,
        fechaNac:        this.fechaNac,
        correo:          this.correo,
        passwordHash:    this.passwordHash,
        telefono:        this.telefono,
        celular:         this.celular,
        direccion:       this.direccion,
        idUsuario: {
          dir:  oracledb.BIND_OUT,
          type: oracledb.NUMBER,
        },
      }, { autoCommit: true });

      const outBinds = result.outBinds as { idUsuario: number[] };
      this.idUsuario = outBinds.idUsuario[0];
      return this;
    } finally {
      await connection.close();
    }
  }

  /** Busca un usuario por correo. Retorna null si no existe. */
  static async findByCorreo(correo: string): Promise<User | null> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT ID_Usuario, ID_Perfil, ID_Sexo, Nombres, Primer_Apellido,
                Segundo_Apellido, Fecha_Nac, Correo, Password_Hash,
                Telefono, Celular, Direccion
         FROM Usuario_Oceanica
         WHERE Correo = :correo`,
        { correo },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows || result.rows.length === 0) return null;
      const row: any = result.rows[0];
      return new User({
        idUsuario:       row.ID_USUARIO,
        idPerfil:        row.ID_PERFIL,
        idSexo:          row.ID_SEXO,
        nombres:         row.NOMBRES,
        primerApellido:  row.PRIMER_APELLIDO,
        segundoApellido: row.SEGUNDO_APELLIDO,
        fechaNac:        row.FECHA_NAC,
        correo:          row.CORREO,
        passwordHash:    row.PASSWORD_HASH,
        telefono:        row.TELEFONO,
        celular:         row.CELULAR,
        direccion:       row.DIRECCION,
      });
    } finally {
      await connection.close();
    }
  }

  /** Busca un usuario por ID. Retorna null si no existe. */
  static async findById(id: number): Promise<User | null> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT ID_Usuario, ID_Perfil, ID_Sexo, Nombres, Primer_Apellido,
                Segundo_Apellido, Fecha_Nac, Correo, Password_Hash,
                Telefono, Celular, Direccion
         FROM Usuario_Oceanica
         WHERE ID_Usuario = :id`,
        { id },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows || result.rows.length === 0) return null;
      const row: any = result.rows[0];
      return new User({
        idUsuario:       row.ID_USUARIO,
        idPerfil:        row.ID_PERFIL,
        idSexo:          row.ID_SEXO,
        nombres:         row.NOMBRES,
        primerApellido:  row.PRIMER_APELLIDO,
        segundoApellido: row.SEGUNDO_APELLIDO,
        fechaNac:        row.FECHA_NAC,
        correo:          row.CORREO,
        passwordHash:    row.PASSWORD_HASH,
        telefono:        row.TELEFONO,
        celular:         row.CELULAR,
        direccion:       row.DIRECCION,
      });
    } finally {
      await connection.close();
    }
  }

  /** Retorna todos los usuarios. */
  static async findAll(): Promise<User[]> {
    const connection = await getConnection();
    try {
      const result = await connection.execute(
        `SELECT ID_Usuario, ID_Perfil, ID_Sexo, Nombres, Primer_Apellido,
                Segundo_Apellido, Fecha_Nac, Correo, Password_Hash,
                Telefono, Celular, Direccion
         FROM Usuario_Oceanica
         ORDER BY ID_Usuario`,
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      if (!result.rows) return [];
      return (result.rows as any[]).map(row => new User({
        idUsuario:       row.ID_USUARIO,
        idPerfil:        row.ID_PERFIL,
        idSexo:          row.ID_SEXO,
        nombres:         row.NOMBRES,
        primerApellido:  row.PRIMER_APELLIDO,
        segundoApellido: row.SEGUNDO_APELLIDO,
        fechaNac:        row.FECHA_NAC,
        correo:          row.CORREO,
        passwordHash:    row.PASSWORD_HASH,
        telefono:        row.TELEFONO,
        celular:         row.CELULAR,
        direccion:       row.DIRECCION,
      }));
    } finally {
      await connection.close();
    }
  }

  /** Actualiza los datos del usuario en BD. */
  async update(): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(
        `UPDATE Usuario_Oceanica SET
           ID_Perfil        = :idPerfil,
           ID_Sexo          = :idSexo,
           Nombres          = :nombres,
           Primer_Apellido  = :primerApellido,
           Segundo_Apellido = :segundoApellido,
           Fecha_Nac        = :fechaNac,
           Correo           = :correo,
           Telefono         = :telefono,
           Celular          = :celular,
           Direccion        = :direccion
         WHERE ID_Usuario = :idUsuario`,
        {
          idPerfil:        this.idPerfil,
          idSexo:          this.idSexo,
          nombres:         this.nombres,
          primerApellido:  this.primerApellido,
          segundoApellido: this.segundoApellido,
          fechaNac:        this.fechaNac,
          correo:          this.correo,
          telefono:        this.telefono,
          celular:         this.celular,
          direccion:       this.direccion,
          idUsuario:       this.idUsuario,
        },
        { autoCommit: true }
      );
    } finally {
      await connection.close();
    }
  }

  /** Elimina el usuario de la BD. */
  async delete(): Promise<void> {
    const connection = await getConnection();
    try {
      await connection.execute(
        `DELETE FROM Usuario_Oceanica WHERE ID_Usuario = :idUsuario`,
        { idUsuario: this.idUsuario },
        { autoCommit: true }
      );
    } finally {
      await connection.close();
    }
  }
}