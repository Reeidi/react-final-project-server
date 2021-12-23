const router = require('express').Router();

const homeController = require('./controllers/homeController');
const contactController = require('./controllers/contactController');
const authController = require('./controllers/authController');
const postsController = require('./controllers/postsController');
const eventController = require('./controllers/eventController');

router.use(homeController.router);
router.use('/auth', authController.router);
router.use('/posts', postsController.router);
router.use('/event', eventController.router);
router.use('/contact', contactController.router);
router.use('*', (req, res) => res.status(404).render('404'));

exports.router = router;
