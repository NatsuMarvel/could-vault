const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    userId : {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bucketName:{
        required: true,
        type: String
    },
    s3Key:{
        required: true,
        type: String
    },
    fileName: {
        required: true,
        type: String
    },
    contentType:{
        required: true,
        type: String
    },
    size:{
        required: true,
        type: Number
    }
},{timestamps: true})

const Uploads = mongoose.model('Uploads', uploadSchema);

module.exports = Uploads;