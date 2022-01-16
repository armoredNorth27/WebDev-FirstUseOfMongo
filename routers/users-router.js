
//==================================================================================================//
//                                           Create Router                                          //
//==================================================================================================//

const express = require('express');
// const session = require('express-session');
const router = express.Router();
const User = require('../models/UserModel');
const Order = require('../models/OrderModel');

router.get('/', queryParser);
router.get('/', sendAllUsers);
router.post('/', registerUser);
router.param('userID', findUser);
router.get('/:userID', sendSingleUser);
router.put('/:userID', updatePrivacy);

//==================================================================================================//
//                                          Router Responses                                        //
//==================================================================================================//

//? Parse the query parameter and store it
// name: Used later to find all profiles that contain this name
function queryParser(req, res, next){
    // Ignore all queries where parameter is not 'name'
    if(req.query.name){
        req.qstring = req.query.name;
    }

    next();
}

//? Sends all users back to the client in html format
function sendAllUsers(req, res){
    res.format({
        'text/html': () => {
            // Find all users and send then to pug to be displayed
            User.find({}, {username: 1, privacy: 1}).exec(function(err, users){
                if(err){console.log(err); return res.status(500).send('server error');}
                
                // If a query string with parameter 'name' exists, then use it
                if(req.qstring){
                    res.set('Content-Type', 'text/html');
                    res.status(200).render('users', {allUsers: users, qstring: req.qstring});
                }
                else{
                    res.set('Content-Type', 'text/html');
                    res.status(200).render('users', {allUsers: users});
                }
            });
        },
        'default': () => { res.status(406).send('Not acceptable'); }
    });
}

//? Creates a new user based off given data
function registerUser(req, res){
    res.format({
        'application/json': () => {
            let userSaved = true;
            let message = 'User has been saved';
            let newUser = new User({username: req.body.username, password: req.body.password, privacy: false});

            User.findOne({username: req.body.username}, function(err, user){
                if(err) throw err;

                // Ensures the new user will have a unique username
                if(!user){
                    newUser.save( (err) => {
                        // Checks to see if all fields are filled
                        if(err){
                            console.log(err.message);
        
                            message = 'Invalid user. Please enter a unique username and password.';
                            userSaved = false;
                        }
        
                        if(userSaved){
                            // Send back the id of the new user so we can redirect to their profile
                            User.findOne({username: req.body.username}, function(err, user){
                                if(err) throw err;
                                
                                res.set('Content-Type', 'text/html');
                                res.status(201).send(user._id);
                            });
                        }
                        else{
                            res.set('Content-Type', 'text/html');
                            res.status(400).send(message);
                        }
                    } );
                }
                else{
                    console.log('invalid username');
                    message = 'Invalid user. Please enter a unique username and password.';
                    res.set('Content-Type', 'text/html');
                    res.status(400).send(message);
                }
            });            
        },
        'default': () => { res.status(406).send('Not acceptable'); }
    });
}

//? Finds the user with the specified ID
function findUser(req, res, next, value){
    // Find and store the specified user by ID for router-wide use
    User.findById(value).exec( (err, user) => {
        if(err){ console.log(err); return res.status(500).send('Server Error'); }
        req.user = user;
        next();
    });
}

//? Sends a single user back to the client in html format
function sendSingleUser(req, res){
    res.format({
        'text/html': () => {
            // Ensures the user is logged in if trying to access private profile
            if(req.user.privacy && !req.session.loggedin){
                res.set('Content-Type', 'text/html');
                res.status(403).send('Profile is private. Please log in to gain access.');
            }
            else{
                // Find requested user
                Order.find({userid: req.user._id}, (err, orders) => {
                    if(err) throw err;

                    let userOrders = orders;
                    res.set('Content-Type', 'text/html');
                    res.render('userProfile', {singleUser: req.user, userOrders: userOrders});
                });
            }
        },
        'default': () => { res.status(406).send('Not acceptable'); }
    });
}

//? Updates the privacy setting for the user that's logged in
function updatePrivacy(req, res){
    res.format({
        'application/json': () => {

            // Ensures user is logged in and that they can only change their own profile
            if(!req.session.loggedin || (req.session.userid !== req.body.userid)){
                res.set('Content-Type', 'text/html');
                res.status(403).send(`Invalid request. You cannot modify other people's profiles!`);
            }

            User.findByIdAndUpdate(req.user._id, {privacy: req.body.privacy}, (err, result) => {
                if(err){ console.log(err); return res.status(500).send('Server Error'); }
            });

            res.set('Content-Type', 'text/html');
            res.status(200).send('Privacy successfully updated');
        },
        'default': () => { res.status(406).send('Not acceptable'); }
    });
}

//==================================================================================================//
//                                           Export Router                                          //
//==================================================================================================//

module.exports = router;