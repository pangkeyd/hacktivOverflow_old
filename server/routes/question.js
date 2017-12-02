const express = require('express');
const router = express.Router()
const Question = require('../controllers/question')

router.get('/', Question.getData)

module.exports = router
