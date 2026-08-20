const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretOrPrivateKey = process.env.JWTSecretKey 
const token = (payload)=>{return jwt.sign(payload,secretOrPrivateKey,{expiresIn:'1h'})}

module.exports = token;