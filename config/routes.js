let indexRouter = require('../routes/index'),
	usersRouter = require('../routes/users'),
	apiRouter = require('../routes/api');

class Routes {
	
	constructor(app) {
		app.use((req, res, next) => {
			res.locals.url = req.originalUrl;
			res.locals.host = req.get('host');
			res.locals.protocol = req.protocol;
			next();
		});
		app.use('/', indexRouter);
		app.use('/api', apiRouter);
		app.use('/users', usersRouter);
	}

};

module.exports = (app, express) => new Routes(app);
