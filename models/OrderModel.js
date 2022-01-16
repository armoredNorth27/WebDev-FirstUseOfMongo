
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let OrderSchema = Schema({
    restaurantID: {
        type: Number,
        required: true,
    },
    restaurantName: {
        type: String,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    fee: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    order: {
        type: {},
        required: true,
    },
    userid: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('orders', OrderSchema);