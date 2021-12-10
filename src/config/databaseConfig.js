const mongoose = require('mongoose');

const { DB_CONNECTION_STRING } = require('../constants');

function initDatabase() {
    return mongoose.connect(DB_CONNECTION_STRING);
}

exports.initDatabase = initDatabase;