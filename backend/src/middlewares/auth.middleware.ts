const jwt = require('jsonwebtoken');
const { validateJWT } = require('../services/authService');

// Middleware para verificar el JWT
const authenticateUser = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }
  try {
    const decoded = validateJWT(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar el rol
const verifyRole = (roles: number[]) => {
  return (req: any, res: any, next: any) => {
    const userRoles = [req.user.idPerfil];
    if (!roles.includes(userRoles[0])) {
      return res.status(403).json({ success: false, message: 'Rol no permitido' });
    }
    next();
  };
};

module.exports = { authenticateUser, verifyRole };