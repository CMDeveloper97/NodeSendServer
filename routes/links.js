const express = require('express');
const router = express.Router();
const { check } = require('express-validator'); 
const linksController =  require('../controllers/linksController')
const filesController =  require('../controllers/filesController')
const auth = require('../middleware/auth');


router.post('/', 
	[
		check('name', 'Upload a file').not().isEmpty(),
        check('originalName', 'Upload a file').not().isEmpty()
	],
	auth,
	linksController.newLink
)

router.get('/',
	linksController.allLinks
)

router.get('/:url',
	linksController.hasPassword,
	linksController.getLink
)

router.post('/:url',
	linksController.verifyPassword,
	linksController.getLink
)

module.exports = router;