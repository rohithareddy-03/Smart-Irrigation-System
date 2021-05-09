let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

class Database {

	constructor() {
		mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_DATABASE}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		}).then(() => {
			console.info('Database connection successful');
		}).catch((err) => {
			console.error('Database connection error', err);
		});
		// mongoose.set('debug', process.env.APP_DEBUG);
		mongoose.set('debug', (collectionName, methodName, query, options) => {
			console.log(`${collectionName}.${methodName}`, {
				query: query,
				options: options,
			});
		});
	}
};

module.exports = (app) => new Database;