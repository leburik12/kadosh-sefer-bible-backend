const { pool } = require('../config/config.js');
const logger = require('../config/logger.js');

require('dotenv').config();

const UserModel = {

    saltRounds : 10,

    checkForeignKeysExist: async (id,tableName) =>  {
        const query = `SELECT COUNT(*) FROM ${tableName} WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0].count > 0;
    },

    checkUniqueness: async (tableName,columnType, value) => {
        const query = `SELECT COUNT(*) FROM ${tableName} WHERE ${columnType} = $1`;
        const result = await pool.query(query, [value]);
        return result.rows[0].count === 1;
    },

    getAllUsers : async (limit,offset) => {
        const query = {
            text: 'SELECT * FROM "user" ORDER BY id ASC LIMIT $1 OFFSET $2',
            values: [limit, offset]
        };
        try {
          const users = await pool.query(query);
          if (users.rows.length === 0) {
            logger.error('Users return failed');
            return {
                success: false,
            }
          }
          logger.info(`Users returned successfuly ${users.rows}`);
           return {
                success: true,
                message: districts.rows 
            } 
        } catch (error) { 
            logger.error(`Error fetching users : ${error.message}`);
            throw error;
        }
    },

    getUserById : async (id) => {
        const query = {
            text: 'SELECT * FROM "user" WHERE id = $1',
            value : [id],
        };
        try {
            const result = await pool.query(query);
            if (result.rows.length !== 1) {
                logger.error(`No User found by ID : ${id}`);
                return {
                success: false
               } 
            } else if (result.rows.length === 1) {
                logger.info(`User returned by ID : ${id}`);
                return {
                   success: true,
                   message: result.rows[0]
               }
            }
        } catch(error) {
            logger.error(`Error fetching users : ${error.message}`)
            throw error;
        }
    },

    getUserByPhoneNumber : async (phone) => {
        logger.info(`GetUserByPhoneNumber : ${phone}`)
        const query = {
            text: `SELECT * FROM "user" WHERE phone = $1`,
            values : [phone],
        };
        try {
            const result = await pool.query(query);
            if (result.rows.length !== 1) {
                logger.error(`No User found by Phone : ${phone}`);
                return {
                success: false
               } 
            } else if (result.rows.length === 1) {
                logger.info(`User returned by phone : ${phone}`);
                return {
                   success: true,
                   message: result.rows[0]
               }
            }
        } catch(error) {
            logger.error(`Error fetching user by phone : ${error.message}`)
            throw error;
        }
    },

    createUser: async (phone,password_hash) => {
        
        try {

        const query = {
            text: `INSERT INTO "user" (phone,password_hash)
                VALUES($1,$2) RETURNING *`,
            values : [phone,password_hash]
        };
            
        const user =  await pool.query(query);
        if (user.rowCount > 0) {
            logger.info(`User created successfully: ${user.rows[0]}`);
            return {
                success: true,
                message:  user.rows[0]
             }
         } else {
            logger.error('No rows are inserted');
            return {
                success: false,
                message: "Error occurred in creating user"
            }
          } 
        } catch (error) {
            logger.error(`Error in user creation userModel : ${error.message}`);
            throw error;
        }
    },
}

module.exports =  UserModel ;