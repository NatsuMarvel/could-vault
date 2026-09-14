/**
 * Package Dependencies
 */
const express = require('express');

/**
 * Routes Dependencies
 */
const authRoute = require('./src/routes/authRoutes');
const userRoute = require('./src/routes/userRoutes');
const uploadRoute = require('./src/routes/uploadRoutes');
const fileRoute = require('./src/routes/fileRoutes');

/**
 * Creating express applicaton 
 */
const app = express();

/**
 * Adding json middleware
 */
app.use(express.json());

/**
 * Home API
 */
app.get('/',(req,res)=>{
    res.send('welcome to cloudvalut')
});

/**
 * Register and Login Routes
 */
app.use('/api/v1/auth',authRoute);

/**
 * Profile Routes
 */
app.use('/api/v1/user',userRoute);

/**
 * Upload Routes
 */
app.use('/api/v1/uploads',uploadRoute);

/**
 * Files Routes
 */
app.use('/api/v1/files',fileRoute);

module.exports = app;