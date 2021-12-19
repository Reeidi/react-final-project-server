const router = require('express').Router();

const { readToken, isGuest, isAuthenticated } = require('../middlewares/authMiddleware');
const authService = require('../services/authService');

router.post('/register', readToken, isGuest, async (req, res) => {
    try {
        const userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            email: req.body.email,
            password: req.body.password,
            repeatPassword: req.body.repeatPassword,
        };

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

router.post('/login', readToken, isGuest, async (req, res) => {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password
        };

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