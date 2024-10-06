import express from 'express';
import SubjectController from '../controllers/subject/subjectController.js';

const router = express.Router();

// Route to fetch all subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await SubjectController.getAllSubjects();
        return res.status(200).json({ status: '200', result: subjects });
    } catch (err) {
        console.error('Error fetching all subjects:', err);
        return res.status(500).json({ status: '500', message: 'Error fetching subjects' });
    }
});

// Route to get a subject by its ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await SubjectController.getSubjectById(id);
        if (!subject) {
            return res.status(404).json({ status: '404', message: 'Subject not found' });
        }
        return res.status(200).json({ status: '200', result: subject });
    } catch (err) {
        console.error(`Error fetching subject with ID ${id}:`, err);
        return res.status(500).json({ status: '500', message: 'Error fetching subject' });
    }
});

// Route to create a new subject
router.post('/', async (req, res) => {
    const { subject_id, subject_name_en, subject_name_th, description } = req.body;
    try {
        const result = await SubjectController.createSubject({ subject_id, subject_name_en, subject_name_th, description });
        return res.status(201).json({ status: '201', result });
    } catch (err) {
        console.error('Error creating subject:', err);
        return res.status(500).json({ status: '500', message: 'Error creating subject' });
    }
});

// Route to update a subject
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { subject_name_en, subject_name_th, description } = req.body;
    try {
        const result = await SubjectController.updateSubject(id, { subject_name_en, subject_name_th, description });
        if (!result) {
            return res.status(404).json({ status: '404', message: 'Subject not found' });
        }
        return res.status(200).json({ status: '200', result });
    } catch (err) {
        console.error(`Error updating subject with ID ${id}:`, err);
        return res.status(500).json({ status: '500', message: 'Error updating subject' });
    }
});

// Route to safe delete a subject
router.put('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await SubjectController.deleteSubject(id);
        if (!result) {
            return res.status(404).json({ status: '404', message: 'Subject not found' });
        }
        return res.status(200).json({ status: '200', result });
    } catch (err) {
        console.error(`Error deleting subject with ID ${id}:`, err);
        return res.status(500).json({ status: '500', message: 'Error deleting subject' });
    }
});

// Route to restore a soft deleted subject
router.put('/restore/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await SubjectController.restoreSubject(id);
        if (!result) {
            return res.status(404).json({ status: '404', result ,desc: 'Subject not found or not deleted' });
        }
        return res.status(200).json({ status: '200', result });
    } catch (err) {
        console.error(`Error restoring subject with ID ${id}:`, err);
        return res.status(500).json({ status: '500', message: 'Error restoring subject' });
    }
});

// Route to force delete a subject
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await SubjectController.forceDeleteSubject(id);
        if (!result) {
            return res.status(404).json({ status: '404', message: 'Subject not found' });
        }
        return res.status(200).json({ status: '200', message: 'Subject permanently deleted' });
    } catch (err) {
        console.error(`Error force deleting subject with ID ${id}:`, err);
        return res.status(500).json({ status: '500', message: 'Error force deleting subject' });
    }
});

export default router;
