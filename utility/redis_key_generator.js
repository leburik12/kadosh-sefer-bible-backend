require('dotenv').config()
const { promisify } = require('util');
const logger = require('../config/logger.js');
const { redisClient } =  require('../config/config.js');
const bcrypt = require('bcrypt');

let prefix = process.env.REDIS_KEY_PREFIX;
const getKey = key => `${prefix}:${key}`;
const getUserUnauth = phonenum => getKey(`users:unauth:${phonenum}`)

const saveUserUnauth = async (rediskey, userData) => {
    try {
         // Delete existing data for the key
         await redisClient.del(rediskey);
         logger.info(`------ user address delete with a key in redis successfully`);
         logger.info(`Save User info in redis --- ${userData}`)

        // Save JSON stringified data with expiration
        await redisClient.set(rediskey, userData, {
            EX: 86400
        })
        // await setAsync(rediskey, JSON.stringify(userData), 'EX',8000)
        logger.info(`------ user address saved in redis successfully`);
    } catch (error) {
        logger.error(`Error saving user data to Redis: ${error.message}`);
    }
}

const getCacheUser = async (key) => {
     try {
          // Retrieve the data associated with the key
          const userDataJson = await redisClient.get(key)

          // If the key doesn't exist, return null or handle it as needed
          if (!userDataJson) {
            logger.info(`------ user address not found in redis`);
            return null;
          }

          // Parse the JSON string back into an object
          const userObject = JSON.parse(userDataJson);
          logger.info(`------ user address found in redis`);
          return userObject;

     } catch (error) {
        logger.error(`Error saving user data to Redis: ${error.message}`);
     }
}

const getUserUnauth1 = async (rediskey) => {
    try {
        // Get the data from Redis
        const userData = await redisClient.get(rediskey);
        logger.warn(`------ data in Redis for the key: ${rediskey} ---- data: ${userData}`);
        if (userData) {
            // Parse the data if it's in JSON format (if it was stringified before storing)
            const parsedData = JSON.parse(userData);
            logger.info(`------ user data retrieved from Redis successfully`);
            logger.info(`------ user data retrieved from Redis --- ${JSON.stringify(parsedData)}`)
            return parsedData;
        } else {
            logger.warn(`------ No data found in Redis for the key: ${rediskey}`);
            return null;
        }
    } catch (error) {
        logger.error(`Error retrieving user data from Redis: ${error.message}`);
        throw error; // Re-throw the error for further handling if needed
    }
};


async function hashPassword(password, saltRounds = 10) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        logger.error(`password hash failed: ${error.message}`);
        return false;
    }
}

module.exports = { getUserUnauth ,getUserUnauth1, saveUserUnauth,getCacheUser,hashPassword }


