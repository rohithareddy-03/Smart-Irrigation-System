const fs  = require('fs'),
path      = require('path'),
swagger   = require("swagger-node-express"),
swaggerUi = require('swagger-ui-express'),
swaggerJS = require('swagger-jsdoc');

class SwaggerConf {

	constructor(app, express) {
                const swaggerDocument = swaggerJS({
                        swaggerDefinition: {
                                info: {
                                        title: process.env.APP_NAME,
                                        version: '1.0.0',
                                        description: 'Demonstrating how to describe a RESTful API with Swagger',
                                },
                                host: 'localhost:3000',
                                basePath: '/',
                        },
                        apis: [path.join(appRoot, 'routes/*.js'),],
                });
                app.use('/naveen-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
                app.use('/naveen.json', (req, res) => {
                        res.setHeader('Content-Type', 'application/json');
                        // fs.writeFile('file.json', JSON.stringify(swaggerDocument, null, 2), (err) => {});
                        res.send(swaggerDocument);
                });
	}

};

module.exports = (app, express) => new SwaggerConf(app, express);