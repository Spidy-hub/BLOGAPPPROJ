const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')


router.post('/register', authController.register)
router.post('/login', authController.login)

router.get('/register', authController.register_get)
router.get('/login', authController.login_get)
router.get('/logout', authController.logout_get)


module.exports = router;