/**
 * Dependencies from Package
 */
const router = require('express').Router();

/**
 * Dependencies from Middleware
 */
const authorization = require('../middleware/auth');

/**
 * Controller Dependencies
 */
const profileController = require('../controllers/userController')

/**
 * GET: Profile Route
 */
router.get('/profile',authorization, profileController)


/**
 * Exporting router
 */
module.exports = router;