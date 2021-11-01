const express = require('express');
const router = express.Router(); 
const filesController =  require('../controllers/filesController')
const auth = require('../middleware/auth'); 

router.post('/', 
	auth,
	filesController.uploadFile
) 

router.get('/:file',
	filesController.download,
	filesController.deleteFile
)

router.delete('/:id', 
	filesController.deleteFile
)

module.exports = router;