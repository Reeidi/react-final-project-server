const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, minlength: 3, validate: /^[a-zA-Z]+$/i },
    lastName: { type: String, required: true, minlength: 5, validate: /^[a-zA-Z]+$/i },
    email: { type: String, required: true },
    age: { type: Number, requrred: true },
    password: { type: String, required: true, minlength: 4 },
    posts: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Post'
        }
    ]
});

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.hash(this.password, 10)
        .then((hash) => {
            this.password = hash;
            return next();
        });
});

userSchema.method('validatePassword', function (password) {
    return bcrypt.compare(password, this.password);
});

const User = mongoose.model('User', userSchema);

module.exports = User;