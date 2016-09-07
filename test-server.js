"use strict";

var refer = require("./index");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();

var config = {
	"addr-line-1": "〒123-4567",
	"addr-line-2": "東京都無名区無名町 1-23-4",
	"addr-line-3": "tel 00-1234-5678",
	"addr-line-4": "fax 09-1234-5679",
	"clinic-name": "某内科クリニック", 
	"doctor-name": "診療　某",
	"printer-server-port": 8082
};

var referApp = express();
referApp.use(bodyParser.urlencoded({extended: false}));
referApp.use(bodyParser.json());
referApp.use(express.static("static"));
refer.initApp(referApp, config);
app.use("/refer", referApp);

var port = 8083;
app.listen(port, function(){
	console.log("refer server listening to " + port);
});
