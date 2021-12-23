const router = require('express').Router();

const eventService = require('../services/eventService');

router.get('/', async (req, res) => {
    try {
        let result = await eventService.getAll();
        console.log(result);
        res.send({ success: true, result });
    } catch (error) {
        console.log({ success: false, error });
        res.send({ success: false, error: error.message });
    }
});

exports.router = router;