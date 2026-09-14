/**
 * Package Dependencies
 */
const router = require('express').Router();

/**
 * Dependencies from Middleware
 */
const authorization = require('../middleware/auth');

/**
 * Controller Dependencies
 */
const {getFilesController,getDownloadUrlController,downloadFileController,deleteFileController} = require('../controllers/fileController');

/**
 * GET: Files API
 */
router.get('/',authorization,getFilesController);

/**
 * GET: Download a File API
 */
router.get('/:id/download',authorization,downloadFileController );

/**
 * DELETE: Delete a File API
 */
router.delete('/:id',authorization,deleteFileController);

/**
 * GET: Download URL of a File
 */
router.get('/:id/download-url',authorization,getDownloadUrlController)


/**
 * Export router
 */
module.exports = router;