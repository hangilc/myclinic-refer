"use strict";

var drawerToSvg = require("myclinic-drawer-svg").drawerToSvg;
var PrinterPanel = require("./printer-panel");

var drawerPages = window.drawerPages;
var ops = drawerPages[0];

var svg = drawerToSvg(ops,{
	width: "210mm",
	height: "297mm",
	viewBox: "0 0 210 297"
});

var printerSettingKey = "ReferPrinterSetting";

PrinterPanel.setup(document.getElementById("printer-panel"), {
	hasEdit: true,
	settingKey: printerSettingKey,
	printerServerPort: window.printerServerPort
});

document.getElementById("printer-panel").addEventListener("Lg99Y7oj-edit", function(event){
	var editArea = document.getElementById("editArea");
	if( editArea.style.display === "none" ){
		editArea.style.display = "block";
	} else {
		editArea.style.display = "none";
	}
})

document.getElementById("printer-panel").addEventListener("Lg99Y7oj-print", function(event){
	var setting = event.detail.setting;
	console.log("PRINT", setting);
})

document.getElementById("preview-wrapper").appendChild(svg);
 
adaptToTitle();

document.getElementById("edit-form").querySelector("input[name=title]").addEventListener("change", function(event){
	console.log("adapt");
	adaptToTitle();
});

document.querySelectorAll("#edit-form input[name=title-kind]").forEach(function(radio){
	radio.addEventListener("click", function(event){
		var radio = event.target;
		var title;
		if( radio.value === "other" ){
			title = "";
		} else {
			title = radio.value;
		}
		document.querySelector("#edit-form input[name=title]").value = title;
	});
});

function adaptToTitle(){
	var form = document.getElementById("edit-form");
	var title = form.querySelector("input[name=title]").value;
	var radios = form.querySelectorAll("input[type=radio][name=title-kind]");
	var found = false;
	for(var i=0;i<radios.length;i++){
		var radio = radios[i];
		if( radio.value === title ){
			radio.checked = true;
			found = true;
			break;
		}
	}
	if( !found ){
		form.querySelector("input[type=radio][value=other]").checked = true;
	}
}