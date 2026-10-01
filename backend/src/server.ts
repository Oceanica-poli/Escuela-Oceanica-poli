import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initPool } from './db/connection';

// Variables de entorno — debe ir PRIMERO
dotenv.config();

// Importar rutas
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import estudianteRoutes from './routes/estudiante.routes';
import profesorRoutes from './routes/profesor.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// 1. CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// 2. Parsear JSON
app.use(express.json());

// 3. Ruta de verificación de estado
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 4. Rutas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/estudiante', estudianteRoutes);
app.use('/api/profesor', profesorRoutes);

// 5. Middleware de errores globales
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Errores ORA-20XXX de triggers de Oracle
  const oraMessages: Record<string, string> = {
    '20010': 'Solo los profesores pueden ser asignados a una sesión.',
    '20011': 'Solo los estudiantes pueden inscribirse en una clase.',
    '20012': 'La preferencia de sexo del profesor no coincide.',
    '20013': 'El profesor ya tiene una sesión programada en ese horario.',
    '20014': 'El cupo máximo de la clase ha sido alcanzado.',
  };

  if (err && err.errorNum) {
    const code = String(err.errorNum);
    if (oraMessages[code]) {
      return res.status(400).json({ success: false, message: oraMessages[code] });
    }
  }

  console.error('Error interno:', err);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

// 6. Iniciar servidor — primero abre el pool de Oracle
const start = async () => {
  try {
    await initPool();
    app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err);
    process.exit(1);
  }
};

start();
