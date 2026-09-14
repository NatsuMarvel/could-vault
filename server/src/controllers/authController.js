/**
 * Package Dependencies
 */
const bcrypt = require('bcrypt');

/**
 * Model Dependencies
 */
const User = require('../models/User');

/**
 * Utility Dependencies
 */
const tokenGenerator = require('../utils/jwtToken');

/**
 * Register Controller
 */
const registerController = async (req,res)=>{

    try{
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password , 16);
        const newUser = new User({
            username,
            password: hashedPassword,
            email:email.toLowerCase()
        })
        await newUser.save();
        return res.status(201).json({
            message: 'new user added sucessfully'
        });
    }catch(err){
        console.error(err);
        if(err.code === 11000){
           return res.status(409).json({
            message:'Username or email already exists',
            });
        }
       return res.status(500).json({
            message:'User not registered',
        });
    }
}

/**
 * Login Controller
 */
const loginController = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email: email.toLowerCase()});
        if(user){
            const isPasswordValid = await bcrypt.compare(password,user.password);
            if(isPasswordValid){
                const payload = {id:user._id}
                const token = tokenGenerator(payload)
                return res.status(200).json({
                    message: 'User logged successfully',
                    token
                });
            }else{
                return res.status(401).json({
                    message: "Invalid Credentials"
                });
            }
        }
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }catch(err){
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * Export Register and login Controllers
 */
module.exports = { registerController , loginController}