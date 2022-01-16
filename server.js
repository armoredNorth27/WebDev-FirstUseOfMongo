// Name: Alex Nedev
// Student Number: 101195595

//==================================================================================================//
//                                    Initialize + require data                                     //
//==================================================================================================//

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT || 3000;

// Importing Models
const User = require("./models/UserModel");

// Importing Routers
const ordersRouter = require('./routers/orders-router');
const userRouter = require('./routers/users-router');

// Setting session store
const store = new MongoDBStore({
    mongoUrl: 'mongodb://localhost:27017/a4',
    collection: 'sessions'
});
store.on('error', (err) => { console.log(err) });

// Setting middleware
app.set("views");
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.static('CSS'));
app.use(express.static('routers'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
    name: 'a4-session',
    secret: 'potatoes are really delicious',
    cookie:{
        maxAge: 1000*60*60*24 // 1 day
    },
    store: store,
    resave: true,
    saveUninitialized: false
}));

//? Log requests that have been received
app.use(function(req, res, next){
    console.log(`${req.method} for ${req.url}`);
    next();
});

//==================================================================================================//
//                                          Server Routers                                          //
//==================================================================================================//

app.use(exposeSession);
app.use('/users', userRouter);
app.use('/orders', ordersRouter);

app.get(['/', '/index', '/home'], (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.render('home');
});
app.get('/orderform', auth, (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.render('orderform');
});
app.get('/register', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.render('register');
});
app.get('/login', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.render('login');
});
app.post('/login', login);
app.get('/logout', logout);
app.get('/client.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send('client.js');
});

//? Makes the user's session available to all other routes
function exposeSession(req, res, next){
    if(req.session) res.locals.session = req.session;
    next();
}

//? Authorize user before accessing route
function auth(req, res, next){
    if(!req.session.loggedin){
        res.status(401).send(`You can't access this page without logging in.`);
    }
    else{
        next();
    }
}

//? Log user in and create a new session
function login(req, res){
    res.format({
        'application/json': () => {
            if(req.session.loggedin)
                return res.status(200).send('You are already logged in.');
            
            // Find specified user
            User.findOne({username: req.body.username}).exec((err, user) => {
                if(err){ console.log(err); return res.status(500).send('Server Error'); }

                // Ensures a user is found
                if(user == null){
                    res.status(404).send('User not found');
                }
                // Ensures entered password matches that of the user
                else if(user.password==req.body.password){
                    req.session.loggedin = true;
                    req.session.userid = user._id;
                    req.session.username = user.username;

                    // Make session data available to all view templates
                    res.locals.session = req.session;
                    res.status(200).send('User logged in.');
                    return;
                }
                else{
                    res.status(404).send('Invalid Password');
                }
            });
        },
        'default': () => { res.status(406).send('Not acceptable'); }
    });
}

//? Log user out and delete session data
function logout(req, res){
    req.session.destroy();
    delete res.locals.session;
    res.setHeader('Content-Type', 'text/html');
    res.redirect('/home');
}

//==================================================================================================//
//                                       Connecting to Database                                     //
//==================================================================================================//

mongoose.connect('mongodb://localhost/a4', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to database'));
db.once('open', function() {
    User.init(()=>{
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })
});