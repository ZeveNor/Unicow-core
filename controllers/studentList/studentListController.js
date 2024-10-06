import postgres from '../../utils/db.js';

let result = '';

// Get All Student Lists
const getAllStudentLists = async () => {
    const client = await postgres.connect();
    try {
        result = await client.query('SELECT * FROM student_list WHERE isdelete = FALSE;');
        return result.rows;
    } catch (err) {
        console.error('Error fetching all student lists:', err);
        throw err;
    } finally {
        client.release();
    }
};

// Get Student List by ID
const getStudentListById = async (id) => {
    const client = await postgres.connect();
    try {
        result = await client.query('SELECT * FROM student_list WHERE id = $1 and isdelete = FALSE;', [id]);
        return result.rows;
    } catch (err) {
        console.error(`Error fetching student list with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

// Create new Student List
const createStudentList = async (data) => {
    const { section_id, student_id, active_date, status } = data;
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `INSERT INTO student_list (section_id, student_id, active_date, status)
             VALUES ($1, $2, $3, $4)
             RETURNING *;`,
            [section_id, student_id, active_date, status]
        );
        return result.rows;
    } catch (err) {
        console.error('Error creating new student list:', err);
        throw err;
    } finally {
        client.release();
    }
};

// Update Student List
const updateStudentList = async (id, data) => {
    const { section_id, student_id, active_date, status } = data;
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `UPDATE student_list
             SET section_id = $1, student_id = $2, active_date = $3, status = $4
             WHERE id = $5 AND isdelete = FALSE
             RETURNING *;`,
            [section_id, student_id, active_date, status, id]
        );
        return result.rows;
    } catch (err) {
        console.error(`Error updating student list with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

// Delete Student List
const deleteStudentList = async (id) => {
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `UPDATE student_list SET isdelete = TRUE, updatedat = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`,
            [id]
        );
        return result.rows;
    } catch (err) {
        console.error(`Error deleting student list with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

export default {
    getAllStudentLists,
    getStudentListById,
    createStudentList,
    updateStudentList,
    deleteStudentList,
};
