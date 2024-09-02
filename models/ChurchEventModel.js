const { pool }  = require('../config/config.js');
const logger = require('../config/logger.js');

const ChurchEventModel = {

    getAllchurch_event: async (limit,offset) => {
        const query = {
            text: 'SELECT * FROM church_event ORDER BY id ASC LIMIT $1 OFFSET $2',
            values: [limit, offset]
        };
        try {
            const result = await pool.query(query);
            if (result.rows.length > 0) {
                logger.info(`church_event returned successfuly ${result.rows}`);
                return {
                    success: true,
                    message: 'church_event returned successfuly',
                    returnedResult: result.rows
                }
            }
            else {
                logger.error(`church_event return failed`);
                return {
                    success: false,
                    message: 'church_event return failed'
                }
            }
        } catch (error) {
            logger.error(`Error fetching church_event: `,error.message);
            throw error
        }
    },

    getChurchById : async (id) => {
        const query = {
            text: 'SELECT * FROM church_event WHERE id = $1',
            value : [id],
        }
        try {
            const result = await pool.query(query);
            if (result.rows.length === 1) {
                logger.info(`church_event returned by id ${result.rows[0]}`);
                return {
                    success: true,
                    message: 'church_event returned successfully',
                    returnedUser:  result.rows[0]
                 }
            } else {
                logger.error(`No church_event found by this ID : ${id}`);
                return {
                    success: false,
                    message: 'Get church_event by id failed'
                 }
            }
        } catch(error) {
            logging.error(`Error fetching church_event : ${error.message}`)
            throw error;
        }
    },

    getChurchEventByChurchId : async (id) => {
        const query = {
            text: 'SELECT * FROM church_event WHERE id_church = $1;',
            value : [id],
        }
        try {
            const result = await pool.query(query);
            if (result.rows.length === 1) {
                logger.info(`church_event returned by church id ${result.rows[0]}`);
                return {
                    success: true,
                    message: 'church_event returned successfully',
                    returnedUser:  result.rows[0]
                 }
            } else {
                logger.error(`No church_event found by this church ID : ${id}`);
                return {
                    success: false,
                    message: 'Get church_event by church  id failed'
                 }
            }
        } catch(error) {
            logging.error(`Error fetching church_event by churchid: ${error.message}`)
            throw error;
        }
    },

    createChurch: async (id_user,id_church,event_name,event_description,start_date,end_date,duration,eventcategory,longitude,latitude) => {

        const query = {
            text: `INSERT INTO church_event (id_user,id_church,event_name,event_description,
                start_date,end_date,duration,eventcategory,geom_location)
                 VALUES($1,$2,$3,$4,$5,$6,$7,$8,ST_SetSRID(ST_MakePoint($9,$10),4326)) RETURNING *`,
            values : [id_user,id_church,event_name,event_description,start_date,end_date,duration,eventcategory,longitude,latitude]
        };
        try { 
            const check_user_query = {
                text: `SELECT * FROM "user" WHERE id=$1`,
                values: [id_user]
            };
            const check_church_query = {
                text: `SELECT * FROM church WHERE id=$1`,
                values: [id_church]
            };
            const result_user =  await pool.query(check_user_query);
            const result_church =  await pool.query(check_church_query);

            if (result_user.rows.length === 1 && result_church.rows.length === 1 ) {

            const result =  await pool.query(query);
            if (result.rowCount > 0) {
                logger.info(`church_event created successfully: ${result.rows[0]}`);
                return {
                    success: true,
                    message: 'church_event created successfully',
                    returnedResult:  result.rows[0]
                 }
            } else {
                logger.error('church_event creation failed');
                return {
                    success: false,
                    message: `church_event checkup failed`
                };
            }
        } else {
            logger.error('No rows are inserted.user value if not valid.Check if church_event exists.');
            return {
                success: false,
                message: `church_event checkup failed`
            }
        }
        } catch (error) {
            logger.error(`Error in church_event creation: ${error.message}`);
            throw error;
        }
    },
}

module.exports = ChurchEventModel;