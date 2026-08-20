const loginValidation = (req,res,next)=>{
    const {email,password} = req.body;
    if (typeof email !== 'string' || email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'invalid email' });
    }

    if (typeof password !== 'string' || password.trim() === '' ) {
        return res.status(400).json({ message: 'password must not be an empty string' });
    }
    

    next();
}

module.exports= loginValidation;