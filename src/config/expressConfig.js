const path = require('path');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser')

function configure(app) {
    app.use(cors());
    app.use('/static', express.static(path.resolve(__dirname, '../public')));  // Redirect all lookup for resources for '/static' to '../public'.
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
}

exports.configure = configure;