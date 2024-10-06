import express from 'express';
import StudentListController from '../controllers/studentList/studentListController.js';

const router = express.Router();

// Get all student lists
router.get('/', async (req, res) => {
    try {
        const data = await StudentListController.getAllStudentLists();
        res.status(200).json({ status: '200', result: data });
    } catch (err) {
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
});

// Get student list by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await StudentListController.getStudentListById(id);
        res.status(200).json({ status: '200', result: data });
    } catch (err) {
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
});

// Create new student list
router.post('/', async (req, res) => {
    try {
        const data = await StudentListController.createStudentList(req.body);
        res.status(201).json({ status: '201', result: data });
    } catch (err) {
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
});

// Update student list
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await StudentListController.updateStudentList(id, req.body);
        res.status(200).json({ status: '200', result: data });
    } catch (err) {
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
});

// Delete student list
router.put('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await StudentListController.deleteStudentList(id);
        res.status(200).json({ status: '200', result: data });
    } catch (err) {
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
});

export default router;
