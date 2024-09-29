<<<<<<< HEAD
const express = require('express');
const api = express.Router();
const studentController = require('../controllers/student/studentController');

api.get('/', (req, res) => {
  studentController.getAllStudents(req, res);
});

api.get('/:id', (req, res) => {
  studentController.getStudentById(req, res);
});

// router.post('/createByQuery', (req, res) => {
//   const { firstName, lastName, age } = req.query;
//   studentController.createStudent(req, res, { firstName, lastName, age });
// });

// router.post('/createByRoute/:firstName/:lastName/:age', (req, res) => {
//   const { firstName, lastName, age } = req.params;
//   studentController.createStudent(req, res, { firstName, lastName, age });
// });

// router.post('/', (req, res) => {
//   studentController.createStudent(req, res, req.body);
// });

// router.put('/:id', (req, res) => {
//   studentController.updateStudent(req, res, req.body);
// });

// router.delete('/:id', (req, res) => {
//   studentController.deleteStudent(req, res);
// });

module.exports = api;
=======
import express from 'express';
import {getAllStudents,getStudentById, updateStudent,deleteStudent,forceDelete, createStudent,restoreStudent} from '../controllers/student/studentController.js';

const router = express.Router();

/* API Routing Path
    Get /api/students/
    Get /api/students/:id
    Create /api/students/
    Update /api/students/:id
    Delete /api/students/:id
    Permanent Delete /api/students/:id (Force Delete Danger!!)
*/

// Get all students (GET /api/students/)
router.get('/', async (req, res) => {
  try {
    const data = await getAllStudents();
    res.status(200).json({ status: '200', result: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: '500', result: 'Internal Server Error' });
  }
});

// Get student by ID (GET /api/students/:id)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ status: '400', result: 'ID is required.' });
  }
  try {
    const data = await getStudentById(id);
    res.status(200).json({ status: '200', result: data });
  } catch (err) {
    res.status(500).json({ status: '500', result: 'Internal Server Error' });
  }
});

// Create a new student (POST /api/students/)
router.post('/', async (req, res) => {
  const {
    prefix_id: prefixId,
    first_name: firstName,
    last_name: lastName,
    date_of_birth: dateOfBirth,
    sex,
    curriculum_id: curriculumId,
    previous_school: previousSchool,
    address,
    telephone,
    email,
    line_id: lineId,
    status,
  } = req.body;

  const studentData = {
    prefixId,
    firstName,
    lastName,
    dateOfBirth,
    sex,
    curriculumId,
    previousSchool,
    address,
    telephone,
    email,
    lineId,
    status,
    isDelete: false,
    updatedAt: null,
    deletedAt: null,
  };

  try {
    const data = await createStudent(studentData);
    res.status(201).json({ status: 201, result: data });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error creating student', error: error.message });
  }
});

// Update student details (PUT /api/students/:id)
router.put('/:id', async (req, res) => { // Added `async`
  const { id } = req.params;
  const updateData = req.body;

  if (!id || !updateData) {
    return res.status(400).json({ code: '400', description: 'ID and update data required.' });
  }

  try { // Added try-catch block for async operations
    const data = await updateStudent(id, updateData);
    if (data) {
      res.status(200).json({ status: 200, result: data });
    } else {
      res.status(404).json({ code: '404', description: 'Student not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error updating student', error: error.message });
  }
});

// Soft delete student (DELETE /api/students/:id)
router.delete('/:id', async (req, res) => { // Added `async`
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ code: '400', description: 'ID is required.' });
  }

  try { // Added try-catch block for async operations
    const data = await deleteStudent(id);
    if (data) {
      res.status(204).send();
    } else {
      res.status(404).json({ code: '404', description: 'Student not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error deleting student', error: error.message });
  }
});

// Force delete student (Permanent delete) (DELETE /api/students/console/:id)
router.delete('/console/:id', async (req, res) => { // Added `async`
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ code: '400', description: 'ID is required.' });
  }

  try { // Added try-catch block for async operations
    const data = await forceDelete(id);
    if (data) {
      res.status(204).send();
    } else {
      res.status(404).json({ code: '404', description: 'Student not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error permanently deleting student', error: error.message });
  }
});

export default router; // Use `export default` instead of `module.exports`
>>>>>>> 9ba8cc4 (add prefix API & student API.)
