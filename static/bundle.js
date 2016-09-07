/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var drawerToSvg = __webpack_require__(1).drawerToSvg;
	var PrinterPanel = __webpack_require__(2);

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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// TODO: implement text_vertically_justified

	(function(exports){

	exports.drawerToSvg = function(ops, options){
	    options = options || {};

	    // var attr = {};
	    // ['width', 'height'].forEach(function(key){
	    //     if( key in options ){
	    //         attr[key] = options[key];
	    //     }
	    // })

	    var ns = "http://www.w3.org/2000/svg";
	    var pen_color = "rgb(0,0,0)";
	    var pen_width = "1px";
	    var pen_dict = {};
	    var font_name, font_size, font_weight, font_italic;
	    var font_dict = {};
	    var text_color = "rgb(0,0,0)";
	    var i, n, op;
	    var curr_x, curr_y;

	    var svg = document.createElementNS(ns, "svg");
	    ['width', 'height', "viewBox"].forEach(function(key){
	        if( key in options ){
	            svg.setAttributeNS(null, key, options[key]);
	        }
	    })
	    
	    function draw_move_to(x, y){
	        curr_x = x;
	        curr_y = y;
	    }

	    function draw_line_to(x, y){
	    	var e = document.createElementNS(ns, "line");
	    	e.setAttributeNS(null, "x1", curr_x);
	    	e.setAttributeNS(null, "y1", curr_y);
	    	e.setAttributeNS(null, "x2", x);
	    	e.setAttributeNS(null, "y2", y);
	    	e.setAttributeNS(null, "style", "stroke:" + pen_color + ";stroke-width:" + pen_width);
	        curr_x = x;
	        curr_y = y;
	        return e;
	    }

	    function create_pen(name, r, g, b, width){
	        var color = "rgb(" + r + "," + g + "," + b + ")";
	        pen_dict[name] = {width: width + "px", color: color};
	    }

	    function set_pen(name){
	        var pen = pen_dict[name];
	        pen_color = pen.color;
	        pen_width = pen.width;
	    }

	    function mmToPixel(dpi, mm){
	        var inch = mm/25.4;
	        return Math.floor(dpi * inch);
	    };
	    
	    function pixelToMm(dpi, px){
	        var inch = px / dpi;
	        return inch * 25.4;
	    }

	    function create_font(name, font_name, size, weight, italic){
	        font_dict[name] = {font_name: font_name, font_size: size, font_weight: weight, font_italic: italic};
	    }

	    function set_font(name){
	        var font = font_dict[name];
	        font_name = font.font_name;
	        font_size = font.font_size;
	        font_weight = font.font_weight;
	        font_italic = font.font_italic;
	    }

	    function set_text_color(r, g, b){
	        text_color = "rgb(" + r + "," + g + "," + b + ")";
	    }

	    function draw_chars(chars, xs, ys){
	        var e = document.createElementNS(ns, "text");
	        var attrs = {
	            fill: text_color,
	            "font-family": font_name,
	            "font-size": font_size,
	            "font-weight": font_weight ? "bold" : "normal",
	            "font-italic": font_italic ? "italic": "normal",
	            "text-anchor": "start",
	            //'dominant-baseline': "text-after-edge",
	            "dy": "1em"
	        };
	        for(var key in attrs){
	        	e.setAttributeNS(null, key, attrs[key]);
	        }
	        if( typeof xs === "number" || xs instanceof Number ){
	        	e.setAttributeNS(null, "x", xs);
	        } else {
	            e.setAttributeNS(null, "x", xs.join(","));
	        }
	        if( typeof ys === "number" || ys instanceof Number){
	        	e.setAttributeNS(null, "y", ys);
	        } else {
	        	e.setAttributeNS(null, "y", ys.join(","));
	        }
	        e.appendChild(document.createTextNode(chars));
	        return e;
	    }

	    for(i=0,n=ops.length;i<n;i++){
	        op = ops[i];
	        switch(op[0]){
	            case "move_to":
	                draw_move_to(op[1], op[2]);
	                break;
	            case "line_to":
	                svg.appendChild(draw_line_to(op[1], op[2]));
	                break;
	            case "create_pen":
	                create_pen(op[1], op[2], op[3], op[4], op[5]);
	                break;
	            case "set_pen":
	                set_pen(op[1]);
	                break;
	            case "create_font":
	                create_font(op[1], op[2], op[3], op[4], op[5]);
	                break;
	            case "set_font":
	                set_font(op[1]);
	                break;
	            case "set_text_color":
	                set_text_color(op[1], op[2], op[3]);
	                break;
	            case "draw_chars":
	                svg.appendChild(draw_chars(op[1], op[2], op[3]));
	                break;
	            default:
	                throw new Error("unknown drawer op:", op);
	                break;
	        }
	    }
	    return svg;	
	}
	})( false ? window : exports);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var hogan = __webpack_require__(4);
	var tmplSrc = __webpack_require__(3);
	var tmpl = hogan.compile(tmplSrc);
	var listTmplSrc = __webpack_require__(8);
	var listTmpl = hogan.compile(listTmplSrc);
	var conti = __webpack_require__(7);

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

	function updateSelectedPrinter(dom, ctx){
		var printerSetting = ctx.printerSetting;
		if( printerSetting ){
			dom.querySelector("[data-name=selected-setting").innerText = printerSetting;
		} else {
			dom.querySelector("[data-name=selected-setting").innerText = "（プリンター未選択）";
		}
	}

	function bindSelectPrinter(dom, ctx){
		var printerServerPort = ctx.printerServerPort
		var currentSetting = dom.querySelector("[data-name=selected-setting]").innerText;
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t{{#hasEdit}}\r\n\t\t<button data-name=\"edit-button\">編集</button>\r\n\t{{/hasEdit}}\r\n    <button data-name=\"print-button\">印刷</button>\r\n    <span data-name=\"selected-setting\"></span>\r\n    <a data-name=\"choose-setting\" href=\"javascript:void(0)\">プリンター選択</a> |\r\n    <a data-name=\"manageSetting\" target=\"_blank\" href=\"{{print-manage-url}}\">プリンター管理画面へ</a>\r\n\t<div data-name=\"setting-workarea\"></div>\r\n</div>\r\n"

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	// This file is for use with Node.js. See dist/ for browser files.

	var Hogan = __webpack_require__(5);
	Hogan.Template = __webpack_require__(6).Template;
	Hogan.template = Hogan.Template;
	module.exports = Hogan;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	(function (Hogan) {
	  // Setup regex  assignments
	  // remove whitespace according to Mustache spec
	  var rIsWhitespace = /\S/,
	      rQuot = /\"/g,
	      rNewline =  /\n/g,
	      rCr = /\r/g,
	      rSlash = /\\/g,
	      rLineSep = /\u2028/,
	      rParagraphSep = /\u2029/;

	  Hogan.tags = {
	    '#': 1, '^': 2, '<': 3, '$': 4,
	    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,
	    '{': 10, '&': 11, '_t': 12
	  };

	  Hogan.scan = function scan(text, delimiters) {
	    var len = text.length,
	        IN_TEXT = 0,
	        IN_TAG_TYPE = 1,
	        IN_TAG = 2,
	        state = IN_TEXT,
	        tagType = null,
	        tag = null,
	        buf = '',
	        tokens = [],
	        seenTag = false,
	        i = 0,
	        lineStart = 0,
	        otag = '{{',
	        ctag = '}}';

	    function addBuf() {
	      if (buf.length > 0) {
	        tokens.push({tag: '_t', text: new String(buf)});
	        buf = '';
	      }
	    }

	    function lineIsWhitespace() {
	      var isAllWhitespace = true;
	      for (var j = lineStart; j < tokens.length; j++) {
	        isAllWhitespace =
	          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||
	          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);
	        if (!isAllWhitespace) {
	          return false;
	        }
	      }

	      return isAllWhitespace;
	    }

	    function filterLine(haveSeenTag, noNewLine) {
	      addBuf();

	      if (haveSeenTag && lineIsWhitespace()) {
	        for (var j = lineStart, next; j < tokens.length; j++) {
	          if (tokens[j].text) {
	            if ((next = tokens[j+1]) && next.tag == '>') {
	              // set indent to token value
	              next.indent = tokens[j].text.toString()
	            }
	            tokens.splice(j, 1);
	          }
	        }
	      } else if (!noNewLine) {
	        tokens.push({tag:'\n'});
	      }

	      seenTag = false;
	      lineStart = tokens.length;
	    }

	    function changeDelimiters(text, index) {
	      var close = '=' + ctag,
	          closeIndex = text.indexOf(close, index),
	          delimiters = trim(
	            text.substring(text.indexOf('=', index) + 1, closeIndex)
	          ).split(' ');

	      otag = delimiters[0];
	      ctag = delimiters[delimiters.length - 1];

	      return closeIndex + close.length - 1;
	    }

	    if (delimiters) {
	      delimiters = delimiters.split(' ');
	      otag = delimiters[0];
	      ctag = delimiters[1];
	    }

	    for (i = 0; i < len; i++) {
	      if (state == IN_TEXT) {
	        if (tagChange(otag, text, i)) {
	          --i;
	          addBuf();
	          state = IN_TAG_TYPE;
	        } else {
	          if (text.charAt(i) == '\n') {
	            filterLine(seenTag);
	          } else {
	            buf += text.charAt(i);
	          }
	        }
	      } else if (state == IN_TAG_TYPE) {
	        i += otag.length - 1;
	        tag = Hogan.tags[text.charAt(i + 1)];
	        tagType = tag ? text.charAt(i + 1) : '_v';
	        if (tagType == '=') {
	          i = changeDelimiters(text, i);
	          state = IN_TEXT;
	        } else {
	          if (tag) {
	            i++;
	          }
	          state = IN_TAG;
	        }
	        seenTag = i;
	      } else {
	        if (tagChange(ctag, text, i)) {
	          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
	                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});
	          buf = '';
	          i += ctag.length - 1;
	          state = IN_TEXT;
	          if (tagType == '{') {
	            if (ctag == '}}') {
	              i++;
	            } else {
	              cleanTripleStache(tokens[tokens.length - 1]);
	            }
	          }
	        } else {
	          buf += text.charAt(i);
	        }
	      }
	    }

	    filterLine(seenTag, true);

	    return tokens;
	  }

	  function cleanTripleStache(token) {
	    if (token.n.substr(token.n.length - 1) === '}') {
	      token.n = token.n.substring(0, token.n.length - 1);
	    }
	  }

	  function trim(s) {
	    if (s.trim) {
	      return s.trim();
	    }

	    return s.replace(/^\s*|\s*$/g, '');
	  }

	  function tagChange(tag, text, index) {
	    if (text.charAt(index) != tag.charAt(0)) {
	      return false;
	    }

	    for (var i = 1, l = tag.length; i < l; i++) {
	      if (text.charAt(index + i) != tag.charAt(i)) {
	        return false;
	      }
	    }

	    return true;
	  }

	  // the tags allowed inside super templates
	  var allowedInSuper = {'_t': true, '\n': true, '$': true, '/': true};

	  function buildTree(tokens, kind, stack, customTags) {
	    var instructions = [],
	        opener = null,
	        tail = null,
	        token = null;

	    tail = stack[stack.length - 1];

	    while (tokens.length > 0) {
	      token = tokens.shift();

	      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {
	        throw new Error('Illegal content in < super tag.');
	      }

	      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {
	        stack.push(token);
	        token.nodes = buildTree(tokens, token.tag, stack, customTags);
	      } else if (token.tag == '/') {
	        if (stack.length === 0) {
	          throw new Error('Closing tag without opener: /' + token.n);
	        }
	        opener = stack.pop();
	        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
	          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
	        }
	        opener.end = token.i;
	        return instructions;
	      } else if (token.tag == '\n') {
	        token.last = (tokens.length == 0) || (tokens[0].tag == '\n');
	      }

	      instructions.push(token);
	    }

	    if (stack.length > 0) {
	      throw new Error('missing closing tag: ' + stack.pop().n);
	    }

	    return instructions;
	  }

	  function isOpener(token, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].o == token.n) {
	        token.tag = '#';
	        return true;
	      }
	    }
	  }

	  function isCloser(close, open, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].c == close && tags[i].o == open) {
	        return true;
	      }
	    }
	  }

	  function stringifySubstitutions(obj) {
	    var items = [];
	    for (var key in obj) {
	      items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + '}');
	    }
	    return "{ " + items.join(",") + " }";
	  }

	  function stringifyPartials(codeObj) {
	    var partials = [];
	    for (var key in codeObj.partials) {
	      partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
	    }
	    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
	  }

	  Hogan.stringify = function(codeObj, text, options) {
	    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) +  "}";
	  }

	  var serialNo = 0;
	  Hogan.generate = function(tree, text, options) {
	    serialNo = 0;
	    var context = { code: '', subs: {}, partials: {} };
	    Hogan.walk(tree, context);

	    if (options.asString) {
	      return this.stringify(context, text, options);
	    }

	    return this.makeTemplate(context, text, options);
	  }

	  Hogan.wrapMain = function(code) {
	    return 'var t=this;t.b(i=i||"");' + code + 'return t.fl();';
	  }

	  Hogan.template = Hogan.Template;

	  Hogan.makeTemplate = function(codeObj, text, options) {
	    var template = this.makePartials(codeObj);
	    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));
	    return new this.template(template, text, this, options);
	  }

	  Hogan.makePartials = function(codeObj) {
	    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};
	    for (key in template.partials) {
	      template.partials[key] = this.makePartials(template.partials[key]);
	    }
	    for (key in codeObj.subs) {
	      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);
	    }
	    return template;
	  }

	  function esc(s) {
	    return s.replace(rSlash, '\\\\')
	            .replace(rQuot, '\\\"')
	            .replace(rNewline, '\\n')
	            .replace(rCr, '\\r')
	            .replace(rLineSep, '\\u2028')
	            .replace(rParagraphSep, '\\u2029');
	  }

	  function chooseMethod(s) {
	    return (~s.indexOf('.')) ? 'd' : 'f';
	  }

	  function createPartial(node, context) {
	    var prefix = "<" + (context.prefix || "");
	    var sym = prefix + node.n + serialNo++;
	    context.partials[sym] = {name: node.n, partials: {}};
	    context.code += 't.b(t.rp("' +  esc(sym) + '",c,p,"' + (node.indent || '') + '"));';
	    return sym;
	  }

	  Hogan.codegen = {
	    '#': function(node, context) {
	      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),' +
	                      'c,p,0,' + node.i + ',' + node.end + ',"' + node.otag + " " + node.ctag + '")){' +
	                      't.rs(c,p,' + 'function(c,p,t){';
	      Hogan.walk(node.nodes, context);
	      context.code += '});c.pop();}';
	    },

	    '^': function(node, context) {
	      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
	      Hogan.walk(node.nodes, context);
	      context.code += '};';
	    },

	    '>': createPartial,
	    '<': function(node, context) {
	      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};
	      Hogan.walk(node.nodes, ctx);
	      var template = context.partials[createPartial(node, context)];
	      template.subs = ctx.subs;
	      template.partials = ctx.partials;
	    },

	    '$': function(node, context) {
	      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};
	      Hogan.walk(node.nodes, ctx);
	      context.subs[node.n] = ctx.code;
	      if (!context.inPartial) {
	        context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
	      }
	    },

	    '\n': function(node, context) {
	      context.code += write('"\\n"' + (node.last ? '' : ' + i'));
	    },

	    '_v': function(node, context) {
	      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	    },

	    '_t': function(node, context) {
	      context.code += write('"' + esc(node.text) + '"');
	    },

	    '{': tripleStache,

	    '&': tripleStache
	  }

	  function tripleStache(node, context) {
	    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	  }

	  function write(s) {
	    return 't.b(' + s + ');';
	  }

	  Hogan.walk = function(nodelist, context) {
	    var func;
	    for (var i = 0, l = nodelist.length; i < l; i++) {
	      func = Hogan.codegen[nodelist[i].tag];
	      func && func(nodelist[i], context);
	    }
	    return context;
	  }

	  Hogan.parse = function(tokens, text, options) {
	    options = options || {};
	    return buildTree(tokens, '', [], options.sectionTags || []);
	  }

	  Hogan.cache = {};

	  Hogan.cacheKey = function(text, options) {
	    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');
	  }

	  Hogan.compile = function(text, options) {
	    options = options || {};
	    var key = Hogan.cacheKey(text, options);
	    var template = this.cache[key];

	    if (template) {
	      var partials = template.partials;
	      for (var name in partials) {
	        delete partials[name].instance;
	      }
	      return template;
	    }

	    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
	    return this.cache[key] = template;
	  }
	})( true ? exports : Hogan);


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	var Hogan = {};

	(function (Hogan) {
	  Hogan.Template = function (codeObj, text, compiler, options) {
	    codeObj = codeObj || {};
	    this.r = codeObj.code || this.r;
	    this.c = compiler;
	    this.options = options || {};
	    this.text = text || '';
	    this.partials = codeObj.partials || {};
	    this.subs = codeObj.subs || {};
	    this.buf = '';
	  }

	  Hogan.Template.prototype = {
	    // render: replaced by generated code.
	    r: function (context, partials, indent) { return ''; },

	    // variable escaping
	    v: hoganEscape,

	    // triple stache
	    t: coerceToString,

	    render: function render(context, partials, indent) {
	      return this.ri([context], partials || {}, indent);
	    },

	    // render internal -- a hook for overrides that catches partials too
	    ri: function (context, partials, indent) {
	      return this.r(context, partials, indent);
	    },

	    // ensurePartial
	    ep: function(symbol, partials) {
	      var partial = this.partials[symbol];

	      // check to see that if we've instantiated this partial before
	      var template = partials[partial.name];
	      if (partial.instance && partial.base == template) {
	        return partial.instance;
	      }

	      if (typeof template == 'string') {
	        if (!this.c) {
	          throw new Error("No compiler available.");
	        }
	        template = this.c.compile(template, this.options);
	      }

	      if (!template) {
	        return null;
	      }

	      // We use this to check whether the partials dictionary has changed
	      this.partials[symbol].base = template;

	      if (partial.subs) {
	        // Make sure we consider parent template now
	        if (!partials.stackText) partials.stackText = {};
	        for (key in partial.subs) {
	          if (!partials.stackText[key]) {
	            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
	          }
	        }
	        template = createSpecializedPartial(template, partial.subs, partial.partials,
	          this.stackSubs, this.stackPartials, partials.stackText);
	      }
	      this.partials[symbol].instance = template;

	      return template;
	    },

	    // tries to find a partial in the current scope and render it
	    rp: function(symbol, context, partials, indent) {
	      var partial = this.ep(symbol, partials);
	      if (!partial) {
	        return '';
	      }

	      return partial.ri(context, partials, indent);
	    },

	    // render a section
	    rs: function(context, partials, section) {
	      var tail = context[context.length - 1];

	      if (!isArray(tail)) {
	        section(context, partials, this);
	        return;
	      }

	      for (var i = 0; i < tail.length; i++) {
	        context.push(tail[i]);
	        section(context, partials, this);
	        context.pop();
	      }
	    },

	    // maybe start a section
	    s: function(val, ctx, partials, inverted, start, end, tags) {
	      var pass;

	      if (isArray(val) && val.length === 0) {
	        return false;
	      }

	      if (typeof val == 'function') {
	        val = this.ms(val, ctx, partials, inverted, start, end, tags);
	      }

	      pass = !!val;

	      if (!inverted && pass && ctx) {
	        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
	      }

	      return pass;
	    },

	    // find values with dotted names
	    d: function(key, ctx, partials, returnFound) {
	      var found,
	          names = key.split('.'),
	          val = this.f(names[0], ctx, partials, returnFound),
	          doModelGet = this.options.modelGet,
	          cx = null;

	      if (key === '.' && isArray(ctx[ctx.length - 2])) {
	        val = ctx[ctx.length - 1];
	      } else {
	        for (var i = 1; i < names.length; i++) {
	          found = findInScope(names[i], val, doModelGet);
	          if (found !== undefined) {
	            cx = val;
	            val = found;
	          } else {
	            val = '';
	          }
	        }
	      }

	      if (returnFound && !val) {
	        return false;
	      }

	      if (!returnFound && typeof val == 'function') {
	        ctx.push(cx);
	        val = this.mv(val, ctx, partials);
	        ctx.pop();
	      }

	      return val;
	    },

	    // find values with normal names
	    f: function(key, ctx, partials, returnFound) {
	      var val = false,
	          v = null,
	          found = false,
	          doModelGet = this.options.modelGet;

	      for (var i = ctx.length - 1; i >= 0; i--) {
	        v = ctx[i];
	        val = findInScope(key, v, doModelGet);
	        if (val !== undefined) {
	          found = true;
	          break;
	        }
	      }

	      if (!found) {
	        return (returnFound) ? false : "";
	      }

	      if (!returnFound && typeof val == 'function') {
	        val = this.mv(val, ctx, partials);
	      }

	      return val;
	    },

	    // higher order templates
	    ls: function(func, cx, partials, text, tags) {
	      var oldTags = this.options.delimiters;

	      this.options.delimiters = tags;
	      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
	      this.options.delimiters = oldTags;

	      return false;
	    },

	    // compile text
	    ct: function(text, cx, partials) {
	      if (this.options.disableLambda) {
	        throw new Error('Lambda features disabled.');
	      }
	      return this.c.compile(text, this.options).render(cx, partials);
	    },

	    // template result buffering
	    b: function(s) { this.buf += s; },

	    fl: function() { var r = this.buf; this.buf = ''; return r; },

	    // method replace section
	    ms: function(func, ctx, partials, inverted, start, end, tags) {
	      var textSource,
	          cx = ctx[ctx.length - 1],
	          result = func.call(cx);

	      if (typeof result == 'function') {
	        if (inverted) {
	          return true;
	        } else {
	          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
	          return this.ls(result, cx, partials, textSource.substring(start, end), tags);
	        }
	      }

	      return result;
	    },

	    // method replace variable
	    mv: function(func, ctx, partials) {
	      var cx = ctx[ctx.length - 1];
	      var result = func.call(cx);

	      if (typeof result == 'function') {
	        return this.ct(coerceToString(result.call(cx)), cx, partials);
	      }

	      return result;
	    },

	    sub: function(name, context, partials, indent) {
	      var f = this.subs[name];
	      if (f) {
	        this.activeSub = name;
	        f(context, partials, this, indent);
	        this.activeSub = false;
	      }
	    }

	  };

	  //Find a key in an object
	  function findInScope(key, scope, doModelGet) {
	    var val;

	    if (scope && typeof scope == 'object') {

	      if (scope[key] !== undefined) {
	        val = scope[key];

	      // try lookup with get for backbone or similar model data
	      } else if (doModelGet && scope.get && typeof scope.get == 'function') {
	        val = scope.get(key);
	      }
	    }

	    return val;
	  }

	  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
	    function PartialTemplate() {};
	    PartialTemplate.prototype = instance;
	    function Substitutions() {};
	    Substitutions.prototype = instance.subs;
	    var key;
	    var partial = new PartialTemplate();
	    partial.subs = new Substitutions();
	    partial.subsText = {};  //hehe. substext.
	    partial.buf = '';

	    stackSubs = stackSubs || {};
	    partial.stackSubs = stackSubs;
	    partial.subsText = stackText;
	    for (key in subs) {
	      if (!stackSubs[key]) stackSubs[key] = subs[key];
	    }
	    for (key in stackSubs) {
	      partial.subs[key] = stackSubs[key];
	    }

	    stackPartials = stackPartials || {};
	    partial.stackPartials = stackPartials;
	    for (key in partials) {
	      if (!stackPartials[key]) stackPartials[key] = partials[key];
	    }
	    for (key in stackPartials) {
	      partial.partials[key] = stackPartials[key];
	    }

	    return partial;
	  }

	  var rAmp = /&/g,
	      rLt = /</g,
	      rGt = />/g,
	      rApos = /\'/g,
	      rQuot = /\"/g,
	      hChars = /[&<>\"\']/;

	  function coerceToString(val) {
	    return String((val === null || val === undefined) ? '' : val);
	  }

	  function hoganEscape(str) {
	    str = coerceToString(str);
	    return hChars.test(str) ?
	      str
	        .replace(rAmp, '&amp;')
	        .replace(rLt, '&lt;')
	        .replace(rGt, '&gt;')
	        .replace(rApos, '&#39;')
	        .replace(rQuot, '&quot;') :
	      str;
	  }

	  var isArray = Array.isArray || function(a) {
	    return Object.prototype.toString.call(a) === '[object Array]';
	  };

	})( true ? exports : Hogan);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	(function(exports){

	function iterExec(i, funs, done){
		if( i >= funs.length ){
			done();
			return;
		}
		var f = funs[i];
		f(function(err){
			if( err ){
				done(err);
				return;
			}
			iterExec(i+1, funs, done);
		})
	}

	exports.exec = function(funs, done){
		funs = funs.slice();
		iterExec(0, funs, done);
	};

	exports.execPara = function(funs, done){
		if( funs.length === 0 ){
			done();
			return;
		}
		funs = funs.slice();
		var n = funs.length;
		var no_more = false;
		funs.forEach(function(f){
			if( no_more ){
				return;
			}
			f(function(err){
				if( no_more ){
					return;
				}
				if( err ){
					no_more = true;
					done(err);
					return;
				}
				n -= 1;
				if( n === 0 ){
					done();
				}
			})
		})
	}

	function iterForEach(i, arr, fn, done){
		if( i >= arr.length ){
			done();
			return;
		}
		fn(arr[i], function(err){
			if( err ){
				done(err);
				return;
			}
			iterForEach(i+1, arr, fn, done);
		})
	}

	exports.forEach = function(arr, fn, done){
		arr = arr.slice();
		iterForEach(0, arr, fn, done);
	};

	exports.forEachPara = function(arr, fn, done){
		if( arr.length === 0 ){
			done();
			return;
		}
		arr = arr.slice();
		var n = arr.length;
		var no_more = false;
		arr.forEach(function(ele){
			if( no_more ){
				return;
			}
			fn(ele, function(err){
				if( no_more ){
					return;
				}
				if( err ){
					no_more = true;
					done(err);
					return;
				}
				n -= 1;
				if( n === 0 ){
					done();
				}
			})
		});
	};

	function Queue(){
		this.queue = [];
	}

	Queue.prototype.push = function(fn, cb){
		this.queue.push({
			fn: fn,
			cb: cb
		});
		if( this.queue.length === 1 ){
			this.run();
		}
	}

	Queue.prototype.run = function(){
		if( this.queue.length === 0 ){
			return;
		}
		var entry = this.queue[0];
		var fn = entry.fn;
		var cb = entry.cb;
		var self = this;
		fn(function(){
			var args = [].slice.call(arguments);
			cb.apply(undefined, args);
			if( self.queue.length > 0 && self.queue[0] === entry ){
				self.queue.shift();
				self.run();
			}
		})
	}

	var theQueue = new Queue();

	exports.enqueue = function(fn, cb){
		theQueue.push(fn, cb);
	};

	exports.mapPara = function(arr, fn, cb){
		var index = 0;
		var dataArr = arr.map(function(value){
			return {
				index: index++,
				value: value
			}
		});
		var retArr = [];
		exports.forEachPara(dataArr, function(data, done){
			var value = fn(data.value, function(err, result){
				if( err ){
					done(err);
					return;
				}
				retArr[data.index] = result;
				done();
			});
		}, function(err){
			if( err ){
				cb(err);
				return;
			}
			cb(undefined, retArr);
		})
	};

	exports.fetch = function(url, opt, op, cb){
		fetch(url, opt)
		.then(function(response){
			if( response.ok ){
				response[op]()
				.then(function(result){
					cb(undefined, result);
				})
				.catch(function(err){
					cb(err.message);
				})
			} else { 
				response.text()
				.then(function(text){
					cb(text);
				})
				.catch(function(err){
					cb(err.message);
				})
			}
		})
		.catch(function(err){
			cb(err.message);
		})
	}

	exports.fetchJson = function (url, opt, cb){
		exports.fetch(url, opt, "json", cb);
	}

	exports.fetchText = function (url, opt, cb){
		exports.fetch(url, opt, "text", cb);
	}

	})( true ? exports : (window.conti = {}));

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = "<form onsubmit=\"return false\">\r\n\t<input type=\"radio\" name=\"name\" value=\"\" {{#nosetting}}checked{{/nosetting}}/> （印刷設定なし）\r\n\t{{#list}}\r\n\t\t<input type=\"radio\" name=\"name\" value=\"{{name}}\" {{#checked}}checked{{/checked}} />{{name}}\r\n\t{{/list}}\r\n\t<button data-name=\"cancel\">キャンセル</button>\r\n</form>"

/***/ }
/******/ ]);