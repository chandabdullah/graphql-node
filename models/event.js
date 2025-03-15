const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    price: Number,
    date: { type: Date, default: Date.now }
    // Add more fields if needed
    // ...
});

module.exports = mongoose.model('Event', eventSchema);