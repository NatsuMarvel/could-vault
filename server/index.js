require('dotenv').config();

const app = require('./app');
const mongoClient = require('./src/config/mongoose');

mongoClient().then(()=>{
    console.log('db is connected');
    app.listen(8000,()=>{
    console.log('port is running on 8000')
});

}).catch((error)=>{
    console.error(error)
});

// const express = require('express');
// const app = express();

// app.use(express.json());

// const bcrypt = require('bcrypt');
// const multer = require('multer');
// const {Readable} = require('stream');


// const findUser = require('./src/middleware/findUser');
// const formValidation = require("./src/middleware/formValidation");
// const tokenGenerator = require('./src/utils/jwtToken');
// const loginValidation = require('./src/middleware/loginValidation');

// const authRoute = require('./src/routes/authRoutes');
// const userRoute = require('./src/routes/userRoutes');
// const uploadRoute = require('./src/routes/uploadRoutes');
// const fileRoute = require('./src/routes/fileRoutes');
// const authorization = require('./src/middleware/auth');


// const s3Client = require('./src/config/s3Client');


// const MAX_FILE_SIZE = 5 * 1024 * 1024;



// const storage = multer.memoryStorage();

// const upload = multer({
//     storage: storage,
//     limits: {fileSize: MAX_FILE_SIZE}
// })
//const User = require('./src/models/User');
// const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
// const Uploads = require('./src/models/uploads');
// const { getSignedUrl  } = require('@aws-sdk/s3-request-presigner');

// app.get('/',(req,res)=>{
//     res.send('welcome to cloudvalut')
// });

// /**
//  * Register and Login Routes
//  */
// app.use('/api/v1/auth',authRoute);

// /**
//  * Profile Routes
//  */
// app.use('/api/v1/user',userRoute);

// /**
//  * Upload Routes
//  */
// app.use('/api/v1/upload',uploadRoute);

// /**
//  * Files Routes
//  */
// app.use('/api/v1/files',fileRoute);


// app.post('/register',formValidation,findUser,async (req,res)=>{

//     try{
//         const {username, email, password} = req.body;
//         const hashedPassword = await bcrypt.hash(password , 16);
//         const newUSer = new User({
//             username,
//             password: hashedPassword,
//             email:email.toLowerCase()
//         })
//         await newUSer.save();
//         res.status(201).send('new user added sucessfully');
//     }catch(err){
//         console.error(err);
//         if(err.code === 11000){
//            return res.status(409).json({
//             message:'Username or email already exists',
//             });
//         }
//        return res.status(500).json({
//             message:'User not registered',
//             error: err.message});
//     }
// });



// app.post('/login',loginValidation, async (req,res)=>{
//     try{
//         const {email,password} = req.body;
//         const user = await User.findOne({email: email.toLowerCase()});
//         if(user){
//             const isPasswordValid = await bcrypt.compare(password,user.password);
//             if(isPasswordValid){
//                 const payload = {id:user._id}
//                 const token = tokenGenerator(payload)
//                 return res.status(200).json({
//                     message: 'User logged successfully',
//                     token
//                 });
//             }else{
//                 return res.status(401).json({
//                     message: "Invalid Credentials"
//                 });
//             }
//         }
//         return res.status(401).json({
//             message: "Invalid Credentials"
//         })
//     }catch(err){
//         console.error(err);
//         return res.status(500).json({
//             message: "Internal Server Error"
//         })
//     }
// })

