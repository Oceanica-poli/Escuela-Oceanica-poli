const express = require('express');
const router = express.Router();
const { getAvailableClasses, enrollInClass, withdrawFromClass, getStudentInscriptions, getStudentAttendance, getStudentProgress } = require('../services/estudianteService');

// Routes for estudiante functionality
router.get('/classes', getAvailableClasses);
router.post('/classes/:classId', enrollInClass);
router.delete('/classes/:classId', withdrawFromClass);
router.get('/inscriptions', getStudentInscriptions);
router.get('/attendance', getStudentAttendance);
router.get('/progress', getStudentProgress);

module.exports = router;