/**
 * Dependencies import from package.json
 */
const router = require('express').Router();

/**
 * Middleware Dependencies
 */
const findUser = require('../middleware/findUser')
const formValidation = require("../middleware/formValidation");
const loginValidation = require('../middleware/loginValidation');

/**
 * Controllers Dependencies
 */
const { registerController, loginController } = require('../controllers/authController');

/**
 * POST: Registration API
 */
router.post('/register',formValidation,findUser,registerController);


/**
 * POST: Login API
 */
router.post('/login',loginValidation, loginController)

/**
 * Export Modules of Register and Login
 */
module.exports = router;