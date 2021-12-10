const path = require('path');
const handlebars = require('express-handlebars');

function configure(app) {

    app.engine('hbs', handlebars({
        extname: 'hbs'
    }));

    app.set('view engine', 'hbs');
    app.set('views', path.resolve(__dirname, '../views'));
}

exports.configure = configure;