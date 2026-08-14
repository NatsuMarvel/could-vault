const mongoose = require('mongoose');


const mongoclient =  async ()=>{
    await mongoose.connect(process.env.MONGODB_URL)
                  
}

module.exports = mongoclient;
