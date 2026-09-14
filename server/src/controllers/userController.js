/**
 * Dependencies from Models
 */
const User = require('../models/User');

/**
 * Profile Controller
 */
const profileController = async(req,res)=>{
    try{
        const user = await User.findById(req.user,'username email');
        if(user){
            return res.status(200).json({
                username: user.username,
                email: user.email
            })
        }
        return res.status(404).json({
            message: 'user not found'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

/**
 * Export profile controller
 */
module.exports = profileController;