const express = require('express');
const app = express();

app.use(express.json())
require('dotenv').config();
const bcrypt = require('bcrypt');

const findUser = require('./src/middleware/findUser');
const formValidation = require("./src/middleware/formValidation");
const tokenGenerator = require('./src/utils/jwtToken');
const loginValidation = require('./src/middleware/loginValidation');
const authorization = require('./src/middleware/auth')


const mongoose = require('mongoose');
const mongoClient = require('./src/config/mongoose');

mongoClient().then(()=>{
    console.log('db is connected');
    app.listen(8000,()=>{
    console.log('port is running on 8000')
});

}).catch((error)=>{
    console.error(error)
});


const User = require('./src/models/User');

app.get('/',(req,res)=>{
    res.send('welcome to cloudvalut')
});




app.post('/register',formValidation,findUser,async (req,res)=>{

    try{
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password , 16);
        const newUSer = new User({
            username,
            password: hashedPassword,
            email:email.toLowerCase()
        })
        await newUSer.save();
        res.status(201).send('new user added sucessfully');
    }catch(err){
        console.error(err);
        if(err.code === 11000){
           return res.status(409).json({
            message:'Username or email already exists',
            });
        }
       return res.status(500).json({
            message:'User not registered',
            error: err.message});
    }
});

app.post('/login',loginValidation, async (req,res)=>{
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
})

app.get('/profile',authorization, (req,res)=>{
    res.status(200).json({
        message: `${req.user} can access`
    })
})

app.use((err,req,res,next)=>{
    console.error(err);

    res.status(500).json({
        error: err,
        message: "internal server error"
    })
})

