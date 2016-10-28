"use strict";

var hogan = require("hogan.js");
var tmplSrc = require("raw!./printer-panel.html");
var tmpl = hogan.compile(tmplSrc);
var listTmplSrc = require("raw!./printer-panel-list-settings.html");
var listTmpl = hogan.compile(listTmplSrc);
var conti = require("conti");

exports.setup = function(dom, config){
	var ctx = {
		settingKey: config.settingKey,
		printerSetting: getPrinterSetting(config.settingKey),
		printerServerPort: config.printerServerPort
	};
	var data = {
		hasEdit: config.hasEdit,
		"print-manage-url": "http://localhost:" + config.printerServerPort
	};
	dom.innerHTML = tmpl.render(data);
	if( data.hasEdit ){
		dom.querySelector("[data-name=edit-button]").addEventListener("click", function(event){
			var evt = new Event("Lg99Y7oj-edit");
			dom.dispatchEvent(evt);
		});
	}
	updateSelectedPrinter(dom, ctx);
	bindPrintButton(dom, ctx);
	bindSelectPrinter(dom, ctx);
	bindSelectPrinterRadio(dom, ctx);
	bindSelectPrinterCancel(dom);
}

function getPrinterSetting(key){
	return window.localStorage.getItem(key);
}

function setPrinterSetting(key, name){
	window.localStorage.setItem(key, name);
}

function removePrinterSetting(key){
	window.localStorage.removeItem(key);
}

function removeChildren(node){
	var fc = node.firstChild;
	while( fc ){
		node.removeChild(fc);
		fc = node.firstChild;
	}
}

function updateSelectedPrinter(dom, ctx){
	var label = ctx.printerSetting || "（プリンター未選択）";
	var node = dom.querySelector("span[data-name=selected-setting]");
	removeChildren(node);
	node.appendChild(document.createTextNode(label));
}

function bindPrintButton(dom, ctx){
	dom.querySelector("[data-name=print-button]").addEventListener("click", function(event){
		var evt = new Event("Lg99Y7oj-print");
		evt.detail = {
			setting: ctx.printerSetting
		};
		dom.dispatchEvent(evt);
	});
}

function bindSelectPrinter(dom, ctx){
	var printerServerPort = ctx.printerServerPort
	dom.querySelector("[data-name=choose-setting]").addEventListener("click", function(event){
		event.preventDefault();
		var settings;
		conti.exec([
			function(done){
				conti.fetchJson("http://localhost:" + printerServerPort + "/setting", {}, function(err, result){
					if( err ){
						done(err);
						return;
					}
					settings = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			var currentSetting = ctx.printerSetting;
			var data = {
				list: settings.map(function(setting){
					return {
						name: setting,
						checked: setting === currentSetting
					}
				})
			}
			data.nosetting = !data.list.some(function(item){ return item.checked; });
			var html = listTmpl.render(data);
			dom.querySelector("[data-name=setting-workarea]").innerHTML = html;
		})
	});
}

function bindSelectPrinterRadio(dom, ctx){
	dom.querySelector("[data-name=setting-workarea]").addEventListener("click", function(event){
		var e = event.target;
		if( e.tagName === "INPUT" && e.getAttribute("type") === "radio" && e.getAttribute("name") === "name" ){
			event.stopPropagation();
			var setting = e.value;
			ctx.printerSetting = setting;
			if( setting ){
				setPrinterSetting(ctx.settingKey, setting);
			} else {
				removePrinterSetting(ctx.settingKey);
			}
			updateSelectedPrinter(dom, ctx);
			dom.querySelector("[data-name=setting-workarea]").innerHTML = "";
		}
	});
}

function bindSelectPrinterCancel(dom){
	dom.querySelector("[data-name=setting-workarea]").addEventListener("click", function(event){
		var e = event.target;
		if( e.getAttribute("data-name") === "cancel" ){
			event.stopPropagation();
			dom.querySelector("[data-name=setting-workarea]").innerHTML = "";
		}
	})
}
