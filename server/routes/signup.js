const express = require('express');
const router = express.Router()
const User = require('../controllers/signup')

router.get('/', User.getData)

router.get('/email/:email', User.getDataEmailExist)

router.get('/user/:user', User.getDataUserExist)

router.post('/', User.saveData)

module.exports = router