// app.get('/profile',authorization, async(req,res)=>{
//     try{
//         const user = await User.findById(req.user,'username email');
//         if(user){
//             return res.status(200).json({
//                 username: user.username,
//                 email: user.email
//             })
//         }
//         return res.status(404).json({
//             message: 'user not found'
//         })
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({
//             message: 'Internal server error'
//         })
//     }
// })

// app.post('/upload',authorization,upload.single('MyFile'), async(req,res)=>{
//     try{
//         const key = `${Date.now()}-${req.file.originalname}`
//         const upload = new PutObjectCommand({
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key:key ,
//             Body: req.file.buffer,
//             ContentType: req.file.mimetype
//         });
//         await s3Client.send(upload);
        
//         const newFile = new Uploads({
//             userId: req.user,
//             bucketName: process.env.AWS_BUCKET_NAME,
//             s3Key:key,
//             fileName:req.file.originalname,
//             contentType: req.file.mimetype,
//             size: req.file.size,
//         })

//         await newFile.save();

//         return res.status(201).json({
//             message: "File Uploaded Successfully"
//         })

//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             message: 'Internal server error'
//         })
//     };

// })

// app.get('/files',authorization,async(req,res)=>{
//     try{
//         const files = await Uploads.find({userId: req.user},'fileName contentType size');
//         return res.status(200).json({
//             files
//         })
        

//     }catch(err){
//         console.log(err);
//         return res.status(500).json({
//             message: 'Internal Server Error'
//         })
//     }
// })

// app.get('/files/:id/download',authorization, async(req,res)=>{
//     try{
//         const isFileExists =await Uploads.findOne({_id: req.params.id,userId:req.user})
//         if(isFileExists){
//             const getFile = new GetObjectCommand({
//                 Key: isFileExists.s3Key,
//                 Bucket:process.env.AWS_BUCKET_NAME
//             })
//             const results =await s3Client.send(getFile);
//             res.attachment(isFileExists.fileName);
//             res.contentType(isFileExists.contentType);


//             const stream = Readable.fromWeb(results.Body.transformToWebStream());

//             return stream.pipe(res);
//         }
//         return res.status(404).json({
//             message: "File Not Found"
//         })

//     }catch(err){
//         console.log(err);
//         res.status(500).json({
//             message: 'Internal Server Error'
//         })
//     }
// })

// app.delete('/files/:id',authorization,async(req,res)=>{
//     try{
        
//         const file = await Uploads.findOne({_id:req.params.id, userId: req.user});
        
//         if(!file){
//             return res.status(404).json({
//                 message: 'File Not Found'
//             })
//         }

//         const deleteObject = new DeleteObjectCommand({
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: file.s3Key
//         })

//         await s3Client.send(deleteObject);
        
//         const isFileDeleted = await file.deleteOne();

//         if(isFileDeleted.deletedCount ===1){
//             return res.status(200).json({
//                 message: "File deleted successfully"
//             })
//         }
//         else{
//             console.error('File deletion failed:', {
//                 fileId: file._id,
//                 userId: req.user,
//                 s3Key: file.s3Key,
//                 fileName: file.fileName
//             });
//             return res.status(500).json({
//                 message: "Internal Server Error"
//             })
//         }
        
//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal Server Error"
//         })
//     }
// })

// app.get('/files/:id/download-url',authorization,async(req,res)=>{
//     try{
//         const file = await Uploads.findOne({_id:req.params.id,userId:req.user});

//         if(!file){
//             return res.status(404).json({
//                 message: "File Not Found"
//             })
//         }

//         const downloadFile = new GetObjectCommand({
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key : file.s3Key
//         })

//         const downloadUrl = await getSignedUrl(s3Client,downloadFile,{expiresIn:360})

//         return res.status(200).json({
//             url: downloadUrl
//         })

//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal Server Error"
//         })
//     }
// })

// app.post('/upload-url',authorization,async(req,res)=>{
//     try{
//         const {fileName, fileType, fileSize} = req.body;

//         if(!fileName || !fileType || typeof fileSize !== "number"){
//             return res.status(400).json({
//                 message : "fileName, fileType and fileSize are required"
//             })
//         }

//         if(fileSize > MAX_FILE_SIZE){
//             return res.status(400).json({
//                 message : "fileSize should be less than 5MB"
//             })
//         }

//         const Key = `users/${req.user}/${Date.now()}-${fileName}`;

//         const presignedURL = await createPresignedPost(s3Client,{
//             Bucket : process.env.AWS_BUCKET_NAME,
//             Key,
//             Conditions:[
//                 ['content-length-range',0,MAX_FILE_SIZE],
//                 ['eq','$Content-Type',fileType]
//             ],
//             Fields:{
//                 'Content-Type' : fileType
//             },
//             Expires: 180
            
//         })


//         return res.status(200).json({
//             message: "URL generated successfully",
//             url: presignedURL.url,
//             fileds: presignedURL.fields,
//             key: Key
//         })

//     }catch(error){
//         console.log(error);
//         return res.status(500).json({
//             message: "Internal Server Error"
//         })
//     }
// })

// app.post('/upload-complete', authorization, async(req,res)=>{
//     try{
//         const {key, fileName, fileType, fileSize} = req.body;

//         if(!key || !fileName || !fileType || typeof fileSize !== "number"){
//             return res.status(400).json({
//                 message: "key, fileName, fileType and fileSize are required"
//             })
//         }

//         const parts = key.split('/');

//         if(parts.length < 3 || parts[0] !== 'users' ||parts[1] != req.user ){
//             return res.status(403).json({
//                 message: 'Access denied'
//             })
//         }

//         const isFileExists = await Uploads.findOne({userId:req.user,s3Key:key});

//         if(isFileExists){
//             return res.status(409).json({
//                 message: "File Already Exists"
//             })
//         }

//         const fileCommand = new HeadObjectCommand({
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: key
//         })

//         const file = await s3Client.send(fileCommand);

//         if(file.ContentLength > MAX_FILE_SIZE || fileSize > MAX_FILE_SIZE){
//             return res.status(400).json({
//                 message: "fileSize should be less than 5MB"
//             })
//         }
        
//         const newFile = new Uploads({
//             userId: req.user,
//             bucketName: process.env.AWS_BUCKET_NAME,
//             s3Key: key,
//             fileName: fileName,
//             contentType: file.ContentType ?? fileType,
//             size: file.ContentLength ?? fileSize
//         });

//         await newFile.save();

//         return res.status(200).json({
//             message: "File Uploaded Successfully"
//         })

//     }catch(error){
//         console.log(error);
//         if(error.code === 11000){
//           return res.status(409).json({
//                 message: "File Already Exists"
//             })
//         }
//         return res.status(500).json({
//             message: "Internal Server Error"
//         })
//     }
// })

// app.use((err,req,res,next)=>{
//     console.error(err);

//     res.status(500).json({
//         error: err,
//         message: "Internal Server Error"
//     })
// })

