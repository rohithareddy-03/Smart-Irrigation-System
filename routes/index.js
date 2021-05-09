var express = require('express'),
    util = require("../util"),
    auth = require("../controllers/AuthController"),
    Index = require("../controllers/IndexController"),
    router = express.Router();
// route to register page
router.get('/register', util.isNotAuthenticated, auth.register);

// route for register action
router.post('/register', util.isNotAuthenticated, auth.doRegister);

// route to login page
router.get('/login', util.isNotAuthenticated, auth.login);

// route for login action
router.post('/login', util.isNotAuthenticated, auth.doLogin);

// route for logout action
router.get('/logout', util.isAuthenticated, auth.logout);

// Home Page
router.get('/', util.isAuthenticated, Index.home);

router.get('/zone', util.isAuthenticated, Index.zone);
router.get('/zone1', util.isAuthenticated, Index.zone1);

router.post('/mqttOn', util.isAuthenticated, Index.mqttOn);
router.post('/mqttOff', util.isAuthenticated, Index.mqttOff);

// User Details
router.get('/userdetails', util.isAuthenticated, Index.UserDetails);
router.post('/userdetails', util.isAuthenticated, Index.UserDetailsUpdate);

// router.get('/npk', util.isAuthenticated, Index.npk);

router.get('/weather', util.isAuthenticated, Index.weather);
router.get('/cropdetails', util.isAuthenticated, Index.cropdetails);
router.get('/cropform', util.isAuthenticated, Index.cropform);
router.post('/cropform', util.isAuthenticated, Index.cropformupdate);
router.post('/cropdelete/:id', util.isAuthenticated, Index.cropformdelte);
router.get('/cropedit/:id', util.isAuthenticated, Index.cropformedit);
router.post('/cropedit/:id', util.isAuthenticated, Index.cropedit);

module.exports = router;
