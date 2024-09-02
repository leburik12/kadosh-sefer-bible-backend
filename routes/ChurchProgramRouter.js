const express = require('express');
const router = express.Router();
const churchProgramController = require('../controllers/ChurchProgramController.js');


router.get('/:id',churchProgramController.getChurchById);
router.get('/all',churchProgramController.getAllChurchProgram);
router.get('/create',churchProgramController.createChurch);
router.get('/cprogram/:id',churchProgramController.getChurchProgramByChurchId);

module.exports = router;