var passport = require("passport"),
	Validator = require('validatorjs'),
	async = require('async'),
	util = require("../util"),
	{ User } = require("../models"),
	express = require('express'),
	util = require("../util"),
	auth = require("../controllers/AuthController"),
	Index = require("../controllers/IndexController"),
	request = require("request"),
	app = express(),
	bodyParser = require("body-parser"),
	{ Types } = require('mongoose'),
	weather = require('openweather-apis');
router = express.Router();
var temp = '', humid = '', pressure = '';
var mqtt = require('mqtt');
options = {
	username: "ttn-gateway",
	password: "rohitha",
	clean: true
};
var message = "";
var payload="";
var payload1="";
var id="";
var id1="";
var topic = "application/6/device/0004a30b001a29cb/command/down";
var topic1= "application/6/device/+/event/up";
var topic2= "application/10/device/+/event/up";
var client = mqtt.connect("mqtt://192.168.225.59", options);




client.on("connect", function () {
	console.log("connected  " + client.connected);
})

// setTimeout(function () { motorON(); }, 5000);

function publish(topic, message, options) {
	console.log("publishing", message);
	if (client.connected == true) {
		client.publish(topic, message, options);
	}
}

console.log("subscribing to topics");
client.subscribe(topic1,{qos:1});
client.subscribe(topic2,{qos:1});

function motorON() {
	message = {
    "confirmed": true,                        // whether the payload must be sent as confirmed data down or not
    "fPort": 10,                              // FPort to use (must be > 0)                            // base64 encoded data (plaintext, will be encrypted by ChirpStack Network Server)
    "data": "T04="
};
const jsonStr = JSON.stringify(message);
	publish(topic, jsonStr, options);
}

function motorOFF() {
	 message = {
    "confirmed": true,                        // whether the payload must be sent as confirmed data down or not
    "fPort": 10,                              // FPort to use (must be > 0)                            // base64 encoded data (plaintext, will be encrypted by ChirpStack Network Server)
    "data":"T0ZG"
};
const jsonStr = JSON.stringify(message);
	publish(topic, jsonStr, options);
}

function autosend(){
	 message = {
    "confirmed": true,                        // whether the payload must be sent as confirmed data down or not
    "fPort": 10,                              // FPort to use (must be > 0)                            // base64 encoded data (plaintext, will be encrypted by ChirpStack Network Server)
    "data":"YXV0b21hdGlj"
};
const jsonStr = JSON.stringify(message);
	publish(topic, jsonStr, options);
}

function mansend(){
	 message = {
    "confirmed": true,                        // whether the payload must be sent as confirmed data down or not
    "fPort": 10,                              // FPort to use (must be > 0)                            // base64 encoded data (plaintext, will be encrypted by ChirpStack Network Server)
    "data":"bWFudWFs"
};
const jsonStr = JSON.stringify(message);
	publish(topic, jsonStr, options);
}

class IndexController {

	constructor() { }

	home(req, res) {
		client.on('message',function(topic1, message1, packet){
			console.log("message is "+ message1);
			console.log("topic is "+ topic1);
			let datamqtt = JSON.parse(message1);
			console.log(datamqtt.data);
			var data1=datamqtt.data;
			id=datamqtt.applicationID;
			console.log(id);
			if(id=="6"){
			payload = Buffer.from(data1,'base64');
			payload =payload.toString();
		 }
			console.log('Payload: ' + payload);
		});
		return res.render('home', { power: payload.substr(0,3) ,motor: payload.substr(3,4),water: payload.substr(6,7), user: req.user });
	}

	zone(req, res) {
		client.on('message',function(topic2, message2, packet){
			console.log("message is "+ message2);
			console.log("topic is "+ topic2);
			let datamqtt1 = JSON.parse(message2);
			console.log(datamqtt1.data);
			var data2=datamqtt1.data;
			id1=datamqtt1.applicationID;
			if(id1=="10")
			{
			payload1 = Buffer.from(data2,'base64');
			payload1 =payload1.toString();
		  }
			console.log('Payload: ' + payload1);
		});
		return res.render('zone', { valve: payload1.substr(0,3),soil: payload1.substr(3,4), user: req.user });
	}

