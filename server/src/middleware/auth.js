const jwt = require('jsonwebtoken');
require('dotenv').config();

const authorization = (req,res,next)=>{
    try{
    const tokenHeader = req.header('Authorization');
    if(tokenHeader){
        const parts = tokenHeader.split(' ');
        if(parts.length !==2 || parts[0] !== 'Bearer' || !parts[1]){
            return res.status(401).json({
                message: 'Unauthorized access'
            })
        }
        const token = parts[1];
        const secretKey = process.env.JWTSecretKey 
        const payload = jwt.verify(token,secretKey);

        req.user = payload.id;
        return next()
    }
    return res.status(401).json({
        message: 'Unauthorized access'
    })
            
    }catch(err){
       return res.status(401).json({
            message: 'Unauthorized access'
        })
    }
    
}

module.exports = authorization;

