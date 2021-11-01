const User = require("../models/User");
const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');

exports.createUser = async (req, res) => {

	const errors = validationResult(req);
	if(!errors.isEmpty()){
		return res.status(400).json({errors: errors.array() })
	}

	const { email, password, name } = req.body;

	try {
		let searchUser = await User.findOne({email});  
		if(searchUser) return res.status(400).json({msg: 'User already exists'});

		const user = new User(req.body); 

		const salt = await bcryptjs.genSalt(10);
		user.password = await bcryptjs.hash(password, salt );
 
		await user.save(); 
		res.json({ msg: "User created" });

	} catch (error) {
		console.error(error);
		res.status(400).send("An error has occurred");
	}

};
