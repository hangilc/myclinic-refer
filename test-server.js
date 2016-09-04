"use strict";

var refer = require("./index");
var express = require("express");

var app = express();

app.use("/refer", refer.makeApp(express));
var port = 8083;
app.listen(port, function(){
	console.log("refer server listening to " + port);
});