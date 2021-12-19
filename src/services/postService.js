const Post = require('../models/Post');

const create = (postData) => Post.create(postData);

const getOne = async (postId) => await Post.findById(postId).populate('author').lean();

const getAll = async () => await Post.find().populate('author').lean();

const getForUser = async (userId) => await Post.find({ author: userId }).lean();

const vote = async (postId, userId, vote) => {
    return Post.findOneAndUpdate(
        { _id: postId },
        {
            $push: { votes: [userId] }
        }
    );
};

const downvote = async (postId, userId, vote) => {
    return Post.findOneAndUpdate(
        { _id: postId },
        {
            $pull: { votes: { $elemMatch: { _id: userId } } }
        }
    );
};

const updateOne = (postId, postData) => Post.findByIdAndUpdate(postId, postData);

const deleteOne = (postId) => Post.findByIdAndRemove(postId);

module.exports = {
    create,
    getOne,
    getAll,
    getForUser,
    vote,
    downvote,
    updateOne,
    deleteOne,
};