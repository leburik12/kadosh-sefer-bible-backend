const ChurchModel = require('../models/ChurchModel.js');
const logger = require('../config/logger.js');
const fs = require('fs');


const ChurchController = {

    getAllChurch : async (req,res,next) => {
        try {
            const churches = await ChurchModel.getAllChurch();
            if (!churches) {
                logger.error(`internal sql server error in getting all churches`);
                res.status(500).json({message: 'internal server error'});
            } else {
                res.status(200).json(churches);
            } 
        } catch (error) {
          logger.error(`Error getting churches: ${error.message}`);
          next(error);
        }
    },

    getChurchById : async (req,res,next) => {
       const { id } = req.params;

        try {
            const church =  await ChurchModel.getChurchById();
            if (!church) {
                logger.error(`church not found by this id : ${id}`);
                return res.status(404).json({success:false,message: 'church not found'});
            } else {
              logger.info(`church found by id : ${id}`);
            res.status(200).json(church);
        }
        } catch (error) {
            logger.error(`Error getting church by id ${error.message}`);
            next(error);
        }
    },

    createChurch : async (req,res,next) => {
          const { name,image_name,description_text,id_user,id_city,email,phone,longitude,latitude} = req.body;
        
          try {
            const user_id =  req.userData.id;
            const church = await ChurchModel.createChurch(name,image_name,description_text,id_user,id_city,email,phone,longitude,latitude);
            if (church.success !== true) {
             return res.status(500).json({
                success: false,
                message: 'Internal error'
           }) 
            } else {
             logger.error(`internal server error in create church`);
             res.status(500).json({message: 'Internal server error'});
            }
          } catch (error) {
            logger.error(`Error in create church ${error.message}`);
            next(error);
          }
    },
}

module.exports = ChurchController;