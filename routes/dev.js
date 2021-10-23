// Packages
const express       = require('express');
const router        = express.Router();
const mongoose      = require('mongoose');
const bcrypt        = require('bcrypt');
const session       = require('express-session');

router.use(express.urlencoded({extended: true}));

// Schemas
const User = require('../schemas/userModel');
const Quiz  = require('../schemas/quizModel');

// Authenitcation
// const { authUser, authRole } = require('../middleware/auth');

// Routes

router.post('/tempRegister', async (req, res) => {
    const {userName, password, permission} = req.body;
    const hash = await hashPassword(password)
    console.log(`user is ${userName}`)
    console.log(`perm is ${permission}`)
    const user = new User ({
        userName, 
        password: hash,
        permission
    });

    console.log(user)
    try {
        await user.save();
        const verifyUser = await User.find({userName})
        if(verifyUser != null) {
            res.send('password hashed and user created successfully!');
        } else {
            res.send("DB Error - please re-evaluate")
        }
    } catch (err){
        console.log(`[ERROR]: ${err}`)
        res.status(500)
        let errMsg = "Sorry -an error occured when creating this user"    
        return res.render("error", { errMsg })
    }
});

router.get('/temp', (req, res) => {
    res.send('HELLO FROM THE DEVELOPER SIDE!')
});
// Methods

async function hashPassword (pw) {
    const password = pw
    console.log(`password is ${password}`)
    const hash = await bcrypt.hash(password, 12);
    console.log(`hashed password is: ${hash}`)
    return hash
};

module.exports = router;