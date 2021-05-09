var mongoose = require('mongoose'),
	validators = require('mongoose-validators'),
	findOrCreate = require('mongoose-findorcreate'),
	passportLocal = require('passport-local-mongoose'),
	mongoosePaginate = require('./mongoosePaginate'),
	Schema = mongoose.Schema;
class User extends Schema {

	constructor() {
		super({
			email: {
				type: String,
				required: true,
				email: true,
				unique: true,
			},
			username: {
				type: String,
				required: true,
				unique: true,
			},
			password: {
				type: String,
			},
			mobile: {
				type: String,
				// required: true
			},
			location: {
				type: String,
				// required: true
			},
			children: [{
				crops: { type: String },
				zones: { type: Number }
			}],
			motorStatus: {
				type: String,
				required: true,
				default: 'off',
				enum: [
					'on',
					'off',
				],
			},
		}, {
			collection: 'users', // table name
			timestamps: true,
			strict: false, // Don't follow the Schema Strictly.
			toObject: {
				virtuals: true, // enable virtual fields
			},
			toJSON: {
				virtuals: true, // enable virtual fields
			},
		}).plugin(findOrCreate).plugin(mongoosePaginate).plugin(passportLocal, {
			// usernameField: 'email',
			usernameField: 'username',
			passwordField: 'password',
		});
	}
}

module.exports = mongoose.model('User', new User);
