import postgres from '../../utils/db.js';

<<<<<<< HEAD
// sudo kill `sudo lsof -t -i:4200`

// 'SELECT * FROM student;'
const getAllStudents = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM student;');
    res.json(result.rows);

    console.log("=> get all students",result.rows);
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server down' });
=======
// Get All Student List. Only return students where isDelete is false.
export const getAllStudents = async () => {
  const client = await postgres.connect(); // Get a client from the pool
  try {
    const result = await client.query('SELECT * FROM student WHERE isDelete = FALSE;');
    return result.rows;
  } finally {
    client.release(); // Release the client back to the pool
  }
};

// Get Student By ID. Include deleted students as well.
export const getStudentById = async (id) => {
  const client = await postgres.connect();
  try {
    const result = await client.query('SELECT * FROM student WHERE id = $1;', [id]);
    return result.rows.length > 0 ? result.rows[0] : 'Student not found';
>>>>>>> 9ba8cc4 (add prefix API & student API.)
  } finally {
    client.release();
  }
};

<<<<<<< HEAD
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

// 'INSERT INTO student (first_name, last_name, age) '
const createStudent = async (req, res, data) => {
  const { firstName, lastName, age } = data;
  const client = await pool.connect();
  try {
    // const result = await client.query(
    //   'INSERT INTO student (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *;',
    //   [firstName, lastName, age]
    // );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating student' });
=======

// Create new Student record.
export const createStudent = async (data) => { // Removed 'req' and 'res' parameters
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
>>>>>>> 9ba8cc4 (add prefix API & student API.)
  } finally {
    client.release(); // Ensure client is released after the query
  }
};

// Update Student Details.
export const updateStudent = async (id, data) => { // Removed 'req' and 'res' parameters, added 'id'
  const { firstName, lastName, age } = data;
  const client = await postgres.connect();
  try {
<<<<<<< HEAD
    // const result = await client.query(
    //   'UPDATE student SET first_name = $1, last_name = $2, age = $3 WHERE id = $4 RETURNING *;',
    //   [firstName, lastName, age, req.params.id]
    // );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating student' });
=======
    const result = await client.query(
        'UPDATE student SET first_name = $1, last_name = $2, age = $3, updateAt = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *;',
        [firstName, lastName, age, id]
    );
    return result.rows.length > 0 ? result.rows[0] : 'Student not found';
>>>>>>> 9ba8cc4 (add prefix API & student API.)
  } finally {
    client.release(); // Ensure client is released after the query
  }
};

// Soft Delete a Student (set isDelete to true).
export const deleteStudent = async (id) => { // Removed 'req' and 'res' parameters, added 'id'
  const client = await postgres.connect();
  try {
<<<<<<< HEAD
    // const result = await client.query('DELETE FROM student WHERE id = $1 RETURNING *;', [req.params.id]);
    if (result.rowCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting student' });
=======
    const result = await client.query(
        'UPDATE student SET isDelete = TRUE, deleteAt = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;',
        [id]
    );
    return result.rows.length > 0;
>>>>>>> 9ba8cc4 (add prefix API & student API.)
  } finally {
    client.release(); // Ensure client is released after the query
  }
};

// Restore a Student (set isDelete to false).
export const restoreStudent = async (id) => { // Removed 'req' and 'res' parameters, added 'id'
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
export const forceDelete = async (id) => { // Removed 'req' and 'res' parameters, added 'id'
  const client = await postgres.connect();
  try {
    const result = await client.query('DELETE FROM student WHERE id = $1 RETURNING *;', [id]);
    return result.rowCount > 0;
  } finally {
    client.release(); // Ensure client is released after the query
  }
};
