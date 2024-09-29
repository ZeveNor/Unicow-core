import postgres from '../../utils/db.js';

let result = '';

//
const getAllSection = async () => {
    const client = await postgres.connect();
    try {
        result = await client.query('SELECT * FROM section and isdelete = FALSE;');
        return result.rows;
    } catch (err) {
        console.error('Error fetching all prefixes:', err);
        throw err;
    } finally {
        client.release();
    }
};

const getSectionById = async (id) => {
    const client = await postgres.connect();
    try {
        result = await client.query('SELECT * FROM section WHERE id = $1 and isdelete = FALSE;', [id]);
        console.log(result);
        return result.rows;
    } catch (err) {
        console.error(`Error fetching prefix with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const getSectionByName = async (data) => {
    const client = await postgres.connect();
    const { name } = data;
    try {
        result = await client.query('SELECT * FROM section WHERE name = $1 and isdelete = FALSE;', [name]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
        console.error(`Error fetching prefix with name ${name}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const isSectionNameDuplicate = async (data) => {
    const client = await postgres.connect();
    const { name } = data;
    try {
        const result = await client.query(
            'SELECT * FROM section WHERE name = $1 AND isdelete = FALSE',
            [name]
        );
        return result.rows.length > 0;
    } catch (err) {
        console.error('Error checking for duplicate Section name:', err);
        throw err;
    } finally {
        client.release();
    }
};

const createSection = async (data) => {
    const { name } = data;
    const client = await postgres.connect();
    try {
        result = await client.query(
            `INSERT INTO section (name) VALUES ($1) RETURNING *;`, [name]
        );
        return result.rows;
    } catch (err) {
        console.error(`Error creating new Section with name ${name}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const updateSection = async (id, data) => {
    const { name } = data;
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `UPDATE section SET name = $1 WHERE id = $2 and isdelete = FALSE RETURNING *;`, [name, id]
        );
        return result.rows.length > 0 ? result.rows : 'Section not found';
    } catch (err) {
        console.error(`Error updating Section with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const deleteSection = async (id) => {
    const client = await postgres.connect();
    try {
        result = await client.query(
            `UPDATE section SET isdelete = TRUE WHERE id = $1 and isdelete = FALSE RETURNING *;`, [id]
        );
        return result.rows.length > 0 ? result.rows : 'Section not found';
    } catch (err) {
        console.error(`Error deleting Section with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const restoreSection = async (id) => {
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `UPDATE section SET isdelete = FALSE WHERE id = $1 and isdelete = TRUE RETURNING *;`, [id]
        );
        return result.rows.length > 0 ? result.rows[0] : 'Section not found';
    } catch (err) {
        console.error(`Error restoring Section with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const forceDeleteSection = async (id) => {
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `DELETE FROM section WHERE id = $1 RETURNING *;`, [id]
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
    getAllSection,
    getSectionById,
    createSection,
    updateSection,
    deleteSection,
    restoreSection,
    getSectionByName,
    isSectionNameDuplicate,
    forceDeleteSection
};