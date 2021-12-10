const router = require('express').Router();

const postService = require('../services/postService');

router.get('/', async (req, res) => {
    res.render('home/index');
});

exports.router = router;