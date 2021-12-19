const jwt = require('../utils/jwt');

const postService = require('../services/postService');
const { AUTH_COOKIE_NAME, JWT_SECRET } = require('../constants');

exports.auth = function (req, res, next) {
    let token = req.cookies[AUTH_COOKIE_NAME];
    if (token) {
        jwt.verify(token, JWT_SECRET)
            .then(decodedToken => {
                req.user = decodedToken;
                res.locals.user = decodedToken;
                next();
            })
            .catch(error => {
                res.clearCookie(AUTH_COOKIE_NAME);
                res.status(401).render('404');
                // res.redirect('/auth/login');
            });
    } else {
        next();
    }
};

exports.readToken = function (req, res, next) {
    const token = req.headers['x-authorization'];
    if (token) {
        jwt.verify(token, JWT_SECRET)
            .then(decodedToken => {
                req.user = decodedToken;
                next();
            })
            .catch(error => {
                console.log('error ', error);
                next();
            });
    } else {
        next();
    }
}

exports.isAuthenticated = function (req, res, next) {
    const token = req.headers['x-authorization'];
    if (token) {
        jwt.verify(token, JWT_SECRET)
            .then(decodedToken => {
                req.user = decodedToken
                next();
            })
            .catch(error => {
                console.log('error ', error);
                return res.status(401).send({ error: "Unauthorized" });
            });
    } else {
        return res.status(401).send({ error: "Unauthorized" });
    }
};

exports.isGuest = function (req, res, next) {
    if (!req.user) {
        next();
    } else {
        res.redirect('/')
    }
};

exports.isAuthor = async function (req, res, next) {
    let post = await postService.getOne(req.params.postId);
    if (post.author._id.toString() === req.user?._id) {
        next();
    } else {
        return res.status(401).send({ error: "Unauthorized" });
    }
};

exports.isNotAuthor = async function (req, res, next) {
    let post = await postService.getOne(req.params.postId);
    if (post.author.toString() !== req.user?._id) {
        next();
    } else {
        res.redirect('/');
        // res.status(401).render('404');
    }
};