const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, updateUser, deleteUser, getAllClasses, createClass, updateClass, deleteClass, getAllLevels, createLevel, updateLevel, getUserAttendance, getUserProgress } = require('../services/adminService');

// Routes for admin functionality
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/classes', getAllClasses);
router.post('/classes', createClass);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);

router.get('/levels', getAllLevels);
router.post('/levels', createLevel);
router.put('/levels/:id', updateLevel);

router.get('/attendance/:userId', getUserAttendance);
router.get('/progress/:userId', getUserProgress);

module.exports = router;