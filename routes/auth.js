const express = require('express');
const router = express.Router();
const { check } = require('express-validator'); 
const authController =  require('../controllers/authController')
const auth = require('../middleware/auth');

router.post('/',
	[
		check('email', 'Email invalid').isEmail(),
		check('password', 'Password is obligatory').not().isEmpty()
	],
	authController.authUser
);

router.get('/', 
	auth,
	authController.userAuthenticated
)

module.exports = router;