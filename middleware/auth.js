const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' })

module.exports = async (req, res, next ) => {
	const authHeader = req.get('Authorization');
	if(authHeader){
		const token = authHeader.split(' ')[1];

		try {
			const user = await jwt.verify(token, process.env.SECRETA);
			req.user = user;
		} catch (error) {
			res.status(400).send("Token no valido");
			console.log(error);
		}
	}  
 
	return next();
}