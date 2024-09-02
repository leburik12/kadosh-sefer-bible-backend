const CityModel = require('../models/CityModel.js');
const logger = require('../config/logger.js');
const fs = require('fs');


const CityController = {

    getAllCities : async (req,res,next) => {
        try {
            const cities = await CityModel.getAllCities();
            if (!cities) {
                logger.error(`internal sql server error in getting all cities`);
                res.status(500).json({message: 'internal server error'});
            } else {
                res.status(200).json(cities);
            } 
        } catch (error) {
          logger.error(`Error getting cities: ${error.message}`);
          next(error);
        }
    },

    getCityById : async (req,res,next) => {
       const { id } = req.params;

        try {
            const city =  await CityModel.getCityById();
            if (!city) {
                logger.error(`city not found by this id : ${id}`);
                return res.status(404).json({success:false,message: 'city not found'});
            } else {
              logger.info(`city found by id : ${id}`);
            res.status(200).json(church);
        }
        } catch (error) {
            logger.error(`Error getting city by id ${error.message}`);
            next(error);
        }
    },

    createCity : async (req,res,next) => {
          const { city_name,id_country } = req.body;
        
          try {
            const user_id =  req.userData.id;
            const city = await CityModel.createCity(city_name,id_country);
            if (city.success !== true) {
             return res.status(500).json({
                success: false,
                message: 'Internal error'
           }) 
            } else {
                logger.info(`city create`);
                res.status(200).json(city);
            }
          } catch (error) {
            logger.error(`Error in create city ${error.message}`);
            next(error);
          }
    },

    
}

module.exports = CityController;