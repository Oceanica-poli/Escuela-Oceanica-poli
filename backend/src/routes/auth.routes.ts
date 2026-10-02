import { Router } from 'express';
import { registerUser, loginUser, getAuthUser } from '../services/authService';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Rutas públicas
router.post('/register', registerUser);
router.post('/login',    loginUser);

// Ruta protegida — devuelve el perfil del usuario autenticado
// El frontend la llama al recargar para rehidratar la sesión
router.get('/user', verifyToken, getAuthUser);

export default router;