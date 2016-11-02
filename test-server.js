"use strict";

var express = require("express");
var refer = require("./index");
var express = require("express");
var bodyParser = require("body-parser");
var Printer = require("myclinic-drawer-print-server");
var config = require("./sample-config/refer-config");

var app = express();
var referApp = express();
referApp.use(bodyParser.urlencoded({extended: false}));
referApp.use(bodyParser.json());
refer.initApp(referApp, config);
app.use("/refer", referApp);
referApp.use(express.static(refer.staticDir));

var printerApp = express();
printerApp.use(bodyParser.urlencoded({extended: false}));
printerApp.use(bodyParser.json());
Printer.initApp(printerApp, {});
printerApp.use(express.static(Printer.staticDir));
app.use("/printer", printerApp);

var port = 8083;
app.listen(port, function(){
	console.log("refer server listening to " + port);
});
