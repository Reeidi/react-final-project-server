const mongoose = require('mongoose');

const User = require('./User');

let postSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 2 },
    description: { type: String, required: true, minlength: 2 },
    imageUrl: { type: String, required: true, validate: /^https?:\/\//i },
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
}, {
    timestamps: true
});

postSchema.post('save', async function () {
    let user = await User.findById(this.author);
    user.posts.push(this._id);
    await user.save();
});

let Post = mongoose.model('Post', postSchema);

module.exports = Post;