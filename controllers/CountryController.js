const express = require('express');
const router = express.Router();
const cityController = require('../controllers/c .js');


router.get('/:id',cityController.getCityById );
router.get('/all',cityController.getAllCities);
router.get('/create',cityController.createCity)

module.exports = router;