const formValidation = (req, res, next) => {
    const { username, email, password, confirmPassword } = req.body;

    if (typeof username !== 'string' || username.trim() === '') {
        return res.status(400).json({ message: 'username must not be an empty string' });
    }

    // require exactly one '@' and no whitespace around parts
    if (typeof email !== 'string' || email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'invalid email' });
    }

    if (typeof password !== 'string' || password.trim() === '' ) {
        return res.status(400).json({ message: 'password must not be an empty string' });
    }
    if(!(password.length >=6 && password.length <=16)){
            return res.status(400).json({message: 'password must be greater than 6 char and less than 16 char'})
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'passwords do not match' });
    }

    next();
};

module.exports =formValidation;