import postgres from '../../utils/db.js';

// Get All Student List. Only return students where isDelete is false.
const getAllStudents = async () => {
  const client = await postgres.connect(); // Get a client from the pool
  try {
    const result = await client.query('SELECT * FROM student WHERE isDelete = FALSE;');
    return result.rows;
  } finally {
    client.release(); // Release the client back to the pool
  }
};

// 'SELECT * FROM student WHERE id = $1;', [req.params.id]
const getStudentById = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM student WHERE id = $1;', [req.params.id]);
    
    // console.log(result);
    
    if (result.rows.length > 0) {

      res.json(result.rows[0]);
      console.log("=> get students By ID", result.rows[0]);
    
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server down' });
  } finally {
    client.release();
  }
};

// Create new Student record.
const createStudent = async (data) => { // Removed 'req' and 'res' parameters
  const {
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
    isDelete,
    updatedAt,
    deletedAt
  } = data;

  const client = await postgres.connect();
  try {
    const result = await client.query(
        'INSERT INTO student (prefix_id, first_name, last_name, date_of_birth, sex, curriculum_id, previous_school, address, telephone, email, line_id, status, isdelete, createat, updateat, deleteat) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *;',
        [prefixId, firstName, lastName, dateOfBirth, sex, curriculumId, previousSchool, address, telephone, email, lineId, status, isDelete, updatedAt, deletedAt]
    );
    return result.rows[0];
  } finally {
    client.release(); // Ensure client is released after the query
  }
};

// Update Student Details.
const updateStudent = async (id, data) => { // Removed 'req' and 'res' parameters, added 'id'
  const { firstName, lastName, age } = data;
  const client = await postgres.connect();
  try {
    const result = await client.query(
        'UPDATE student SET first_name = $1, last_name = $2, age = $3, updateAt = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *;',
        [firstName, lastName, age, id]
    );
    return result.rows.length > 0 ? result.rows[0] : 'Student not found';
  } finally {
    client.release(); // Ensure client is released after the query
  }
};

// Soft Delete a Student (set isDelete to true).
const deleteStudent = async (id) => { // Removed 'req' and 'res' parameters, added 'id'
  const client = await postgres.connect();
  try {
    const result = await client.query(
        'UPDATE student SET isDelete = TRUE, deleteAt = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;',
        [id]
    );
    return result.rows.length > 0;
  } finally {
    client.release(); // Ensure client is released after the query
  }
};

// Restore a Student (set isDelete to false).
const restoreStudent = async (id) => { // Removed 'req' and 'res' parameters, added 'id'
  const client = await postgres.connect();
  try {
    const result = await client.query(
        'UPDATE student SET isDelete = FALSE, updateAt = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;',
        [id]
    );
    return result.rows.length > 0 ? result.rows[0] : 'Student not found';
  } finally {
    client.release(); // Ensure client is released after the query
  }
};

// Permanently Delete a Student.
const forceDelete = async (id) => { // Removed 'req' and 'res' parameters, added 'id'
  const client = await postgres.connect();
  try {
    const result = await client.query('DELETE FROM student WHERE id = $1 RETURNING *;', [id]);
    return result.rowCount > 0;
  } finally {
    client.release(); // Ensure client is released after the query
  }
};

export default {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  forceDelete,
  restoreStudent
};
