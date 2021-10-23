// Packages to require
require('dotenv').config()
const express               = require('express');
const app                   = express();
const mongoose              = require('mongoose');
const path                  = require('path');
const bcrypt                = require('bcrypt');
const jwt                   = require('jsonwebtoken');
const cookieParser          = require('cookie-parser');
const methodOverride        = require('method-override');
const session               = require('express-session');
const quizRouter            = require('./routes/quizzes');
const devRouter             = require('./routes/dev');
const { checkPermission }   = require('./middleware/auth');


// Connect to MongoDB with Mongoose
mongoose.connect('mongodb://localhost:27017/quizdb', {useNewUrlParser: true, useUnifiedTopology: true})
.then( () => {
    console.log("[DB]: Connetion to the Quiz DB Established");
})
.catch(errMsg => {
    console.log("[DB]: Mongo Connection Error");
    console.log(errMsg);
})

// Set the app's static CSS and JS file paths to prevent errors when the app is being hosted 
app.set('views', path.join(__dirname, '/views'));
app.set('static', path.join(__dirname, '/static'));
app.set('middleware', path.join(__dirname, '/middleware'));

// Define the template package: EJS
app.set('view engine', 'ejs');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Mongoose schemas and models
const User      = require('./schemas/userModel');
const Token     = require('./schemas/accessTokenModel');

// Use the 'express.static' method to import CSS and JS files to our various different pages
app.use(express.static('static'))

// Syntax for overriding a GET or POST method. After url on EJS form is complete, use '?_method=PATCH' (for example)
// Use whichever method suits the need
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}));
app.use(express.static('.'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express session config
let sess = {
    secret: process.env.ACCESS_TOKEN_SECRET,
    cookie: {}
};
app.use(session(sess));

// Routes
app.use('/quiz', quizRouter);
app.use('/dev', devRouter);

// Set the application to run on a specific port
let port = process.env.PORT
app.listen(port, () => {
    console.log(`[SERVER]: Serving`);
});

app.get('/', async (req, res) => {

    if(req.session.token && req.session.user){
        const loggedInStatus = true
        let userPermission = await checkPermission(req.session.user._id);
        res.render('home', { loggedInStatus, userPermission });
    }
    
    if(req.session.token == null || req.session.token == undefined  && req.session.user == null || req.session.user == undefined){
        const loggedInStatus = false
        let userPermission = "none"
        res.render('home', { loggedInStatus, userPermission });
    }
});

app.get('/login', (req, res) => {
    const msg = "Login:"
    res.render('login', { msg });
});

app.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({userName});
        if(user != null) {
            const userId = user._id
            const validPassword = await bcrypt.compare(password, user.password);

            if(validPassword) {

                // Create JWT Token
                const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

                // Find any expired token for the user in the DB
                const foundToken = await Token.findOne({ userId: userId })

                // If no token for the user exists - create a new login token for them and store it
                if(foundToken == null){
                    const createToken = await new Token (
                        {
                            userId: userId, 
                            token: token
                        }
                    );

                    try {
                        createToken.save();
                        req.session.token = token;
                        req.session.user = user;
                        res.redirect('/');
                        return;
                    } catch (err) {
                        const msg = "Failed to create auth token - please contact your administrator"
                        return res.render("login", { msg });        
                    }
                }

                // Update the token if an old one already exists
                try {
                    const query = { userId: userId };
                    const newToken = { token: token };
                    await Token.findOneAndUpdate(query, newToken, {upsert: true});
                } catch (err) {
                    const msg = "Failed to update auth token and login - please contact your administrator"
                    return res.render("login", { msg });        
                }

                req.session.token = token;
                req.session.user = user;
                res.redirect('/');
                return;
            } else {
                const msg = "Failed to login: Incorrect username / password"
                return res.render("login", { msg });
            }
        } else {
            const msg = "Failed to login: Unknown username / password"
            return res.render("login", { msg });
        }
    } catch (err) {
        console.log(`[ERROR]: ${err}`);

        const errMsg = "An internal server error occured when trying to login - please contact your administrator"
        return res.render("error", { errMsg });
    }
});

app.get('/logout', (req, res) => {
    req.session.token = null;
    req.session.user = null;
    res.redirect("/login");
});
