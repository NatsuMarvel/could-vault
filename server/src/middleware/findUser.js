const findUser = async (req,res,next)=>{
    try{
        const {username,email} = req.body;
        const lowerCaseMail = email.toLowerCase();
        const user = await User.findOne({
            $or:[
                {username},
                {email:lowerCaseMail}
            ]
        })

        if(user){
            if(user.username === username){
                return res.status(409).json({message: "username already exists"})
            }

            if(user.email === lowerCaseMail){
                return res.status(409).json({message: "email already exists"})
            }
        }
        next();
    }catch(err){
        console.error(err);
        res.status(500).json({
            message:'Internal server error',
            error: err.message});
    }
}

module.exports = findUser;