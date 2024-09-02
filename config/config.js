const { Pool } = require('pg');
require('dotenv').config();
const redis = require('redis');
const logger = require('../config/logger.js');

const pool = new Pool ({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
})

const redisClientConfig = {
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	retry_strategy: (options) => {
		if (options.attempt > 5) {
			return new Error('Retry attemps exhausted');
		}

		return (options.attempt * 1000);
	},
};

const redisClient = redis.createClient(redisClientConfig);

// Attempt to connect and handle errors
(async () => {
    try {
      await redisClient.connect();
      console.log('Successfully connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
    }
  })();

redisClient.on('connect', () => {
    logger.info('**** Redis connection was successfull.');
 });

redisClient.on('error', (err) => {
    console.error('Redis client error: ',err);
});


pool.on('error', (err) => {
    logger.error(`Postgresql pool error: ${err}`);
 });

 const checkConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        logger.info(`Connected to the database yesssss : ${res.rows[0].now}`);
    }  catch (error) {
        logger.error(`Error connection to the database: ${error}`);
    }
 }
 checkConnection()

 module.exports = { pool,redisClient }