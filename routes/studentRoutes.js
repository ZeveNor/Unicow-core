import express from 'express';
import StudentController from '../controllers/student/studentController.js';

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const data = await StudentController.getAllStudents();
    res.status(200).json({ status: '200', result: data });
  } catch (err) {
    res.status(500).json({ status: '500', result: 'Internal Server Error' });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await StudentController.getStudentById(id);
    res.status(200).json({ status: '200', result: data });
  } catch (err) {
    res.status(500).json({ status: '500', result: 'Internal Server Error' });
  }
});

// Create new student
router.post('/', async (req, res) => {
  const studentData = {
    id: req.body.id,
    prefix_id: req.body.prefix_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    date_of_birth: req.body.date_of_birth,
    sex: req.body.sex,
    curriculum_id: req.body.curriculum_id,
    previous_school: req.body.previous_school,
    address: req.body.address,
    telephone: req.body.telephone,
    email: req.body.email,
    line_id: req.body.line_id,
    status: req.body.status,
  };

  if (!studentData.first_name || !studentData.last_name) {
    return res.status(400).json({ status: '400', message: 'First name and last name are required.' });
  }

  try {
    const isDuplicate = await StudentController.isStudentNameDuplicate(studentData.first_name, studentData.last_name);

    if (isDuplicate) {
      return res.status(400).json({ status: '400', message: 'Student name already exists.' });
    }

    // Proceed with creating the student if no duplicate is found
    const newStudent = await StudentController.createStudent(studentData);
    return res.status(201).json({ status: '201', result: newStudent });
  } catch (err) {
    console.error('Error creating student:', err);
    return res.status(500).json({ status: '500', message: 'Internal Server Error' });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await StudentController.updateStudent(id, req.body);
    res.status(200).json({ status: '200', result: data });
  } catch (err) {
    res.status(500).json({ status: '500', result: 'Internal Server Error' });
  }
});

// Delete student
router.put('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await StudentController.deleteStudent(id);
    res.status(200).json({ status: '200', result: data });
  } catch (err) {
    res.status(500).json({ status: '500', result: 'Internal Server Error' });
  }
});

export default router;
