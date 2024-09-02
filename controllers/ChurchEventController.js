const ChurchEventModel = require('../models/ChurchEventModel.js');
const logger = require('../config/logger.js');
const fs = require('fs');


const ChurchEventController = {

    getAllchurch_event : async (req,res,next) => {
        try {
            const church_event = await ChurchEventModel.getAllchurch_event();
            if (!church_event) {
                logger.error(`internal sql server error in getting all church_event`);
                res.status(500).json({message: 'internal server error'});
            } else {
                res.status(200).json(churche_programs);
            } 
        } catch (error) {
          logger.error(`Error getting churche_programs: ${error.message}`);
          next(error);
        }
    },

    getChurchById : async (req,res,next) => {
       const { id } = req.params;

        try {
            const churche_programs =  await ChurchEventModel.getChurchById(id);
            if (!churche_programs) {
                logger.error(`churche_programs not found by this id : ${id}`);
                return res.status(404).json({success:false,message: 'churche_programs not found'});
            } else {
              logger.info(`churche_programs found by id : ${id}`);
            res.status(200).json(church);
        }
        } catch (error) {
            logger.error(`Error getting churche_programs by id ${error.message}`);
            next(error);
        }
    },

    getChurchEventByChurchId : async (req,res,next) => {
        const { id } = req.params;
 
         try {
             const churche_events =  await ChurchEventModel.getChurchEventByChurchId(id);
             if (!churche_events) {
                 logger.error(`churche_events not found by this church id : ${id}`);
                 return res.status(404).json({success:false,message: 'churche_events not found by church id'});
             } else {
               logger.info(`churche_events found by church id : ${id}`);
             res.status(200).json(churche_events);
         }
         } catch (error) {
             logger.error(`Error getting churche_events by church id ${error.message}`);
             next(error);
         }
     },

    createChurch : async (req,res,next) => {
          const { program_name,description,program_date,start_time,end_time,id_church } = req.body;
        
          try {
            const user_id =  req.userData.id;
            const church = await ChurchEventModel.createChurch(program_name,description,program_date,start_time,end_time,id_church);
            if (church.success !== true) {
             return res.status(500).json({
                success: false,
                message: 'Internal error'
           }) 
            } else {
                logger.info(`churche_programs create`);
                res.status(200).json(church);
            }
          } catch (error) {
            logger.error(`Error in create church ${error.message}`);
            next(error);
          }
    },
}

module.exports = ChurchEventController;