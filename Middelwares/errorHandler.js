const logger = require('../config/logger.js');

const errorHandler = (err,req,res,next) => {
   logger.error(`URL : ${req.url} - Error at : ${err.stack}`)
   return res.status(500).json({message: 'Interval server Occurred'});
}
module.exports = errorHandler;