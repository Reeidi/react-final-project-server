const Event = require('../models/Event');

const getAll = async () => await Event.find().lean();

module.exports = {
    getAll,
};