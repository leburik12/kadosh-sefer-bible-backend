const UserModel = require('../models/UserModel.js');
const logger = require('../config/logger.js');
const { redisClient } =  require('../config/config.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const services = require('../utility/services.js');

const { getUserUnauth,saveUserUnauth,getCacheUser } = require('../utility/redis_key_generator.js')
const { sendOTP,verifyOTP,sendOTP1 } = require('../controllers/TwilioSmsService.js')

const fs = require('fs');
const { log } = require('console');
const { promisify } = require('util');
const { json } = require('express');
require('dotenv').config();


const UserController = {

//     saveUserAddress : async (userObject,expirationTime) => {
//     const { phone } = userObject;
//     const key = getUserUnauth(phone);
//     const value = JSON.stringify(userObject)

//     try {
//         // for (const [field,value] of Object.entries(userObject)) {
//         //     await redisClient.HSET(key,field,value);
//         // }
//         redisClient.setEx(key,expirationTime,value, (err,reply) => {
//            if (err) {
//             console.error('Error storing data in Redis:', err);
//             return false
//            } else {
//             console.log('Data stored successfully:', reply);
//             return true
//            }
//         })
//     logger.info(`------ user address saved in redis successfully`);
//     return true;
//     } catch (error) {
//        logger.error(`Error in saving user address in redis : ${error.message}`);
//        throw error
//     }
// },

//  saveUserUnauth : async (rediskey, userData) => {

//     try {
//         await setAsync(rediskey, JSON.stringify(userData), 'EX',8000)
//         logger.info(`------ user address saved in redis successfully`);
//     } catch (error) {
//         logger.error(`Error saving user data to Redis: ${error.message}`);
//     }
// },

    getAllUsers : async (req,res,next) => {
        try {
            const users = await UserModel.getAllUsers();
            if (!users) {
                logger.error(`internal sql server error in getting all Users`);
                res.status(500).json({message: 'internal server error'});
            } else {
                res.status(200).json(users);
            } 
        } catch (error) {
          logger.error(`Error getting users: ${error.message}`);
          next(error);
        }
    },

    getUserById : async (req,res,next) => {
       const { id } = req.params;

        try {
            const user =  await UserModel.getAllUsers();
            if (!user) {
                logger.error(`user not found by this id : ${id}`);
                return res.status(404).json({success:false,message: 'user not found'});
            } else {
              logger.info(`user found by id : ${id}`);
            res.status(200).json(user);
        }
        } catch (error) {
            
        }
    },

    createUser : async (req,res,next) => {
          const { username,phone,password,countryCode } = req.body;

        try {
            //   const optresult = sendOTP(countryCode,phone,req,res,next)
            const otpResult = await sendOTP(countryCode, phone);
            logger.info(`otp result   --------------    ${ otpResult }`)
            if (otpResult == '"pending"') {
                logger.info(`inside otp result i am here`)
                const value = {username:username,phone:phone,pass:password }
                const redisKey = getUserUnauth(phone)
                logger.info(`rrrrrr   --------------    ${ redisKey }`)
                logger.info(`dddddd   --------------    ${ JSON.stringify(value) }`)
                // Save user data to Redis as a JSON string
                await saveUserUnauth(redisKey, JSON.stringify(value), 'EX',8000)
                // Retrieve user data from Redis
                const userDataJson = await getCacheUser(redisKey);
                if (userDataJson) {
                    logger.info(`User Data from redis database --- ${JSON.stringify(userDataJson,null,2)}`)
                }

                return res.status(200).json({
                    'success': true,
                    'message': 'authentication code send failed.Try again.'
                });

            } else {
                return res.status(200).json({
                    'success': true,
                    'message': 'authentication code send failed.Try again.'
                });
            }
        } catch (error){
            logger.error(`Error authenticating user ${error.message}`);
            next(error);
        }     
    },

//     createUser : async (req,res,next) => {
//         const { phone,password_hash,countryCode } = req.body;

//         logger.info(`phone : ${phone}  --  countryCode : ${countryCode} -- phone : ${phone}`)
//         try {
//         const optresult = sendOTP(countryCode,phone)
//           if (optresult == "pending") {
//               const value = {'phone': phone,'pass': password_hash}
//               const expirationTime = 600;
//               if (saveUserAddress(value,expirationTime)) {
//                   return res.status(200).json({
//                       'success': 'true',
//                       'message': 'authentication code send via phone number'
//                   });
//               }
//           } else {
//               return res.status(500).json({
//                   'success': 'false',
//                   'message': 'authentication code send failed.Try again.'
//               });
//           }
//       } catch (error){
//           logger.error(`Error authenticating user ${error.message}`);
//           next(error);
//       }     
//   },
    // verifyUserOTP : async (req,res,next) => {
    //     const { phone, otp } = req.params;
    //      try {
    //          const user =  await UserModel.getAllUsers();
    //          if (!user) {
    //              logger.error(`user not found by this id : ${id}`);
    //              return res.status(404).json({success:false,message: 'user not found'});
    //          } else {
    //            logger.info(`user found by id : ${id}`);
    //          res.status(200).json(user);
    //      }
    //      } catch (error) {         
    //      }
    //},
    login : async (req,res,next) => {
        try {
            const { phone,password } = req.body;
            logger.info(`Login data: \nphone - ${phone} \nPassword - ${password}`)
            const user = await UserModel.getUserByPhoneNumber(phone)
            logger.info(`User data: ${JSON.stringify(user.message)}`)
            if (user.success != true) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
            logger.info(`Password Match - ${JSON.stringify(user.message.password_hash)}`)
            const passwordMatch = await bcrypt.compare(password, user.message.password_hash);
            logger.info(`User password : ${passwordMatch}`)
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Authentication failed' });
            }
            const token = jwt.sign(
                {userId: user.id, phone: user.phone},
                process.env.JWT_SECRET_KEY,
               {expiresIn: '30d'}
            );
            logger.info(`JSON web token : ${token}`)
            return res.status(200).json({
                'success': true,
                'message': token
            });
            //return res.status(200).json({ token });
        } catch (error) {
          logger.error(`Error getting users: ${error.message}`);
          next(error);
        }
    },
}

module.exports = UserController;