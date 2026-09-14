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
const {uploadCompleteController, uploadUrlController} = require('../controllers/uploadController')

/**
 * Generate Upload-URL API
 */
router.post('/url',authorization, uploadUrlController)

/**
 * Upload Complete API
 */
router.post('/complete', authorization, uploadCompleteController)

/**
 * Export Router
 */
module.exports = router;