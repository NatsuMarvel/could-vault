/**
 * Package Dependencies
 */
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post');
const { HeadObjectCommand } = require('@aws-sdk/client-s3');

/**
 * Model Dependencies
 */
const Uploads = require('../models/uploads');

/**
 * Config Dependencies
 */
const s3Client = require('../config/s3Client');

/**
 * Global Constants
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * URL Controller
 */
const uploadUrlController = async(req,res)=>{
    try{
        const {fileName, fileType, fileSize} = req.body;

        if(!fileName || !fileType || typeof fileSize !== "number"){
            return res.status(400).json({
                message : "fileName, fileType and fileSize are required"
            })
        }

        if(fileSize > MAX_FILE_SIZE){
            return res.status(400).json({
                message : "fileSize should be less than 5MB"
            })
        }

        const Key = `users/${req.user}/${Date.now()}-${fileName}`;

        const presignedURL = await createPresignedPost(s3Client,{
            Bucket : process.env.AWS_BUCKET_NAME,
            Key,
            Conditions:[
                ['content-length-range',0,MAX_FILE_SIZE],
                ['eq','$Content-Type',fileType]
            ],
            Fields:{
                'Content-Type' : fileType
            },
            Expires: 180
            
        })


        return res.status(200).json({
            message: "URL generated successfully",
            url: presignedURL.url,
            fields: presignedURL.fields,
            key: Key
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * Upload Complete Controller
 */
const uploadCompleteController = async(req,res)=>{
    try{
        const {key, fileName, fileType, fileSize} = req.body;

        if(!key || !fileName || !fileType || typeof fileSize !== "number"){
            return res.status(400).json({
                message: "key, fileName, fileType and fileSize are required"
            })
        }

        const parts = key.split('/');

        if(parts.length < 3 || parts[0] !== 'users' ||parts[1] !== String(req.user) ){
            return res.status(403).json({
                message: 'Access denied'
            })
        }

        const isFileExists = await Uploads.findOne({userId:req.user,s3Key:key});

        if(isFileExists){
            return res.status(409).json({
                message: "File Already Exists"
            })
        }

        const fileCommand = new HeadObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        })

        const file = await s3Client.send(fileCommand);

        if(file.ContentLength > MAX_FILE_SIZE || fileSize > MAX_FILE_SIZE){
            return res.status(400).json({
                message: "fileSize should be less than 5MB"
            })
        }
        
        const newFile = new Uploads({
            userId: req.user,
            bucketName: process.env.AWS_BUCKET_NAME,
            s3Key: key,
            fileName: fileName,
            contentType: file.ContentType ?? fileType,
            size: file.ContentLength ?? fileSize
        });

        await newFile.save();

        return res.status(200).json({
            message: "File Uploaded Successfully"
        })

    }catch(error){
        console.log(error);
        if(error.code === 11000){
          return res.status(409).json({
                message: "File Already Exists"
            })
        }
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * Export Controllers
 */
module.exports = {uploadCompleteController, uploadUrlController}