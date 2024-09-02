const { pool }  = require('../config/config.js');
const logger = require('../config/logger.js');

const ChurchModel = {

    getAllChurch: async (limit,offset) => {
        const query = {
            text: 'SELECT * FROM church ORDER BY id ASC LIMIT $1 OFFSET $2',
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
            text: 'SELECT * FROM church WHERE id = $1',
            value : [id],
        }
        try {
            const result = await pool.query(query);
            if (result.rows.length === 1) {
                logger.info(`church returned by id ${result.rows[0]}`);
                return {
                    success: true,
                    message: 'church returned successfully',
                    returnedUser:  result.rows[0]
                 }
            } else {
                logger.error(`No church found by this ID : ${id}`);
                return {
                    success: false,
                    message: 'Get church by id failed'
                 }
            }
        } catch(error) {
            logging.error(`Error fetching church : ${error.message}`)
            throw error;
        }
    },

    createChurch: async (name,image_name,description_text,id_user,id_city,email,phone,longitude,latitude) => {

        const query = {
            text: `INSERT INTO church (name,location,image_name,description_text)
                 VALUES($1,ST_SetSRID(ST_MakePoint($2,$3),4326),$4,$5,$6,$7,$8,$9) RETURNING *`,
            values : [name,longitude,latitude,image_name,description_text,id_user,id_city,email,phone]
        };
        try { 
            const check_user_query = {
                text: `SELECT * FROM "user" WHERE id=$1`,
                values: [id_user]
            };
            const result =  await pool.query(check_user_query);
            if (result.rows.length === 1) {
            const result =  await pool.query(query);
            if (result.rowCount > 0) {
                logger.info(`church created successfully: ${result.rows[0]}`);
                return {
                    success: true,
                    message: 'church created successfully',
                    returnedResult:  result.rows[0]
                 }
            } else {
                logger.error('church creation failed');
                return {
                    success: false,
                    message: `church checkup failed`
                };
            }
        } else {
            logger.error('No rows are inserted.user value if not valid.Check if user exists.');
            return {
                success: false,
                message: `user checkup failed`
            }
        }
        } catch (error) {
            logger.error(`Error in church creation: ${error.message}`);
            throw error;
        }
    },
}

module.exports = ChurchModel;