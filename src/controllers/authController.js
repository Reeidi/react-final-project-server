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
        age: req.body.age,
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
        res.send({ success: true });
    }
    catch (error) {
        console.log({ success: false, error });
        res.send({ success: false, error: error.message });
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
        let response = await authService.login(userData);
        res.send(response);
    }
    catch (error) {
        console.log({ success: false, error });
        res.send({ success: false, error: error.message });
    }
});

router.get('/logout', isAuthenticated, (req, res) => {
    res.send({ success: true });
})

exports.router = router;