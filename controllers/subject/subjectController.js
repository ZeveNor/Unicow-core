import postgres from '../../utils/db.js';  // Assuming you have your Postgres client here

let result = '';

// Fetch all subjects that are not deleted
const getAllSubjects = async () => {
    const client = await postgres.connect();
    try {
        result = await client.query('SELECT * FROM subject WHERE isdelete = FALSE;');
        return result.rows;
    } catch (err) {
        console.error('Error fetching all subjects:', err);
        throw err;
    } finally {
        client.release();
    }
};

// Fetch a subject by ID
const getSubjectById = async (id) => {
    const client = await postgres.connect();
    try {
        result = await client.query('SELECT * FROM subject WHERE subject_id = $1 AND isdelete = FALSE;', [id]);
        return result.rows.length > 0 ? result.rows[0] : 'Subject not found';
    } catch (err) {
        console.error(`Error fetching subject with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

// Create a new subject
const createSubject = async (data) => {
    const { subject_id, subject_name_en, subject_name_th, description } = data;
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `INSERT INTO subject (subject_id, subject_name_en, subject_name_th, description, isdelete)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *;`,
            [subject_id, subject_name_en, subject_name_th, description, false]
        );
        return result.rows;
    } catch (err) {
        console.error(`Error creating subject with ID ${subject_id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

// Update subject details
const updateSubject = async (id, data) => {
    const { subject_name_en, subject_name_th, description } = data;
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `UPDATE subject
             SET subject_name_en = $1, subject_name_th = $2, description = $3, updatedat = CURRENT_TIMESTAMP
             WHERE subject_id = $4 AND isdelete = FALSE
             RETURNING *;`,
            [subject_name_en, subject_name_th, description, id]
        );
        return result.rows.length > 0 ? result.rows : 'Subject not found';
    } catch (err) {
        console.error(`Error updating subject with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

// Soft delete (safe delete) a subject by marking it as deleted
const deleteSubject = async (id) => {
    const client = await postgres.connect();
    try {
        result = await client.query(
            `UPDATE subject SET isdelete = TRUE, updatedat = CURRENT_TIMESTAMP, deletedat = CURRENT_TIMESTAMP
             WHERE subject_id = $1 AND isdelete = FALSE
             RETURNING *;`,
            [id]
        );
        return result.rows.length > 0 ? result.rows : 'Subject not found';
    } catch (err) {
        console.error(`Error deleting subject with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

// Restore a subject that was soft deleted
const restoreSubject = async (id) => {
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `UPDATE subject SET isdelete = FALSE, updatedat = CURRENT_TIMESTAMP, deletedat = NULL
             WHERE subject_id = $1 AND isdelete = TRUE
             RETURNING *;`,
            [id]
        );
        return result.rows.length > 0 ? result.rows[0] : 'Subject not found';
    } catch (err) {
        console.error(`Error restoring subject with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

// Force delete a subject (permanently delete it from the database)
const forceDeleteSubject = async (id) => {
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `DELETE FROM subject WHERE subject_id = $1 RETURNING *;`,
            [id]
        );
        return result.rows.length > 0 ? result.rows[0] : 'Subject not found';
    } catch (err) {
        console.error(`Error force deleting subject with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

export default {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    restoreSubject,
    forceDeleteSubject
};
