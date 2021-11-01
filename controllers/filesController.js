const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const Link = require('../models/Link');
 
exports.uploadFile = async (req,res, next) => {
	const multerConfiguration = {
		limits: {fileSize: req.user ? (1024*1024*10) : (1024*1024) },
		storage: fileStorage = multer.diskStorage({
			destination: (req, file, cb) => {
				cb(null, __dirname + '/../uploads') 
			},
			filename: (req, file, cb) => { 
				const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length); 
				cb(null, `${shortid.generate()}${extension}`)
			}, 
		})
	} 

	const upload = multer(multerConfiguration).single('file');

	upload( req, res, async(error) => {
		if(!error){
			await res.json({file: req.file.filename});
		} else {
			console.error(error);
			return next();
		}

	}); 
}

exports.download = async (req,res, next) =>{

	const {file} = req.params;
	const link = await Link.findOne({name: file})
	
	
	const {downloads, name, originalName, _id} = link;  

	const fileDownload = __dirname + '/../uploads/' + file;
	res.download(fileDownload, originalName);  
	
	//Delete file 

	if(downloads === 1){
		req.file = name;
		await Link.findByIdAndDelete(_id); 
		next();
	}else{
		link.downloads--;
		await link.save();
	}


}

exports.deleteFile = async (req,res) => {  
	try {
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`); 
    } catch (error) {
        console.log(error);
    }

}