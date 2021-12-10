const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser')

function configure(app) {
    app.use('/static', express.static(path.resolve(__dirname, '../public')));  // Redirect all lookup for resources for '/static' to '../public'.
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
}

exports.configure = configure;