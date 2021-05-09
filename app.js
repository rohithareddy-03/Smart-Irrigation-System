var express = require('express'),
    path = require('path'),
    app = express(),
    router = express.Router();

global.appRoot = path.resolve(__dirname);
require('./config')(app, express);

module.exports = app;
