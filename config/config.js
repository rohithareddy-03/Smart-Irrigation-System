const path = require('path'),
	morgan = require('morgan'),
	favicon = require('serve-favicon'),
	cookieParser = require('cookie-parser'),
	// pino = require('pino-http')(),
	UrlPattern = require('url-pattern'),
	fontsPattern = new UrlPattern('/fonts*'),
	javascriptPattern = new UrlPattern('/javascripts*'),
	stylesheetPattern = new UrlPattern('/stylesheets*'),
	{ Client } = require('./es')();

class Configuration {

	constructor(app, express) {
		// app.use(pino);
		/* Client.index({
			index: 'gov',
			// type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
			body: {
			  character: 'New Naveen',
			  quote: 'Winter is coming.'
			}
		}, (err, result) => {
			if (err) console.log(err)
			console.log(result)
		}) */
		// app.use(morgan('dev'));
		app.use(morgan('dev', {
			skip: (req, res) => ![fontsPattern.match(req.originalUrl), javascriptPattern.match(req.originalUrl), stylesheetPattern.match(req.originalUrl)].every(el => el === null)
		}, (tokens, req, res) => {
			console.log(`${tokens.method(req, res)} ${tokens.url(req, res)}`, {
				method: tokens.method(req, res),
				url: tokens.url(req, res),
				time: tokens['response-time'](req, res) + 'ms',
				ContentLength: tokens.res(req, res, 'Content-Length'),
			});
			return [
				tokens.method(req, res),
				tokens.url(req, res),
				tokens.status(req, res),
				tokens.res(req, res, 'content-length'), '-',
				tokens['response-time'](req, res), 'ms'
			].join(' ')
		}));
		app.use(express.json());
		app.use(express.urlencoded({ extended: false }));
		app.use(cookieParser());
		app.use(express.static(path.join(appRoot, 'public')));
	}

};

module.exports = (app, express) => new Configuration(app, express);