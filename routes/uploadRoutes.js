import express from 'express';
import { upload, uploadFile } from '../utils/upload.js';

const router = express.Router();

router.post('/images', upload.single('filename'), (req, res, next) => {
    console.log('Received request for file upload...');
    next();
}, uploadFile);


export default router;