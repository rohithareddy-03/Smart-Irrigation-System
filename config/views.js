let path = require('path');

class Views {

	constructor(app) {
		// view engine setup
		app.set('views', path.join(appRoot, 'views'));
		app.set('view engine', 'twig'); // Twig Template
		// app.set('view engine', 'ejs'); // Ejs Template
		// app.set('view engine', 'hbs'); // Hbs Template
		// app.set('view engine', 'hjs'); // Hjs Template
		// app.set('view engine', 'jade'); // Jade Template
		// app.set('view engine', 'pug'); // Pug Template
		// app.set('view engine', 'vash'); // Vash Template
	}

};

module.exports = (app) => new Views(app);