const router = require('express').Router();

router.post('/', async (req, res) => {
    console.log(req.body);
    res.send({ success: true });
});

exports.router = router;