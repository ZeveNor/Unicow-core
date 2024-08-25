const pool = require('../../utils/db'); 

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
  } finally {
    client.release();
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
  } finally {
    client.release();
  }
};

const updateStudent = async (req, res, data) => {
  const { firstName, lastName, age } = data;
  const client = await pool.connect();
  try {
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
  } finally {
    client.release();
  }
};

const deleteStudent = async (req, res) => {
  const client = await pool.connect();
  try {
    // const result = await client.query('DELETE FROM student WHERE id = $1 RETURNING *;', [req.params.id]);
    if (result.rowCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting student' });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
