 const express = require('express');
 const router = express.Router();
 const { check } = require('express-validator'); 
 const usersController =  require('../controllers/usersController');
  
 //api/users
router.post('/', 
 	[
		check('name', 'Name is obligatory').not().isEmpty(),
		check('email', 'Email invalid').isEmail(),
		check('password', 'The password must contain at least 6 characters').isLength({min:6})
	],
	usersController.createUser
);

module.exports = router;