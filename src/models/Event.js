const mongoose = require('mongoose');

let eventSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 8 },
}, {
});

let Event = mongoose.model('Event', eventSchema);

module.exports = Event;