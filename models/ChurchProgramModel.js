const { pool }  = require('../config/config.js');
const logger = require('../config/logger.js');

const ChurchProgramModel = {

    getAllChurch: async (limit,offset) => {
        const query = {
            text: 'SELECT * FROM church_program ORDER BY id ASC LIMIT $1 OFFSET $2',
            values: [limit, offset]
        };
        try {
            const result = await pool.query(query);
            if (result.rows.length > 0) {
                logger.info(`church returned successfuly ${result.rows}`);
                return {
                    success: true,
                    message: 'church returned successfuly',
                    returnedResult: result.rows
                }
            }
            else {
                logger.error(`church return failed`);
                return {
                    success: false,
                    message: 'church return failed'
                }
            }
        } catch (error) {
            logger.error(`Error fetching church: `,error.message);
            throw error
        }
    },

    getChurchById : async (id) => {
        const query = {
            text: 'SELECT * FROM church_program WHERE id = $1',
            value : [id],
        }
        try {
            const result = await pool.query(query);
            if (result.rows.length === 1) {
                logger.info(`church_program returned by id ${result.rows[0]}`);
                return {
                    success: true,
                    message: 'church_program returned successfully',
                    returnedUser:  result.rows[0]
                 }
            } else {
                logger.error(`No church_program found by this ID : ${id}`);
                return {
                    success: false,
                    message: 'Get church_program by id failed'
                 }
            }
        } catch(error) {
            logging.error(`Error fetching church_program : ${error.message}`)
            throw error;
        }
    },

    getChurchProgramByChurchId : async (id) => {
        const query = {
            text: 'SELECT * FROM church_program WHERE id_church = $1;',
            value : [id],
        }
        try {
            const result = await pool.query(query);
            if (result.rows.length === 1) {
                logger.info(`church_program returned by church id ${result.rows[0]}`);
                return {
                    success: true,
                    message: 'church_program returned successfully',
                    returnedUser:  result.rows[0]
                 }
            } else {
                logger.error(`No church_program found by this church ID : ${id}`);
                return {
                    success: false,
                    message: 'Get church_program by church  id failed'
                 }
            }
        } catch(error) {
            logging.error(`Error fetching church_program by churchid: ${error.message}`)
            throw error;
        }
    },

    createChurch: async (program_name,description,program_date,start_time,end_time,id_church) => {

        const query = {
            text: `INSERT INTO church_program (program_name,description,program_date,start_time,end_time,id_church)
                 VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
            values : [program_name,description,program_date,start_time,end_time,id_church]
        };
        try { 
            const check_church_query = {
                text: `SELECT * FROM church WHERE id=$1`,
                values: [id_church]
            };
            const result =  await pool.query(check_church_query);
            if (result.rows.length === 1) {
            const result =  await pool.query(query);
            if (result.rowCount > 0) {
                logger.info(`church_program created successfully: ${result.rows[0]}`);
                return {
                    success: true,
                    message: 'church_program created successfully',
                    returnedResult:  result.rows[0]
                 }
            } else {
                logger.error('church_program creation failed');
                return {
                    success: false,
                    message: `church_program checkup failed`
                };
            }
        } else {
            logger.error('No rows are inserted.user value if not valid.Check if church exists.');
            return {
                success: false,
                message: `church checkup failed`
            }
        }
        } catch (error) {
            logger.error(`Error in church creation: ${error.message}`);
            throw error;
        }
    },
}

module.exports = ChurchProgramModel;