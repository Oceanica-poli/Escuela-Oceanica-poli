const express = require('express');
const router = express.Router();
const { getUserClasses, registerAttendance, getStudentProgress, updateStudentProgress } = require('../services/profesorService');

// Routes for profesor functionality
router.get('/classes/:profesorId', getUserClasses);
router.post('/attendance', registerAttendance);
router.get('/progress/:studentId', getStudentProgress);
router.put('/progress/:studentId', updateStudentProgress);

module.exports = router;