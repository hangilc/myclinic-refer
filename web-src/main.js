"use strict";

var drawerToSvg = require("myclinic-drawer-svg").drawerToSvg;

var drawerPages = window.drawerPages;
var ops = drawerPages[0];

var svg = drawerToSvg(ops,{
	width: "210mm",
	height: "297mm",
	viewBox: "0 0 210 297"
});

document.getElementById("preview-wrapper").appendChild(svg);

document.getElementById("editButton").addEventListener("click", function(event){
	var editArea = document.getElementById("editArea");
	if( editArea.style.display === "none" ){
		editArea.style.display = "block";
	} else {
		editArea.style.display = "none";
	}
});