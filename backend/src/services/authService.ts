import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../repositories/userRepository';

const JWT_SECRET  = process.env.JWT_SECRET  || 'tu_secreto_largo_para_jwt';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '8h';

/** Valida y decodifica un JWT. Lanza error si es inválido. */
export const validateJWT = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

/** POST /api/auth/register */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nombres, primerApellido, segundoApellido,
      correo, password, idPerfil, idSexo,
      fechaNac, telefono, celular, direccion,
    } = req.body;

    // Verificar si el correo ya existe
    const existing = await User.findByCorreo(correo);
    if (existing) {
      res.status(409).json({ success: false, message: 'El correo ya está registrado' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      nombres,
      primerApellido,
      segundoApellido:  segundoApellido  ?? null,
      correo,
      passwordHash,
      idPerfil:         idPerfil         ?? 3, // 3 = Estudiante por defecto
      idSexo:           idSexo           ?? null,
      fechaNac:         fechaNac         ? new Date(fechaNac) : null,
      telefono:         telefono         ?? null,
      celular:          celular          ?? null,
      direccion:        direccion        ?? null,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      idUsuario: user.idUsuario,
    });
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al registrar usuario' });
  }
};

/** POST /api/auth/login */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos' });
      return;
    }

    // Corregido: se pasa el string directamente, no un objeto
    const user = await User.findByCorreo(correo);
    if (!user) {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign(
      {
        idUsuario: user.idUsuario,
        idPerfil:  user.idPerfil,
        nombres:   user.nombres,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    res.json({
      success: true,
      token,
      user: {
        idUsuario:      user.idUsuario,
        idPerfil:       user.idPerfil,
        nombres:        user.nombres,
        primerApellido: user.primerApellido,
        correo:         user.correo,
      },
    });
  } catch (error: any) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión' });
  }
};

/** GET /api/auth/user — Retorna el perfil del usuario autenticado desde el JWT */
export const getAuthUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // El middleware auth.middleware.ts ya dejó el payload en req.user
    const payload = (req as any).user;
    if (!payload?.idUsuario) {
      res.status(401).json({ success: false, message: 'No autenticado' });
      return;
    }

    const user = await User.findById(payload.idUsuario);
    if (!user) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    res.json({
      success: true,
      user: {
        idUsuario:       user.idUsuario,
        idPerfil:        user.idPerfil,
        nombres:         user.nombres,
        primerApellido:  user.primerApellido,
        segundoApellido: user.segundoApellido,
        correo:          user.correo,
        telefono:        user.telefono,
        celular:         user.celular,
        direccion:       user.direccion,
      },
    });
  } catch (error: any) {
    console.error('Error al obtener usuario autenticado:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};