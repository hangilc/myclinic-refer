"use strict";

var fs = require("fs");

var predefined = JSON.parse(fs.readFileSync(__dirname + "/refer-predefined.json"));

module.exports = {
	"addr-line-1": "〒123-4567",
	"addr-line-2": "東京都無名区無名町 1-23-4",
	"addr-line-3": "tel 00-1234-5678",
	"addr-line-4": "fax 09-1234-5679",
	"clinic-name": "某内科クリニック", 
	"doctor-name": "診療　某",
	"predefined": predefined,
	"print-server-port": 8082
};