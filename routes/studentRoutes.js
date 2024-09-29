import express from "express";
import StudentController from "../controllers/section/sectionController.js";

const router = express.Router();

/* API Routing Path
    Get /api/students/
    Get /api/students/:id
    Create /api/students/
    Update /api/students/:id
    Delete /api/students/:id
    Permanent Delete /api/students/:id (Force Delete Danger!!)
*/

router.get('/', async (req, res) => {
  try {
    const data = await StudentController.getAllStudents();
    res.status(200).json({ status: '200', result: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: '500', result: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ status: '400', result: 'ID is required.' });
  }
  try {
    const data = await StudentController.getStudentById(id);
    res.status(200).json({ status: '200', result: data });
  } catch (err) {
    res.status(500).json({ status: '500', result: 'Internal Server Error' });
  }
});

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
    const data = await StudentController.createStudent(studentData);
    res.status(201).json({ status: 201, result: data });
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error creating student', error: error.message });
  }
});

router.put('/:id', async (req, res) => { // Added `async`
  const { id } = req.params;
  const updateData = req.body;

  if (!id || !updateData) {
    return res.status(400).json({ code: '400', description: 'ID and update data required.' });
  }

  try {
    const data = await StudentController.updateStudent(id, updateData);
    if (data) {
      res.status(200).json({ status: 200, result: data });
    } else {
      res.status(404).json({ code: '404', description: 'Student not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error updating student', error: error.message });
  }
});

router.delete('/:id', async (req, res) => { // Added `async`
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ code: '400', description: 'ID is required.' });
  }

  try {
    const data = await StudentController.deleteStudent(id);
    if (data) {
      res.status(204).send();
    } else {
      res.status(404).json({ code: '404', description: 'Student not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error deleting student', error: error.message });
  }
});

router.delete('/console/:id', async (req, res) => { // Added `async`
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ code: '400', description: 'ID is required.' });
  }

  try {
    const data = await StudentController.forceDelete(id);
    if (data) {
      res.status(204).send();
    } else {
      res.status(404).json({ code: '404', description: 'Student not found.' });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: 'Error permanently deleting student', error: error.message });
  }
});

export default router;