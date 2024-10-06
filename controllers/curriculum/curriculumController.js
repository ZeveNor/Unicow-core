import postgres from '../../utils/db.js';

let result = '';

const getAllCurriculum = async () => {
    const client = await postgres.connect();
    try {
        result = await client.query('SELECT * FROM curriculum where isdelete = FALSE;');
        return result.rows;
    } catch (err) {
        console.error('Error fetching all prefixes:', err);
        throw err;
    } finally {
        client.release();
    }
};

const getCurriculumById = async (id) => {
    const client = await postgres.connect();
    try {
        result = await client.query('SELECT * FROM curriculum WHERE id = $1 and isdelete = FALSE;', [id]);
        console.log(result);
        return result.rows;
    } catch (err) {
        console.error(`Error fetching prefix with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const getCurriculumByName = async (data,nameType) => {
    const client = await postgres.connect();
    const { name } = data;
    try {
        result = await client.query('SELECT * FROM curriculum WHERE $1 = $2 and isdelete = FALSE;', [nameType,name]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (err) {
        console.error(`Error fetching prefix with name ${name}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const isCurriculumNameDuplicate = async (data,nameType) => {
    const client = await postgres.connect();
    const { name } = data;
    try {
        const result = await client.query(
            'SELECT * FROM curriculum WHERE $1 = $2 AND isdelete = FALSE',
            [nameType,name]
        );
        return result.rows.length > 0;
    } catch (err) {
        console.error('Error checking for duplicate Curriculum name:', err);
        throw err;
    } finally {
        client.release();
    }
};

const createCurriculum = async (data) => {
    const { curr_name_th, curr_name_en, short_name_th, short_name_en } = data;
    const client = await postgres.connect();

    try {
        const result = await client.query(
            `INSERT INTO curriculum (curr_name_th, curr_name_en, short_name_th, short_name_en, isdelete)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *;`,
            [curr_name_th, curr_name_en, short_name_th, short_name_en, false]
        );
        return result.rows;
    } catch (err) {
        console.error(`Error creating new Curriculum with names ${curr_name_th} / ${curr_name_en}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const updateCurriculum = async (id, data) => {
    const { curr_name_th, curr_name_en, short_name_th, short_name_en } = data;
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `UPDATE curriculum
             SET curr_name_th = $1, curr_name_en = $2, short_name_th = $3, short_name_en = $4
             WHERE id = $5 AND isdelete = FALSE
             RETURNING *;`,
            [curr_name_th, curr_name_en, short_name_th, short_name_en, id]
        );
        return result.rows.length > 0 ? result.rows : 'Curriculum not found';
    } catch (err) {
        console.error(`Error updating Curriculum with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const deleteCurriculum = async (id) => {
    const client = await postgres.connect();
    try {
        result = await client.query(
            `UPDATE curriculum SET isdelete = TRUE ,updatedat = current_timestamp WHERE id = $1 and isdelete = FALSE RETURNING *;`, [id]
        );
        return result.rows.length > 0 ? result.rows : 'Curriculum not found';
    } catch (err) {
        console.error(`Error deleting Curriculum with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const restoreCurriculum = async (id) => {
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `UPDATE curriculum SET isdelete = FALSE, updatedat = current_timestamp , deletedat = null WHERE id = $1 and isdelete = TRUE RETURNING *;`, [id]
        );
        return result.rows.length > 0 ? result.rows[0] : 'Curriculum not found';
    } catch (err) {
        console.error(`Error restoring Curriculum with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

const forceDeleteCurriculum = async (id) => {
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `DELETE FROM curriculum WHERE id = $1 RETURNING *;`, [id]
        );
        return result.rows.length > 0 ? result.rows[0] : 'Curriculum not found';
    } catch (err) {
        console.error(`Error force deleting Curriculum with ID ${id}:`, err);
        throw err;
    } finally {
        client.release();
    }
};

export default {
    getAllCurriculum,
    getCurriculumById,
    createCurriculum,
    updateCurriculum,
    deleteCurriculum,
    restoreCurriculum,
    getCurriculumByName,
    isCurriculumNameDuplicate,
    forceDeleteCurriculum
};