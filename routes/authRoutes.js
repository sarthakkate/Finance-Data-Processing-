const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorizeRoles } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');


router.post('/register', validateRegister, authController.register);


router.post('/login', validateLogin, authController.login);


router.get('/profile', authenticate, authController.getProfile);


router.put('/profile', authenticate, authController.updateProfile);


router.post('/logout', authenticate, authController.logout);

module.exports = router;
