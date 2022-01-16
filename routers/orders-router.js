
//==================================================================================================//
//                                           Create Router                                          //
//==================================================================================================//

const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const Order = require('../models/OrderModel');

router.post('/', insertOrder);
router.param('orderID', findOrder);
router.get('/:orderID', sendSingleOrder);

//==================================================================================================//
//                                          Router Responses                                        //
//==================================================================================================//

//? Saves a new order from a user
function insertOrder(req, res){
    let newOrder = new Order({
        restaurantID: req.body.restaurantID,
        restaurantName: req.body.restaurantName,
        subtotal: req.body.subtotal,
        total: req.body.total,
        fee: req.body.fee,
        tax: req.body.tax,
        order: req.body.order,
        userid: req.session.userid
    });

    newOrder.save( (err) => { if(err) throw err; });

    res.set('Content-Type', 'text/html');
    res.status(200).send('Order placed');
}

//? Finds the specified order
function findOrder(req, res, next, value){
    // Find and store the specified order by ID for router-wide use
    Order.findById(value).exec( (err, order) => {
        if(err){ console.log(err); return res.status(500).send('Server Error'); }
        req.order = order;
        next();
    }); 
}

//? Send the specified order in HTML format
function sendSingleOrder(req, res){
    console.log(req.body);
    res.format({
        'text/html': () => {
            // Find requested user
            User.findOne({_id: req.order.userid}, (err, user) => {
                if(err){ console.log(err); return res.status(500).send('Server Error'); }

                // If the profile is public
                // or if the user viewing a private profile is logged in for that specific profile
                // then load it
                if(!user.privacy || (req.session.loggedin && req.session.userid === String(user._id))){
                    res.set('Content-Type', 'text/html');
                    res.render('singleOrder', {user: user, order: req.order});
                }
                else{
                    res.set('Content-Type', 'text/html');
                    res.status(403).send('You must login before accessing this order.');
                }
            })
        },
        'default': () => { res.status(406).send('Not acceptable'); }
    });
}

//==================================================================================================//
//                                           Export Router                                          //
//==================================================================================================//

module.exports = router;