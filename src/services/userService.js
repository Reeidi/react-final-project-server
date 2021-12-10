const User = require('../models/User');

const getOne = (userId) => User.findById(userId).lean();

const getByIds = async (userIds) => await User.find({_id: {$in: userIds}});

module.exports = {
    getOne,
    getByIds
};