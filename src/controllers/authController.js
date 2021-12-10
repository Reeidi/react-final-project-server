const router = require('express').Router();

const { isGuest, isAuthenticated } = require('../middlewares/authMiddleware');
const authService = require('../services/authService');
const { AUTH_COOKIE_NAME } = require('../constants');

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    const userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        repeatPassword: req.body.repeatPassword,
    };

    try {
        if (userData.password !== userData.repeatPassword) {
            throw new Error('Password mismatch!');
        }
    
        await authService.register(userData);
        let token = await authService.login(userData);
        res.cookie(AUTH_COOKIE_NAME, token);
        res.redirect('/');
    }
    catch (error) {
        res.render('auth/register', { error })
    }
});

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password
    };

    try {
        let token = await authService.login(userData);
        res.cookie(AUTH_COOKIE_NAME, token);
        res.redirect('/');
    }
    catch (error) {
        res.render('auth/login', { error })
    }
});

router.get('/logout', isAuthenticated, (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.redirect('/');
})

exports.router = router;