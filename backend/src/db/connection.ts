import oracledb from 'oracledb';
import dotenv from 'dotenv';

dotenv.config();

// En Linux/Mac, el cliente Instant Client puede necesitar este modo
// oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient' });

let pool: oracledb.Pool;

/**
 * Inicializa el pool de conexiones Oracle.
 * Debe llamarse UNA sola vez al arrancar el servidor.
 */
export const initPool = async (): Promise<void> => {
  try {
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
      poolTimeout: 60,
    });
    console.log('Pool de conexiones Oracle creado exitosamente');
  } catch (error) {
    console.error('Error al crear el pool de Oracle:', error);
    throw error;
  }
};

/**
 * Obtiene una conexión del pool.
 * Siempre libera la conexión en un bloque finally.
 */
export const getConnection = async (): Promise<oracledb.Connection> => {
  if (!pool) {
    throw new Error('El pool de Oracle no ha sido inicializado. Llama a initPool() primero.');
  }
  return pool.getConnection();
};

/**
 * Cierra el pool al apagar el servidor (opcional pero recomendado).
 */
export const closePool = async (): Promise<void> => {
  if (pool) {
    try {
      await pool.close(10);
      console.log('Pool de Oracle cerrado correctamente');
    } catch (error) {
      console.error('Error al cerrar el pool:', error);
    }
  }
};