var express = require('express'),
    util = require("../util"),
    auth = require("../controllers/AuthController"),
    router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags:
 *       - Login
 *     description: Api for Login Action
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: body
 *        name: user
 *        description: The user to create.
 *        schema:
 *          type: object
 *          required:
 *            - email
 *            - password
 *          properties:
 *            email:
 *              type: string
 *            password:
 *              type: string
 *     responses:
 *       200:
 *         description: LoggedIn User Object
 */
router.get('/login', util.isNotAuthenticated, auth.login);

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags:
 *       - Register
 *     description: Api for Register Action
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Registered User Object
 */
router.post('/login', util.isNotAuthenticated, auth.doLogin);


module.exports = router;
