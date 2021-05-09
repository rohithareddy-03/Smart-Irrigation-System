const path = require('path');

module.exports = (app, express) => {
    require('dotenv').config({
        path: path.join(appRoot, 'env.dev'), // Development
        // path: path.join(appRoot, 'env.stage'), // Stage
        // path: path.join(appRoot, 'env.uat'), // UAT
        // path: path.join(appRoot, 'env.prod'), // Production
    });
    require('./swagger')(app, express);
    require('./database')(app, express);
    require('./views')(app, express);
    require('./config')(app, express);
    require('./session')(app, express);
    require('./passport')(app, express);
    require('./routes')(app, express);
    require('./errors')(app, express);
    require('./cron')(app, express);
    require('./es')();
};