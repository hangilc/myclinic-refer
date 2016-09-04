"use strict";

var hogan = require("hogan");
var fs = require("fs");
var indexTmplSrc = fs.readFileSync("./web-src/index.html", {encoding: "utf-8"});
var indexTmpl = hogan.compile(indexTmplSrc);
var Refer = require("myclinic-drawer-forms").Refer; 

/**
refer.setReferDoctor("無名一郎　先生");
refer.setPatientName("無名和子　様");
refer.setPatientInfo("昭和１２年１月１日生、８２才、女性");
refer.setDiagnosis("診断：　呼吸困難感");
refer.setContent("いつも大変お世話になっております。\n高血圧にて当院に通院されている方ですが、３日前から呼吸困難覚があります。")
refer.setIssueDate("平成２８年９月４日");
refer.setAddress(
	"〒123-4567", 
	"東京都無名区無名町 1-23-4", 
	"tel 00-1234-5678", 
	"Fax 09-1234-5679", 
	"某内科クリニック", 
	"診療　某"
);
***/

function setupRefer(refer, data){
	if( "title" in data ){
		refer.setTitle(data["title"]);
	}
	if( "hospital" in data ){
		refer.setReferHospital(data["hospital"]);
	}
	if( "refer-doctor" in data ){
		refer.setReferDoctor(data["refer-doctor"]);
	}
	if( "patient-name" in data ){
		refer.setPatientName(data["patient-name"]);
	}
	if( "patient-info" in data ){
		refer.setPatientInfo(data["patient-info"]);
	}
	if( "diagnosis" in data ){
		refer.setDiagnosis(data["diagnosis"]);
	}
	if( "content" in data ){
		refer.setContent(data["content"]);
	}
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

function render(res, data){
	var refer = new Refer();
	setupRefer(refer, data);
	var ops = refer.getOps();
	var html = indexTmpl.render({
		drawerPages: JSON.stringify([ops])
	});
	res.send(html);
}

exports.makeApp = function(express){
	var app = express();
	app.get("/test", function(req, res){
		var data = {
			"title": "紹介状",
			"refer-hospital": "河北総合病院",
			"refer-doctor": "循環器内科　無名一郎　先生",
			"patient-name": "無名和子　様",
			"patient-info": "昭和１２年１月１日生、８２才、女性",
			"diagnosis": "診断：　呼吸困難感",
			"content": "いつも大変お世話になっております。\n高血圧にて当院に通院されている方ですが、３日前から呼吸困難覚があります。",
			"issue-date": "平成２８年９月４日",
			"addr-line-1": "〒123-4567",
			"addr-line-2": "東京都無名区無名町 1-23-4",
			"addr-line-3": "tel 00-1234-5678",
			"addr-line-4": "fax 09-1234-5679",
			"clinic-name": "某内科クリニック", 
			"doctor-name": "診療　某"
		}
		render(res, data);
	});
	app.get("/", function(req, res){
		res.send(indexTmpl.render({}));
	});
	app.use(express.static("static"));
	return app;
}