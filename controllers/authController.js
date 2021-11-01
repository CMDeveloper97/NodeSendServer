const User = require("../models/User");
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' })


exports.authUser = async (req, res, next) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

	const { email, password } = req.body;

	try {
		let searchedUser = await User.findOne({ email });
		if (!searchedUser) {
			res.status(401).json({ msg: "User doesn't exist" });
			return next();
		}

		if (bcryptjs.compareSync(password, searchedUser.password)) {
			const token = jwt.sign({
				id: searchedUser._id,
				name: searchedUser.name,
				email: searchedUser.email
			}, process.env.SECRETA, {
				expiresIn: '1h'
			}); 
			res.json({ token });

		} else {
			res.status(401).json({ msg: "Password or email is incorrect" });
			return next();
		}

	} catch (error) {
		console.error(error);
		res.status(400).send("There's was an error");
	} 
}


exports.userAuthenticated = async (req, res) => { 
	res.json({user: req.user});
}