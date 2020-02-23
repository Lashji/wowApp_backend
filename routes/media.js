'use strict';

const express = require('express');
const router = express.Router();
const MediaController = require('../controllers/media.controller')

router.get('/classes', MediaController.getClassIcons)
router.get('/specs', MediaController.getSpecIcons)

module.exports = router;