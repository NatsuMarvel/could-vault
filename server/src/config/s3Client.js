const s3Client = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new s3Client({
    region: process.env.AWS_REGION
})

module.exports=s3;