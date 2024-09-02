const logger = require('../config/logger.js');
const UserModel = require('../models/UserModel.js');
const bcrypt = require('bcrypt');
const { getCacheUser,getUserUnauth,getUserUnauth1 } = require('../utility/redis_key_generator.js');
require('dotenv').config();

const {TWILIO_SERVICE_SID,TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN} = process.env;
const client = require('twilio')(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,{lazyLoading: true});

const sendOTP = async (countryCode,phone) => {  
  logger.info(`country code: ${countryCode} ------ phone : ${phone}`)

    try {
        const otpResponse = await client.verify.v2.services(TWILIO_SERVICE_SID)
                 .verifications.create({
                    to: `${countryCode}${phone}`,
                    channel: "sms"
                 });
                 logger.info(`OTP 00000000000 response - ${JSON.stringify(otpResponse.status)}`)
                 logger.info(`OTP sent successfully - ${JSON.stringify(otpResponse)}`);
                 return  JSON.stringify(otpResponse.status);
    } catch (error) {
        logger.error(`OTP sent error - ${error.message}`);
        throw error;
        //res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
};


const sendOTP1 = (countryCode, phone) => {
  return new Promise((resolve, reject) => {
      client.verify.v2.services(TWILIO_SERVICE_SID)
          .verifications
          .create({ to: `${countryCode}${phone}`, channel: 'sms' })
          .then((verification) => {
              console.log(`OTP sent successfully - Status: ${verification.status}`);
              logger.info(`OTP sent successfully - ${JSON.stringify(verification)}`);
              resolve(verification.status);  // Return the status on success
          })
          .catch((e) => {
              console.log(`OTP send error - ${e.message}`);
              logger.error(`OTP sent error - ${e.message}`);
              reject(e);  // Pass the error to be handled by the caller
          });
  });
};
// const verifyOTP = async (req,res,next) => {
//    const { countryCode, phone, otp } = req.body;
//    try {
//     const userkey = keyGenerator.getUserAuthKey(phone);
//                   const verifiedResponse = {
//                     'valid': true
//                   }
//                   if (verifiedResponse['valid'] === true) {
//                    try {
//                    const user = await UserModel.createUser(phone,password);
//                     if (user.success === true) {
//                        logger.info(`User saved successfully. ${user.createdUser}`);
//                        return res.status(200).json({success:true,message: `Registration successfull.`});
//                        ;
//                    } else {
//                     logger.error(`Error in saving user. ${user.createdUser}`)
//                    return res.status(500).json({success:false,message: `Registration failed.Sorry try again.`})
//                    } 
//               } catch(error) {
//                   logger.error(`User creation failed after verification - ${error.message}`);
//                   next(error);
//                 }
//             } else {
//               return res.status(500).json({success:false,message: `OPT verification failed.`})
//              }
//    } catch (error) {
//     logger.error(`verify OTP  error - ${error.message}`);
//     next(error);
//     //res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
//    }
// };

const verifyOTP = async (req,res,next) => {
  const {countryCode,phone,otp} = req.body

  logger.info(`otp verify inserted in detail ........................countryCode --  ${countryCode}\nphone-- ${phone} otp - ${otp}`);
  
  try {
    const verifiedResponse = await client.verify.v2.services(TWILIO_SERVICE_SID)
    .verificationChecks.create({
      to: `${countryCode}${phone}`,
      code: otp
    })

    if (verifiedResponse.status == 'approved') { 
      logger.info(`verify OTP valid`);
      const redisKey = getUserUnauth(phone)
      logger.info(`Redis Key ------------   ${redisKey}`)
      let saveduser = await getUserUnauth1(redisKey)

      logger.info(`User info ------------   ${JSON.stringify(saveduser)}`)

      if (saveduser) {
          const { phone, pass } = saveduser
          logger.info(`User saved data in redis \nphone ${phone} \n password: ${pass}`)
          const hashedPassword = await hashPassword(pass)
          const user = await UserModel.createUser(phone,hashedPassword)
          if (user) {
            return res.status(200).send({
              'success': 'true', 
              'message': JSON.stringify(verifiedResponse)
            })
          }
      } else {
        logger.error(`no data chached in redis error`);
        return res.status(500).send({
          'success': 'false', 
          'message': 'OPT error'
        })
      }
      return res.status(200).send({
        'success': 'true', 
        'message': JSON.stringify(verifiedResponse)
      })
  } else {
    return res.status(500).send({
      'success': 'false', 
      'message': 'OPT error'
    })
  }
  } catch (error) { 
    logger.error(`verify OTP  error - ${error.message}`);
    res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
  }
};

async function hashPassword(password, saltRounds=10) {

  try {
   // const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password,10)
    return hashedPassword
  } catch (error) {
    logger.error(`password hash failed: ${error.message}`);
    return false
  }
};


module.exports = { sendOTP, verifyOTP ,sendOTP1};