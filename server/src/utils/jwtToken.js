const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretOrPrivateKey = process.env.JWTSecretKey | "jdfoaihjfajfdhaohfalkbflk7432095y2h3495y2047yvo84yb7b243857y3248753y4b986f32t4875623485bv23874bv24ty497y528743b59845b96459872364875c926525"
const token = (payload)=>{return jwt.sign(payload,secretOrPrivateKey,{expiresIn:'1h'})}

module.exports = token;