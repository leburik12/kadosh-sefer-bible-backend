const express = require('express');
const router = express.Router();
const churchController = require('../controllers/ChurchController.js');


router.get('/:id',churchController.getChurchById);
router.get('/all',churchController.getAllchurch_event);
router.get('/create',churchController.createChurch);
router.get('/cevent/:id',churchController.getChurchEventByChurchId);

module.exports = router;