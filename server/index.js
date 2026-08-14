const express = require('express');
const app = express();

app.use(express.json())
require('dotenv').config();
const bcrypt = require('bcrypt');

const findUser = require('./src/middleware/findUser');
const formValidation = require("./src/middleware/formValidation")


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
            message:'Duplicate key error',
            error: err.message});
        }
       return res.status(500).json({
            message:'User not registered',
            error: err.message});
    }
})

app.use((err,req,res,next)=>{
    console.error(err);

    res.status(500).json({
        error: err,
        message: "internal server error"
    })
})

