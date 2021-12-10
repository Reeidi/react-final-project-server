const express = require('express');

const routes = require('./routes');
const constants = require('./constants');
const expressConfig = require('./config/expressConfig');
const handlebarsConfig = require('./config/handlebarsConfig');
const databaseConfig = require('./config/databaseConfig');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

expressConfig.configure(app);
handlebarsConfig.configure(app);

app.use(authMiddleware.auth)
app.use(routes.router);

databaseConfig.initDatabase()
    .then(() => {
        app.listen(constants.PORT, () => console.log(`Running on http://localhost:${constants.PORT}/`));
    })
    .catch(error => {
        console.log('Database connection failed!', error);
    });