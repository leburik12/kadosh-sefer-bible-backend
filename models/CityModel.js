const { pool }  = require('../config/config.js');
const logger = require('../config/logger.js');

const CityModel = {
    getAllCities: async (limit,offset) => {
        const query = {
            text: 'SELECT * FROM City ORDER BY id ASC LIMIT $1 OFFSET $2',
            values: [limit, offset]
        };
        try {
            const result = await pool.query(query);
            if (result.rows.length > 0) {
                logger.info(`Cities returned successfuly ${result.rows}`);
                return {
                    success: true,
                    message: 'Cities returned successfuly',
                    returnedResult: result.rows
                }
            }
            else {
                logger.error(`Cities return failed`);
                return {
                    success: false,
                    message: 'Cities return failed'
                }
            }
        } catch (error) {
            logger.error(`Error fetching cities: `,error.message);
            throw error
        }
    },

    getCityById : async (id) => {
        const query = {
            text: 'SELECT * FROM city WHERE id = $1',
            value : [id],
        }
        try {
            const result = await pool.query(query);
            if (result.rows.length === 1) {
                logger.info(`city returned by id ${result.rows[0]}`);
                return {
                    success: true,
                    message: 'city returned successfully',
                    returnedUser:  result.rows[0]
                 }
            } else {
                logger.error(`No city found by this ID : ${id}`);
                return {
                    success: false,
                    message: 'Get city by id failed'
                 }
            }
        } catch(error) {
            logging.error(`Error fetching city : ${error.message}`)
            throw error;
        }
    },

    createCity: async (city_name,id_country) => {
        const query = {
            text: `INSERT INTO city (city_name,id_country)
                 VALUES($1,$2) RETURNING *`,
            values : [city_name,id_country]
        };
        try { 
            const check_country_query = {
                text: `SELECT country WHERE id=$1`,
                values: [id_country]
            };
        const result =  await pool.query(check_country_query);
        if (result.rows.length === 1) {
            const result =  await pool.query(query);
            if (result.rowCount > 0) {
                logger.info(`City created successfully: ${result.rows[0]}`);
                return {
                    success: true,
                    message: 'city created successfully',
                    returnedResult:  result.rows[0]
                 }
            } else {
                logger.error('City creation failed');
                return {
                    success: false,
                    message: `City checkup failed`
                };
            }
        } else {
            logger.error('No rows are inserted.State value if not valid.Check if state exists.');
            return {
                success: false,
                message: `state checkup failed`
            }
        }
        } catch (error) {
            logger.error(`Error in city creation: ${error.message}`);
            throw error;
        }
    },
}

module.exports = CountryModel;