	zone1(req, res) {
		client.on('message',function(topic2, message2, packet){
			console.log("message is "+ message2);
			console.log("topic is "+ topic2);
			let datamqtt1 = JSON.parse(message2);
			console.log(datamqtt1.data);
			var data2=datamqtt1.data;
			id1=datamqtt1.applicationID;
			if(id1=="10")
			{
			payload1 = Buffer.from(data2,'base64');
			payload1 =payload1.toString();
		  }
			console.log('Payload: ' + payload1);
		});
		return res.render('zone1', { valve: payload1.substr(0,3),soil: payload1.substr(3,4), user: req.user });
	}

	// npk(req, res) {
	// 	return res.render('npk', { user: req.user });
	// }

	weather(req, res) {
		let apiKey = 'a9046fe65c0436cb2fd00c42f4e693a5';
		let location = 'kurnool';
		var options = {
			'method': 'GET',
			'url': `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`,
		};
		request(options, function (error, response) {
			if (error) throw new Error(error);
			console.log(response.body);
			let weather = JSON.parse(response.body)
			temp = weather.main.temp;
			humid = weather.main.humidity;
			pressure = weather.main.pressure;
		});
		return res.render('weather', { temperature: temp, humidity: humid, pressure: pressure, user: req.user });
	}

	UserDetails(req, res) {
		return res.render('userdetails', { user: req.user });
	}

	cropdetails(req, res) {
		// console.log(req.user);
		return res.render('cropdetails', { user: req.user });
	}

	cropform(req, res) {
		return res.render('cropform', { user: req.user });
	}

	cropformupdate(req, res) {
		var data = req.body;
		User.updateOne({ _id: req.user._id }, {
			$push: {
				children: { crops: req.body.crops, zones: req.body.zones }
			}
		}, function (err, data) {
			if (err) {
				console.log("error", err);
			} else {
				req.flash("success", 'Successfully updated');
				res.redirect("/cropdetails");
			}
		});
	}

	cropformdelte(req, res) {
		var { id } = req.params;
		User.updateOne({ _id: req.user._id }, {
			$pull: {
				children: { _id: id }
			}
		}, function (err, data) {
			if (err) {
				console.log("error", err);
			} else {
				req.flash("success", 'Successfully deleted');
				res.redirect("/cropdetails");
			}
		});
	}

	cropformedit(req, res) {
		var { id } = req.params;
		var cropdetails = req.user.children.filter((child) => child._id.toString() == id.toString()).pop();
		return res.render('cropedit', { user: req.user, id: id, data: cropdetails });
	}

	cropedit(req, res) {
		var { id } = req.params;
		User.findOneAndUpdate(
			{ "_id": req.user._id, "children._id": id },
			{
				"$set": {
					"children.$": req.body
				}
			},
			function (err, doc) {
				if (err) {
					console.log("error", err);
				} else {
					req.flash("success", 'Successfully updated');
					res.redirect("/cropdetails");
				}
			}
		);
	}

	UserDetailsUpdate(req, res) {
		var data = req.body, rules = { email: "required|email", },
			validation = new Validator(data, rules);
		if (validation.fails()) {
			var errors = validation.errors.all();
			req.flash("error", errors[Object.keys(errors)[0]][0]);
			res.status(400).render('userdetails', { user: req.user, });
		} else {
			async.waterfall([
				(callback) => {
					if (req.body.password) {
						req.user.setPassword(req.body.password, callback);
					} else { callback(null, {}); }
				},
				(user, callback) => {
					let userData = {
						email: req.body.email,
						mobile: req.body.mobile,
						location: req.body.location,
					};
					if (req.body.password) {
						userData.hash = user.hash;
						userData.salt = user.salt;
					}
					User.updateOne({ _id: req.user._id }, { $set: userData }, callback);
				},
			], (err, user) => {
				if (err) {
					util.flashError(req, res, err);
					return res.render('userdetails', { user: req.user });
				}
				req.flash("success", 'Successfully updated');
				res.redirect("/userdetails");
			});
		}
	}

	mqttOn(req, res) {
		motorON();
		req.flash("success", 'motor On');
		res.redirect("/");
	}

	mqttOff(req, res) {
		motorOFF();
		req.flash("success", 'motor Off');
		res.redirect("/");
	}

selectopt(req,res) {
	 var d=document.getElementById("ddselect").value;
	document.getElementById("txtvalue").value=d;
	if(d=="Automatic")
	{
		autosend();
		req.flash("success", 'Set to Automatic');
		res.redirect("/");
	}
	if(d=="Manual")
	{
		mansend();
		req.flash("success", 'Set to Manual');
		res.redirect("/");
	}
}
}

module.exports = new IndexController;
