const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student/studentController');

router.get('/', (req, res) => {
  studentController.getAllStudents(req, res);
});

router.get('/:id', (req, res) => {
  studentController.getStudentById(req, res);
});

router.post('/createByQuery', (req, res) => {
  const { firstName, lastName, age } = req.query;
  studentController.createStudent(req, res, { firstName, lastName, age });
});

router.post('/createByRoute/:firstName/:lastName/:age', (req, res) => {
  const { firstName, lastName, age } = req.params;
  studentController.createStudent(req, res, { firstName, lastName, age });
});

router.post('/', (req, res) => {
  studentController.createStudent(req, res, req.body);
});

router.put('/:id', (req, res) => {
  studentController.updateStudent(req, res, req.body);
});

router.delete('/:id', (req, res) => {
  studentController.deleteStudent(req, res);
});

module.exports = router;
