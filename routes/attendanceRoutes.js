import express from 'express';
import { upload, uploadFile } from '../utils/upload.js';
import AttendanceController from '../controllers/attendance/attendanceController.js';

const router = express.Router();

// POST route for marking attendance
router.post('/', upload.single('medical_document'), async (req, res) => {
    try {
        const { student_id, section_id, subject_id, attendance_date, status, remark } = req.body;

        // Handle medical document upload (optional)
        let medical_document_path = null;
        if (req.file) {
            const fileUploadResponse = await uploadFile(req, res);
            medical_document_path = fileUploadResponse.downloadURL;
        }

        // Mark attendance
        const result = await AttendanceController.markAttendance({
            student_id,
            section_id,
            subject_id,
            attendance_date,
            status,
            remark,
            medical_document_path
        });

        return res.status(201).json({ status: '201', result: result });
    } catch (error) {
        console.error('Error marking attendance:', error);
        return res.status(500).json({ status: '500', message: 'Error marking attendance' });
    }
});

// PUT route for updating attendance (only within 2 hours)
router.put('/:id', upload.single('medical_document'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remark } = req.body;

        // Handle medical document upload (optional)
        let medical_document_path = null;
        if (req.file) {
            const fileUploadResponse = await uploadFile(req, res);
            medical_document_path = fileUploadResponse.downloadURL;
        }

        const result = await AttendanceController.updateAttendance(id, { status, remark, medical_document_path });

        if (result.error) {
            return res.status(400).json({ status: '400', message: result.error });
        }

        return res.status(200).json({ status: '200', result: result });
    } catch (error) {
        console.error('Error updating attendance:', error);
        return res.status(500).json({ status: '500', message: 'Error updating attendance' });
    }
});

// Optional: GET route to retrieve all attendance records
router.get('/', async (req, res) => {
    try {
        const attendanceRecords = await AttendanceController.getAttendance();
        return res.status(200).json({ status: '200', result: attendanceRecords });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        return res.status(500).json({ status: '500', message: 'Error fetching attendance records' });
    }
});

export default router;
