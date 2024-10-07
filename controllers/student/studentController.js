import postgres from '../../utils/db.js';

let result = '';

// Get All Students
const getAllStudents = async () => {
  const client = await postgres.connect();
  try {
    result = await client.query('SELECT * FROM student WHERE isdelete = FALSE;');
    return result.rows;
  } catch (err) {
    console.error('Error fetching all students:', err);
    throw err;
  } finally {
    client.release();
  }
};

// Get Student by ID
const getStudentById = async (id) => {
  const client = await postgres.connect();
  try {
    result = await client.query('SELECT * FROM student WHERE id = $1 and isdelete = FALSE;', [id]);
    return result.rows;
  } catch (err) {
    console.error(`Error fetching student with ID ${id}:`, err);
    throw err;
  } finally {
    client.release();
  }
};

// Check if Prefix Name is Duplicate.
const isStudentNameDuplicate = async (first_name, last_name) => {
  const client = await postgres.connect();
  try {
    const result = await client.query(
        'SELECT * FROM student WHERE first_name = $1 AND last_name = $2 AND isdelete = FALSE;',
        [first_name, last_name]
    );
    return result.rows.length > 0;
  } catch (err) {
    console.error('Error checking for duplicate student name:', err);
    throw err;
  } finally {
    client.release();
  }
};

// Create new Student
const createStudent = async (data) => {
  const { id, prefix_id, first_name, last_name, date_of_birth, sex, curriculum_id, previous_school, address, telephone, email, line_id, status } = data;
  const client = await postgres.connect();
  try {
    const result = await client.query(
        `INSERT INTO student ( id, prefix_id, first_name, last_name, date_of_birth, sex, curriculum_id, previous_school, address, telephone, email, line_id, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             RETURNING *;`,
        [id,prefix_id, first_name, last_name, date_of_birth, sex, curriculum_id, previous_school, address, telephone, email, line_id, status]
    );
    return result.rows;
  } catch (err) {
    console.error('Error creating new student:', err);
    throw err;
  } finally {
    client.release();
  }
};

// Update Student
const updateStudent = async (id, data) => {
  const { prefix_id, first_name, last_name, date_of_birth, sex, curriculum_id, previous_school, address, telephone, email, line_id, status } = data;
  const client = await postgres.connect();
  try {
    const result = await client.query(
        `UPDATE student
             SET prefix_id = $1, first_name = $2, last_name = $3, date_of_birth = $4, sex = $5, curriculum_id = $6, previous_school = $7, address = $8, telephone = $9, email = $10, line_id = $11, status = $12
             WHERE id = $13 AND isdelete = FALSE
             RETURNING *;`,
        [prefix_id, first_name, last_name, date_of_birth, sex, curriculum_id, previous_school, address, telephone, email, line_id, status, id]
    );
    return result.rows;
  } catch (err) {
    console.error(`Error updating student with ID ${id}:`, err);
    throw err;
  } finally {
    client.release();
  }
};

// Delete Student
const deleteStudent = async (id) => {
  const client = await postgres.connect();
  try {
    const result = await client.query(
        `UPDATE student SET isdelete = TRUE , updatedat = current_timestamp WHERE id = $1 RETURNING *;`,
        [id]
    );
    return result.rows;
  } catch (err) {
    console.error(`Error deleting student with ID ${id}:`, err);
    throw err;
  } finally {
    client.release();
  }
};

// Restore Student
const restoreStudent = async (id) => {
  const client = await postgres.connect();
  try {
    const result = await client.query(
        `UPDATE student SET isdelete = FALSE , updatedat = current_timestamp WHERE id = $1 RETURNING *;`,
        [id]
    );
    return result.rows;
  } catch (err) {
    console.error(`Error deleting student with ID ${id}:`, err);
    throw err;
  } finally {
    client.release();
  }
};

// Restore Student
const forceDeleteStudent = async (id) => {
  const client = await postgres.connect();
  try {
    const result = await client.query(
        `DELETE FROM student WHERE id = $1 RETURNING *;`, [id]
    );
    return result.rows.length > 0 ? result.rows[0] : 'Section not found';
  } catch (err) {
    console.error(`Error force deleting Section with ID ${id}:`, err);
    throw err;
  } finally {
    client.release();
  }
};

export default {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  restoreStudent,
  forceDeleteStudent,
  isStudentNameDuplicate
};
