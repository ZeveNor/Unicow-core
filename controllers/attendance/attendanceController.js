import postgres from '../../utils/db.js';  // Assuming you have your Postgres client set up

// Function to mark attendance
const markAttendance = async ({ student_id, section_id, subject_id, attendance_date, status, remark, medical_document_path }) => {
    const client = await postgres.connect();
    try {
        const result = await client.query(
            `INSERT INTO attendance (student_id, section_id, subject_id, attendance_date, status, remark, medical_document_path)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *;`,
            [student_id, section_id, subject_id, attendance_date, status, remark, medical_document_path]
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error marking attendance:', err);
        throw err;
    } finally {
        client.release();
    }
};

// Function to update attendance (within 2-hour window)
const updateAttendance = async (id, { status, remark }) => {
    const client = await postgres.connect();

    try {
        const attendanceResult = await client.query(`SELECT createdat FROM attendance WHERE id = $1`, [id]);

        if (attendanceResult.rows.length === 0) {
            return { error: 'Attendance record not found' };
        }

        const createdAt = attendanceResult.rows[0].createdat;
        const now = new Date();

        const timeDifference = Math.abs(now - new Date(createdAt)) / (1000 * 60 * 60);

        if (timeDifference > 2) {
            return { error: 'You can only update attendance within 2 hours of creation.' };
        }

        const result = await client.query(
            `UPDATE attendance
             SET status = $1, remark = $2, updatedat = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
            [status, remark, id]
        );

        return result.rows[0];
    } catch (err) {
        console.error('Error updating attendance:', err);
        throw err;
    } finally {
        client.release();
    }
};

// Optional: Function to retrieve all attendance records
const getAttendance = async () => {
    const client = await postgres.connect();
    try {
        const result = await client.query(`SELECT * FROM attendance ORDER BY attendance_date DESC`);
        return result.rows;
    } catch (err) {
        console.error('Error fetching attendance records:', err);
        throw err;
    } finally {
        client.release();
    }
};

export default { markAttendance, updateAttendance, getAttendance };
