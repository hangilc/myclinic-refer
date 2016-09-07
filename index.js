"use strict";

var hogan = require("hogan");
var fs = require("fs");
var indexTmplSrc = fs.readFileSync("./web-src/index.html", {encoding: "utf-8"});
var indexTmpl = hogan.compile(indexTmplSrc);
var Refer = require("myclinic-drawer-forms").Refer;

var zenkakuSpace = "　";
var printerServerPort = 8082;
var predefined;

function repeat(n, s){
	var parts = [];
	for(var i=0;i<n;i++){
		parts.push(s);
	}
	return parts.join("");
}

function makeReferDoctor(section, name){
	name = name || repeat(7, zenkakuSpace);
	name += " 先生";
	if( section ){
		return section + "　" + name;
	} else {
		return name;
	}
}

function makePatientName(name){
	name = name || repeat(7, zenkakuSpace);
	name += " 様";
	return name;
}

function makePatientInfo(birthday, age, sex){
	var parts = [];
	if( birthday ){
		parts.push(birthday + "生");
	}
	if( age || age === 0 ){
		parts.push(age + "才");
	}
	if( sex ){
		parts.push(sex + "性");
	}
	return parts.join(" ");
}

function setupRefer(refer, data){ 
	if( "title" in data ){
		refer.setTitle(data["title"]);
	}
	refer.setReferHospital(data["refer-hospital"] || "");
	refer.setReferDoctor(makeReferDoctor(data["refer-section"], data["refer-doctor"]));
	refer.setPatientName(makePatientName(data["patient-name"]));
	refer.setPatientInfo(makePatientInfo(data["patient-birthday"], data["patient-age"], data["patient-sex"]));
	refer.setDiagnosis("診断名 " + (data["diagnosis"] || ""));
	refer.setContent(data["content"] || "");
	if( "issue-date" in data ){
		refer.setIssueDate(data["issue-date"]);
	}
	var addr1 = data["addr-line-1"] || "";
	var addr2 = data["addr-line-2"] || "";
	var addr3 = data["addr-line-3"] || "";
	var addr4 = data["addr-line-4"] || "";
	var clinic = data["clinic-name"] || "";
	var doctor = data["doctor-name"] || "";
	refer.setAddress(addr1, addr2, addr3, addr4, clinic, doctor);
}

function render(req, res, data){
	var refer = new Refer();
	setupRefer(refer, data);
	var ops = refer.getOps();
	data.drawerPages = JSON.stringify([ops]);
	data.baseUrl = req.baseUrl;
	data.printerServerPort = printerServerPort;
	data.predefined = predefined;
	var html = indexTmpl.render(data);
	res.send(html);
}
 
function makeBaseData(config){
	var data = {};
	["addr-line-1", "addr-line-2", "addr-line-3", "addr-line-4", "clinic-name", "doctor-name"]
	.forEach(function(key){
		data[key] = config[key];
	})
	return data;
}

exports.initApp = function(app, config){
	if( "printer-server-port" in config ){
		printerServerPort = config["printer-server-port"];
	}
	predefined = config.predefined || [];
	app.post("/", function(req, res){
		var data = makeBaseData(config);
		for(var key in req.body){
			data[key] = req.body[key];
		}
		render(req, res, data);
	});
	app.get("/test", function(req, res){
		var data = makeBaseData(config);
		var testData = {
			"title": "紹介状",
			"refer-hospital": "河北総合病院",
			"refer-section": "循環器内科",
			"refer-doctor": "無名一郎",
			"patient-name": "無名和子",
			"patient-birthday": "昭和１２年１月１日",
			"patient-age": "８２",
			"patient-sex": "女",
			"diagnosis": "呼吸困難感",
			"content": "いつも大変お世話になっております。\n高血圧にて当院に通院されている方ですが、３日前から呼吸困難覚があります。",
			"issue-date": "平成２８年９月４日"
		}
		for(var key in testData){
			data[key] = testData[key];
		}
		render(req, res, data);
	});
	app.get("/", function(req, res){
		var data = makeBaseData(config);
		data.title = "紹介状";
		render(req, res, data);
	});
	return app;
}


