let path         = require('path'),
	morgan       = require('morgan'),
    favicon      = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    schedule     = require('node-schedule');

class Cron {

	constructor(app, express) {
        // var j = schedule.scheduleJob('*/5 * * * * *', function(fireDate){
        //     console.log(fireDate)
        //     console.log('The answer to life, the universe, and everything!');
        // });
	}

};

module.exports = (app, express) => new Cron(app, express);