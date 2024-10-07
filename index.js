import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: 'dev.env' });

const app = express();
const port = process.env.WEB_PORT;

import studentRoutes from './routes/studentRoutes.js';
import prefixRoutes from  './routes/prefixRoutes.js'
import sectionRoutes from "./routes/sectionRoutes.js";
import curriculumRoutes from "./routes/curriculumRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import alive from './utils/alive.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use student routes
app.use('/api/students', studentRoutes);
app.use('/api/prefixs', prefixRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/curriculums', curriculumRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendances', attendanceRoutes);

// Base route
app.get('/', (req, res) => {
  res.send(alive);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

