const Link = require('../models/Link');
const shortid = require('shortid');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.newLink = async (req,res,next)=> {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	
	const { originalName, name } = req.body;
	const link = new Link();
	link.url = shortid.generate();
	link.name = name;
	link.originalName = originalName;

	//If the user is authenticated
	if(req.user){
		const { password, downloads } = req.body; 
		downloads ? link.downloads = downloads : null;   
		link.author = req.user.id;

		const salt = await bcryptjs.genSalt(10);
		password ? link.password = await bcryptjs.hash(password, salt) : null;  
	}

	try {
		await link.save();
		return res.json({msg: link.url});
		next();
	} catch (error) {
		console.error(error);
	}
	

}

exports.allLinks = async(req,res,next) => {
	try{	
		const links = await Link.find({}).select('url -_id');
		res.json({links});
	}catch(err){
		console.log(err)
	}
}

exports.hasPassword = async (req,res,next) => {
	const { url } = req.params;
	const link = await Link.findOne({ url });

	if(!link) {
        res.status(404).json({msg: "Link doesn't exits"});
        return next();
    }
    
	if(link.password){
		return res.json({password: true, link: link.url})
	}

	next();
}

exports.verifyPassword = async (req,res,next) => {
	const {url} = req.params; 
	const {password} = req.body;
	
	const link = await Link.findOne({url});

	if(bcryptjs.compareSync(password, link.password)){
		next();
	}else{
		return res.status(401).json({msg:'Wrong Password'})
	} 

}


exports.getLink = async (req,res,next)=> { 
	const { url } = req.params;
	const link = await Link.findOne({ url });

	if(!link) {
        res.status(404).json({msg: "Link doesn't exits"});
        return next();
    }
   
	res.json({file: link.name, password: false})  

	next();
}
