const jwt = require('jsonwebtoken');
const util = require('util');

module.exports = {
    sign: util.promisify(jwt.sign),
    verify: util.promisify(jwt.verify)
};