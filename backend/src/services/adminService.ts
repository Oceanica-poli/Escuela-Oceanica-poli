const { Clase } = require('../repositories/claseRepository');
const { Nivel } = require('../repositories/nivelRepository');
const { User } = require('../repositories/userRepository');
const { Sesion } = require('../repositories/sesionRepository');
const { Asistencia } = require('../repositories/asistenciaRepository');
const { Progreso } = require('../repositories/progresoRepository');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ success: false, message: 'Error al crear usuario' });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    Object.assign(user, req.body);
    await user.save();
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOneById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    await user.delete();
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
  }
};

// Get all classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Clase.findAll();
    res.json(classes);
  } catch (error) {
    console.error('Error al obtener clases:', error);
    res.status(500).json({ success: false, message: 'Error al obtener clases' });
  }
};

// Create a new class
const createClass = async (req, res) => {
  try {
    const classEntity = new Clase(req.body);
    await classEntity.save();
    res.status(201).json({ message: 'Clase creada exitosamente' });
  } catch (error) {
    console.error('Error al crear clase:', error);
    res.status(500).json({ success: false, message: 'Error al crear clase' });
  }
};

// Update a class
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const classEntity = await Clase.findOneById(id);
    if (!classEntity) {
      return res.status(404).json({ success: false, message: 'Clase no encontrada' });
    }
    Object.assign(classEntity, req.body);
    await classEntity.save();
    res.json({ message: 'Clase actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar clase:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar clase' });
  }
};

// Delete a class
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const classEntity = await Clase.findOneById(id);
    if (!classEntity) {
      return res.status(404).json({ success: false, message: 'Clase no encontrada' });
    }
    await classEntity.delete();
    res.json({ message: 'Clase eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar clase:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar clase' });
  }
};

// Get all levels
const getAllLevels = async (req, res) => {
  try {
    const levels = await Nivel.findAll();
    res.json(levels);
  } catch (error) {
    console.error('Error al obtener niveles:', error);
    res.status(500).json({ success: false, message: 'Error al obtener niveles' });
  }
};

// Create a new level
const createLevel = async (req, res) => {
  try {
    const levelEntity = new Nivel(req.body);
    await levelEntity.save();
    res.status(201).json({ message: 'Nivel creado exitosamente' });
  } catch (error) {
    console.error('Error al crear nivel:', error);
    res.status(500).json({ success: false, message: 'Error al crear nivel' });
  }
};

// Update a level
const updateLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const levelEntity = await Nivel.findOneById(id);
    if (!levelEntity) {
      return res.status(404).json({ success: false, message: 'Nivel no encontrado' });
    }
    Object.assign(levelEntity, req.body);
    await levelEntity.save();
    res.json({ message: 'Nivel actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar nivel:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar nivel' });
  }
};

// Get user attendance
const getUserAttendance = async (req, res) => {
  try {
    const { userId } = req.params;
    const attendance = await Asistencia.findByUserId(userId);
    res.json(attendance);
  } catch (error) {
    console.error('Error al obtener asistencia:', error);
    res.status(500).json({ success: false, message: 'Error al obtener asistencia' });
  }
};

// Get user progress
const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progreso.findByUserId(userId);
    res.json(progress);
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    res.status(500).json({ success: false, message: 'Error al obtener progreso' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllClasses,
  createClass,
  updateClass,
  deleteClass,
  getAllLevels,
  createLevel,
  updateLevel,
  getUserAttendance,
  getUserProgress
};