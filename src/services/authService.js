const jwt = require('../utils/jwt');

const User = require('../models/User');
const { JWT_SECRET } = require('../constants');

async function register(userData) {
    await User.create(userData);
}

async function login(userData) {
    let email = userData.email;
    let user = await User.findOne({ email });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    let isValid = await user.validatePassword(userData.password);
    if (!isValid) {
        throw new Error('Invalid email or password');
    }

    let payload = {
        _id: user._id,
        email: user.email
    };

    return await jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 });
}

module.exports = {
    register,
    login
};