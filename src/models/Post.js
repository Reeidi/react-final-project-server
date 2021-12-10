const mongoose = require('mongoose');

const User = require('./User');

let postSchema = new mongoose.Schema({
    description: { type: String, required: true, minlength: 8 },
    imageUrl: { type: String, required: true, validate: /^https?:\/\//i },
    dateOfCreation: { type: String, required: true, minlength: 10, maxlength: 10 },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    votes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
});

postSchema.post('save', async function () {
    let user = await User.findById(this.author);
    user.posts.push(this._id);
    await user.save();
});

let Post = mongoose.model('Post', postSchema);

module.exports = Post;