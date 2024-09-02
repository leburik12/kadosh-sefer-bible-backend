const express = require('express');
const router = express.Router();
const churchEventController = require('../controllers/ChurchEventController.js');


router.get('/:id',churchEventController.getChurchById);
router.get('/all',churchEventController.getAllchurch_event);
router.get('/create',churchEventController.createChurch);
router.get('/cevent/:id',churchEventController.getChurchEventByChurchId);

module.exports = router;