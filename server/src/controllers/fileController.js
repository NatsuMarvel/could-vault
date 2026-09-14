/**
 * Package Dependencies
 */
const {Readable} = require('stream');
const {GetObjectCommand,DeleteObjectCommand} = require('@aws-sdk/client-s3');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');

/**
 * Model Dependencies
 */
const Uploads = require('../models/uploads');

/**
 * Config Dependencies
 */
const s3Client = require('../config/s3Client');

/**
 * Get Files Controller
 */
const getFilesController = async(req,res)=>{
    try{
        const files = await Uploads.find({userId: req.user},'fileName contentType size');
        return res.status(200).json({
            files
        })
        

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * Download File Controller
 */
const downloadFileController = async(req,res)=>{
    try{
        const isFileExists =await Uploads.findOne({_id: req.params.id,userId:req.user})
        if(isFileExists){
            const getFile = new GetObjectCommand({
                Key: isFileExists.s3Key,
                Bucket:process.env.AWS_BUCKET_NAME
            })
            const results =await s3Client.send(getFile);
            res.attachment(isFileExists.fileName);
            res.contentType(isFileExists.contentType);


            const stream = Readable.fromWeb(results.Body.transformToWebStream());

            return stream.pipe(res);
        }
        return res.status(404).json({
            message: "File Not Found"
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

/**
 * Delete File Controller 
 */
const deleteFileController = async(req,res)=>{
    try{
        
        const file = await Uploads.findOne({_id:req.params.id, userId: req.user});
        
        if(!file){
            return res.status(404).json({
                message: 'File Not Found'
            })
        }

        const deleteObject = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.s3Key
        })

        await s3Client.send(deleteObject);
        
        const isFileDeleted = await file.deleteOne();

        if(isFileDeleted.deletedCount ===1){
            return res.status(200).json({
                message: "File deleted successfully"
            })
        }
        else{
            console.error('File deletion failed:', {
                fileId: file._id,
                userId: req.user,
                s3Key: file.s3Key,
                fileName: file.fileName
            });
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }
        
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * Generate Download-URL Controller
 */
const getDownloadUrlController = async(req,res)=>{
    try{
        const file = await Uploads.findOne({_id:req.params.id,userId:req.user});

        if(!file){
            return res.status(404).json({
                message: "File Not Found"
            })
        }

        const downloadFile = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key : file.s3Key
        })

        const downloadUrl = await getSignedUrl(s3Client,downloadFile,{expiresIn:360})

        return res.status(200).json({
            url: downloadUrl
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

/**
 * Export Controllers
 */
module.exports = {getFilesController,getDownloadUrlController,downloadFileController,deleteFileController}