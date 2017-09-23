
function bookmarksite(title, url) {
	if (document.all)
		window.external.AddFavorite(url, title);
	else if (window.sidebar)
		window.sidebar.addPanel(title, url, "")
}

function setHomePage(url) {
	if (document.all) {
		document.body.style.behavior = 'url(#default#homepage)';
		document.body.setHomePage(url);
	} else if (window.sidebar) {
		if (window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			} catch (e) {
				alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
			}
		}
		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
		prefs.setCharPref('browser.startup.homepage', url);
	}
}
String.prototype.toText = function() {
	var tmpDiv = document.createElement("div");
	tmpDiv.innerHTML = this;
	var tmpTxt = "";
	if (document.all) {
		tmpTxt = tmpDiv.innerText;
	} else {
		tmpTxt = tmpDiv.textContent;
	}
	tmpDiv = null;
	return tmpTxt;
};
// Trim() , Ltrim() , RTrim()
String.prototype.Trim = function() {
	return this.replace(/(^s*)|(s*$)/g, "");
}
String.prototype.LTrim = function() {
	return this.replace(/(^s*)/g, "");
}
String.prototype.RTrim = function() {
	return this.replace(/(s*$)/g, "");
}

function isMail(mail) {
	return (new RegExp(/^w+((-w+)|(.w+))*@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+)*.[A-Za-z0-9]+$/).test(mail));
}

function trim(obj) {
	str = obj.split(/^s+|s+$/)[0];
	return str;
}

function isDigit(s) {
	var pattern = /^d*$/;
	return pattern.test(s)
}

function encodeParse(obj) {
	if ((obj == null) || (obj.value == "")) {
		return false;
	}
	var str = obj.value;
	var result = "";
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if (c == 12288) {
			result += String.fromCharCode(32);
			continue;
		}
		if (c > 65280 && c < 65375) {
			result += String.fromCharCode(c - 65248);
			continue;
		}
		result += String.fromCharCode(c);
	}
	obj.value = result;
	return true;
}
// addEvent
function addEvent(obj, type, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(type, fn, false);
	} else if (obj.attachEvent) {
		obj.attachEvent("on" + type, fn);
	} else {
		obj["on" + type] = fn;
	}
}
// removeEvent
function removeEvent(obj, type, fn) {
	if (obj.removeEventListener) obj.removeEventListener(type, fn, false);
	else if (obj.detachEvent) {
		obj.detachEvent("on" + type, fn);
	} else {
		obj["on" + type] = null;
	}
}
// assert the null value
function AssertNull(event, controlClientID, message) {
	var control = document.getElementById(controlClientID);

	if (control != null && (control.value == null || control.value.Trim() == "")) {
		alert(message);
		if (window.event) {
			window.event.returnValue = false;
		} else if (event) {
			event.preventDefault();
		}
	}
}
//Ajax Start
function Ajax_GetXMLHttpRequest() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else {
		if (window.Ajax_XMLHttpRequestProgId) {
			return new ActiveXObject(window.Ajax_XMLHttpRequestProgId);
		} else {
			var progIds = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
			for (var i = 0; i < progIds.length; ++i) {
				var progId = progIds[i];
				try {
					var x = new ActiveXObject(progId);
					window.Ajax_XMLHttpRequestProgId = progId;
					return x;
				} catch (e) {}
			}
		}
	}
	return null;
}

function Ajax_CallBack(type, id, method, args, clientCallBack, debugRequestText, debugResponseText, debugErrors, includeControlValuesWithCallBack, url) {

	if (!url) {
		url = window.location.href;
		url = url.replace(/#.*$/, '');
		if (url.indexOf('?') > -1)
			url += "&Ajax_CallBack=true";
		else {
			if (url.substr(url.length - 1, 1) == "/")
				url += "default.aspx";

			url += "?Ajax_CallBack=true";
		}
	}
	var x = Ajax_GetXMLHttpRequest();
	var result = null;
	if (!x) {
		result = {
			"value": null,
			"error": "NOXMLHTTP"
		};
		if (debugErrors) {
			alert("error: " + result.error);
		}
		if (clientCallBack) {
			clientCallBack(result);
		}
		return result;
	}
	x.open("POST", url, clientCallBack ? true : false);
	x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
	if (clientCallBack) {
		x.onreadystatechange = function() {
			var result = null;

			if (x.readyState != 4) {
				return;
			}

			if (debugResponseText) {
				alert(x.responseText);
			}

			try {
				var result = eval("(" + x.responseText + ")");
				if (debugErrors && result.error) {
					alert("error: " + result.error);
				}
			} catch (err) {
				if (window.confirm('The following error occured while processing an AJAX request: ' + err.message + 'nnWould you like to see the response?')) {
					var w = window.open();
					w.document.open('text/plain');
					w.document.write(x.responseText);
					w.document.close();
				}

				result = new Object();
				result.error = 'An AJAX error occured.  The response is invalid.';
			}

			clientCallBack(result);
		}
	}
	var encodedData = "Ajax_CallBackType=" + type;
	if (id) {
		encodedData += "&Ajax_CallBackId=" + id.split("$").join(":");
	}
	encodedData += "&Ajax_CallBackMethod=" + method;
	if (args) {
		for (var i in args) {
			encodedData += "&Ajax_CallBackArgument" + i + "=" + encodeURIComponent(args[i]);
		}
	}
	if (includeControlValuesWithCallBack && document.forms.length > 0) {
		var form = document.forms[0];
		for (var i = 0; i < form.length; ++i) {
			var element = form.elements[i];
			if (element.name) {
				var elementValue = null;
				if (element.nodeName == "INPUT") {
					var inputType = element.getAttribute("TYPE").toUpperCase();
					if (inputType == "TEXT" || inputType == "PASSWORD" || inputType == "HIdDEN") {
						elementValue = element.value;
					} else if (inputType == "CHECKBOX" || inputType == "RADIO") {
						if (element.checked) {
							elementValue = element.value;
						}
					}
				} else if (element.nodeName == "SELECT") {
					elementValue = element.value;
				} else if (element.nodeName == "TEXTAREA") {
					elementValue = element.value;
				}
				if (elementValue) {
					encodedData += "&" + element.name + "=" + encodeURIComponent(elementValue);
				}
			}
		}
	}
	if (debugRequestText) {
		alert(encodedData);
	}
	x.send(encodedData);
	if (!clientCallBack) {
		if (debugResponseText) {
			alert(x.responseText);
		}
		result = eval("(" + x.responseText + ")");
		if (debugErrors && result.error) {
			alert("error: " + result.error);
		}
	}
	delete x;
	return result;
}
//Ajax End
function ExpanderPanel_Toggle(targetID, buttonID, trackerID, buttonOpenedClassName, buttonClosedClassName) {
	if (document.getElementById) {
		var target = document.getElementById(targetID);
		if (target != null) {
			target.style.display = (target.style.display != "none") ? "none" : "";
		}
		if (buttonClosedClassName != "") {
			var imageButton = document.getElementById(buttonID);
			if (imageButton != null) {
				imageButton.className = (target.style.display != "none") ? buttonClosedClassName : buttonOpenedClassName;
			}
		}
		var tracker = document.getElementById(trackerID);
		if (tracker != null) {
			tracker.value = (target.style.display == "none") ? "True" : "False";
		}
		return false;
	}
	return true;
}
//Element Items Borrowed From Prototype
function $() {
	var elements = new Array();
	for (var i = 0; i < arguments.length; i++) {
		var element = arguments[i];
		if (typeof element == 'string')
			element = document.getElementById(element);
		if (arguments.length == 1)
			return element;
		elements.push(element);
	}
	return elements;
}

function getObject(id) {
	if (document.getElementById(id)) {
		return document.getElementById(id);
	} else if (document.all) {
		return document.all[id];
	} else if (document.layers) {
		return document.layers[id];
	}
}
var Element = {

		toggle: function() {
			for (var i = 0; i < arguments.length; i++) {
				var element = $(arguments[i]);
				element.style.display =
					(element.style.display == 'none' ? '' : 'none');
			}
		},
		hide: function() {
			for (var i = 0; i < arguments.length; i++) {
				var element = $(arguments[i]);
				element.style.display = 'none';
			}
		},
		show: function() {
			for (var i = 0; i < arguments.length; i++) {
				var element = $(arguments[i]);
				element.style.display = '';
			}
		},
		remove: function(element) {
			element = $(element);
			element.parentNode.removeChild(element);
		},

		getHeight: function(element) {
			element = $(element);
			return element.offsetHeight;
		}
	}
	//End Element Items
var items = [];
items[0] = "<a target='_blank' href='#'></a>";
items[1] = "<a target='_blank' href='#'></a>";
items[2] = "<a target='_blank' href='路'></a>";
items[3] = "<a target='_blank' href='#'></a>";
items[4] = "<a target='_blank' href='#'></a>";

function showRandomAD() {
	if (items.length == 0) return;
	var rnd = Math.floor(Math.random() * (items.length - 1));
	document.write('' + items[rnd] + '');
}

function ResizeImage(imageid, limitWidth, limitHeight) {
	var image = new Image();
	image.src = imageid.src;

	if (image.width <= 0 && image.height <= 0) return;

	if (image.width / image.height >= limitWidth / limitHeight) {
		if (image.width > limitWidth) {
			imageid.width = limitWidth;
			imageid.height = (image.height * limitWidth) / image.width;
		}
	} else if (image.height > limitHeight) {
		imageid.height = limitHeight;
		imageid.width = (image.width * limitHeight) / image.height;
	}

	if (imageid.parentElement.tagName != "A") {
		imageid.onclick = function() {
			window.open(this.src);
		}
		imageid.style.cursor = "hand";
	}
}
window.onload = InitImages;

function InitImages() {
	var maxWidth = 650;
	var maxHeight = 1024;

	var imgs = document.getElementsByTagName("img");

	for (var i = 0; i < imgs.length; i++) {
		var img = imgs[i];

		if (img.width > maxWidth || img.height > maxHeight)
			ResizeImage(img, maxWidth, maxHeight);
	}
}
//expression compare
function Expression(expression, objValue) {
	var myReg = new RegExp(expression);
	if (!myReg.test(objValue)) {
		return false;
	}
	return true;
}

function isInteger(objValue) {
	var expression = /^(+|-)?(d)*$/g;
	return Expression(expression, objValue);
}

function isNumeral(objValue) {
	var expression = /^(d)*$/g;
	return Expression(expression, objValue);
}

function isEmail(objValue) {
	var expression = /^([w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$/;
	return Expression(expression, objValue);
}

function isDate(objValue) {
	var expression = /^(d{4})(-)(d{1,2})(-)(d{1,2})$/;
	return Expression(expression, objValue);
}

function isNumber(objValue) {
	var expression = /^(+|-)?(d)+(.)?(d)*$/g;
	return Expression(expression, objValue);
}

function checkPositiveNumber(value) {
	var re = /^[1-9]+[0-9]*]*$/;
	return re.test(value);
}

function isQQ(objValue) {
	var expression = /^[0-9]{5,9}$/;
	return Expression(expression, objValue);
}

function isURL(objValue) {
	var expression = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@ 
		+ "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 221.2.162.15
		+ "|" // 允许IP和DOMAIN（域名）
		+ "([0-9a-z_!~*'()-]+.)*" // 域名- www. 
		+ "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名 
		+ "[a-z]{2,6})" // first level domain- .com or .museum 
		+ "(:[0-9]{1,4})?" // 端口- :80 
		+ "((/?)|" // a slash isn't required if there is no file name 
		+ "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
	return Expression(expression, objValue);
}

function isTelephone(objValue) {
	var expression = /d{2,5}-d{7,8}(-d{1,})?/;
	return Expression(expression, objValue);
}

function isMobile(objValue) {
	var expression = /^1[3,5]d{9}$/;
	return Expression(expression, objValue);
}

function isIdentitycard(objValue) {
	var expression = /(^d{15}$)|(^d{17}([0-9]|X)$)/;
	return Expression(expression, objValue);
}

function isPostcode(objValue) {
	var expression = /[1-9]d{5}(?!d)/;
	return Expression(expression, objValue);
}

function isChinese(objValue) {
	var expression = /[u4E00-u9FA5]/g;
	return Expression(expression, objValue);
}
//计算字长，通过正则表达式将编码在255以外的字符换成1个*，所以中英文都支持，如果传入5个汉字的话，计算字长5
function len(objvalue) {
	return objvalue.replace(/[^x00-xff]/g, "*").length;
}
var currentTabId = 'tabmenuAll';

function leaveTab(tab) {
	if (tab.id == currentTabId) {
		return;
	}
	if (tab.id == 'tabmenuAll' || tab.id == 'tabmenuPage') {
		document.getElementById(tab.id).className = 'nav_t_out0';
	} else {
		document.getElementById(tab.id).className = 'nav_t_out1';
	}
}

function showdiv(menusTabs, menusContents, id) {
	var menusContents = document.getElementById(menusContents);
	var contents = menusContents.childNodes;
	for (i = 0; i < contents.length; i++) {
		contents[i].className = 'hidden';
	}
	document.getElementById(id).className = 'hotgame';
	var tabs = document.getElementById(menusTabs).getElementsByTagName('a');
	for (i = 0; i < tabs.length; i++) {
		tabs[i].className = '';
	}
	var tabs1 = document.getElementById(menusTabs);
	var contents1 = tabs1.childNodes;
	for (i = 0; i < contents1.length; i++) {
		if (contents1[i].className == 'nav_t_ove0') {
			contents1[i].className = 'nav_t_out0';
		} else if (contents1[i].className == 'nav_t_ove1') {
			contents1[i].className = 'nav_t_out1';
		}
	}
	if (id == 'menuAll' || id == 'menuPage') {
		document.getElementById('tab' + id).className = 'nav_t_ove0';
	} else {
		document.getElementById('tab' + id).className = 'nav_t_ove1';
	}
	currentTabId = 'tab' + id;
}

function copyToClipboard(txt) {
	if (window.clipboardData) {
		window.clipboardData.clearData();
		window.clipboardData.setData('Text', txt);
	} else if (navigator.userAgent.indexOf('Opera') != -1) {
		window.location = txt;
	} else if (window.netscape) {
		try {
			netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		} catch (e) {
			alert('您的firefox安全限制限制您进行剪贴板操作，请打开config将signed.applets.codebase_principal_support设置为true之后重试');
			return false;
		}
		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		if (!clip)
			return;
		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if (!trans)
			return;
		trans.addDataFlavor('text/unicode');
		var str = new Object();
		var len = new Object();
		var str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
		var copytext = txt;
		str.data = copytext;
		trans.setTransferData('text/unicode', str, copytext.length * 2);
		var clipid = Components.interfaces.nsIClipboard;
		if (!clip)
			return false;
		clip.setData(trans, null, clipid.kGlobalClipboard);
	}
}

function iframeAutoFit() {
	try {
		if (window != parent) {
			var a = parent.document.getElementsByTagName("IFRAME");
			for (var i = 0; i < a.length; i++) {
				if (a[i].contentWindow == window) {
					var h1 = 0,
						h2 = 0,
						d = document,
						dd = d.documentElement;
					a[i].parentNode.style.height = a[i].offsetHeight + "px";
					a[i].style.height = "600px";
					if (dd && dd.scrollHeight) h1 = dd.scrollHeight;
					if (d.body) h2 = d.body.scrollHeight;
					var h = Math.max(h1, h2);
					if (document.all) {
						h += 4;
					}
					if (window.opera) {
						h += 1;
					}
					a[i].style.height = a[i].parentNode.style.height = h + "px";
					if (a[i].style.height < 600) a[i].style.height = "600px";
				}
			}
		}
	} catch (ex) {}
}
if (window.attachEvent) {
	window.attachEvent("onload", iframeAutoFit);
} else if (window.addEventListener) {
	window.addEventListener('load', iframeAutoFit, false);
}
//Calendar scripts
function L_calendar() {}
L_calendar.prototype = {
	_VersionInfo: "Version:1.0&#13;作者: lingye",
	Moveable: true,
	NewName: "",
	insertId: "",
	ClickObject: null,
	InputObject: null,
	InputDate: null,
	IsOpen: false,
	MouseX: 0,
	MouseY: 0,
	GetDateLayer: function() {
		return window.L_DateLayer;
	},
	L_TheYear: new Date().getFullYear(), //定义年的变量的初始值
	L_TheMonth: new Date().getMonth() + 1, //定义月的变量的初始值
	L_WDay: new Array(39), //定义写日期的数组
	MonHead: new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31), //定义阳历中每个月的最大天数
	GetY: function() {
		var obj;
		if (arguments.length > 0) {
			obj == arguments[0];
		} else {
			obj = this.ClickObject;
		}
		if (obj != null) {
			var y = obj.offsetTop;
			while (obj = obj.offsetParent) y += obj.offsetTop;
			return y;
		} else {
			return 0;
		}
	},
	GetX: function() {
		var obj;
		if (arguments.length > 0) {
			obj == arguments[0];

		} else {
			obj = this.ClickObject;
		}
		if (obj != null) {
			var y = obj.offsetLeft;
			while (obj = obj.offsetParent) y += obj.offsetLeft;
			return y;
		} else {
			return 0;
		}
	},
	CreateHTML: function() {
		var htmlstr = "";
		htmlstr += "<div id="
		L_calendar ">rn";
		htmlstr += "<span id="
		SelectYearLayer " style="
		z - index: 9999;
		position: absolute;
		top: 3;
		left: 19;
		display: none "></span>rn";
		htmlstr += "<span id="
		SelectMonthLayer " style="
		z - index: 9999;
		position: absolute;
		top: 3;
		left: 78;
		display: none "></span>rn";
		htmlstr += "<div id="
		L_calendar - year - month "><div id="
		L_calendar - PrevM " onclick="
		parent.
		"+this.NewName+".PrevM()
		" title="
		前一月 "><b>&lt;</b></div><div id="
		L_calendar - year " onmouseover="
		style.backgroundColor = '#FFD700'
		" onmouseout="
		style.backgroundColor = 'white'
		" onclick="
		parent.
		"+this.NewName+".SelectYearInnerHTML('"+this.L_TheYear+"')
		"></div><div id="
		L_calendar - month "  onmouseover="
		style.backgroundColor = '#FFD700'
		" onmouseout="
		style.backgroundColor = 'white'
		" onclick="
		parent.
		"+this.NewName+".SelectMonthInnerHTML('"+this.L_TheMonth+"')
		"></div><div id="
		L_calendar - NextM " onclick="
		parent.
		"+this.NewName+".NextM()
		" title="
		后一月 "><b>&gt;</b></div></div>rn";
		htmlstr += "<div id="
		L_calendar - week "><ul  onmouseup="
		StopMove()
		"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul></div>rn";
		htmlstr += "<div id="
		L_calendar - day ">rn";
		htmlstr += "<ul>rn";
		for (var i = 0; i < this.L_WDay.length; i++) {
			htmlstr += "<li id="
			L_calendar - day_ "+i+"
			" style="
			background: #e0e0e0 " onmouseover="
			this.style.background = '#FFD700'
			"  onmouseout="
			this.style.background = '#e0e0e0'
			"></li>rn";
		}
		htmlstr += "</ul>rn";
		htmlstr += "<span id="
		L_calendar - today " onclick="
		parent.
		"+this.NewName+".Today()
		"><b>Today</b></span>rn";
		htmlstr += "</div>rn";
		//htmlstr+="<div id="L_calendar-control"></div>rn";
		htmlstr += "</div>rn";
		htmlstr += "<scr" + "ipt type="
		text / javas " + "
		cript ">rn";
		htmlstr += "var MouseX,MouseY;";
		htmlstr += "var Moveable=" + this.Moveable + ";rn";
		htmlstr += "var MoveaStart=false;rn";
		htmlstr += "document.onmousemove=function(e)rn";
		htmlstr += "{rn";
		htmlstr += "var DateLayer=parent.document.getElementById("
		L_DateLayer ");rn";
		htmlstr += "    e = window.event || e;rn";
		htmlstr += "var DateLayerLeft=DateLayer.style.posLeft || parseInt(DateLayer.style.left.replace("
		px ","
		"));rn";
		htmlstr += "var DateLayerTop=DateLayer.style.posTop || parseInt(DateLayer.style.top.replace("
		px ","
		"));rn";
		htmlstr += "if(MoveaStart){DateLayer.style.left=(DateLayerLeft+e.clientX-MouseX)+"
		px ";DateLayer.style.top=(DateLayerTop+e.clientY-MouseY)+"
		px "}rn";
		htmlstr += ";rn";
		htmlstr += "}rn";

		htmlstr += "document.getElementById("
		L_calendar - week ").onmousedown=function(e){rn";
		htmlstr += "if(Moveable){MoveaStart=true;}rn";
		htmlstr += "    e = window.event || e;rn";
		htmlstr += "  MouseX = e.clientX;rn";
		htmlstr += "  MouseY = e.clientY;rn";
		htmlstr += "    }rn";

		htmlstr += "function StopMove(){rn";
		htmlstr += "MoveaStart=false;rn";
		htmlstr += "    }rn";
		htmlstr += "</scr" + "ipt>rn";
		var stylestr = "";
		stylestr += "<style type="
		text / css ">";
		stylestr += "body{background:#fff;font-size:12px;margin:0px;padding:0px;text-align:left}rn";
		stylestr += "#L_calendar{border:1px solid blue;width:158px;padding:1px;height:180px;z-index:9998;text-align:center}rn";
		stylestr += "#L_calendar-year-month{height:23px;line-height:23px;z-index:9998;}rn";
		stylestr += "#L_calendar-year{line-height:23px;width:60px;float:left;z-index:9998;position: absolute;top: 3; left: 19;cursor:default}rn";
		stylestr += "#L_calendar-month{line-height:23px;width:48px;float:left;z-index:9998;position: absolute;top: 3; left: 78;cursor:default}rn";
		stylestr += "#L_calendar-PrevM{position: absolute;top: 3; left: 5;cursor:pointer}"
		stylestr += "#L_calendar-NextM{position: absolute;top: 3; left: 145;cursor:pointer}"
		stylestr += "#L_calendar-week{height:23px;line-height:23px;z-index:9998;}rn";
		stylestr += "#L_calendar-day{height:136px;z-index:9998;}rn";
		stylestr += "#L_calendar-week ul{cursor:move;list-style:none;margin:0px;padding:0px;}rn";
		stylestr += "#L_calendar-week li{width:20px;height:20px;float:left;;margin:1px;padding:0px;text-align:center;}rn";
		stylestr += "#L_calendar-day ul{list-style:none;margin:0px;padding:0px;}rn";
		stylestr += "#L_calendar-day li{cursor:pointer;width:20px;height:20px;float:left;;margin:1px;padding:0px;}rn";
		stylestr += "#L_calendar-control{height:25px;z-index:9998;}rn";
		stylestr += "#L_calendar-today{cursor:pointer;float:left;width:63px;height:20px;line-height:20px;margin:1px;text-align:center;background:red}"
		stylestr += "</style>";
		var TempLateContent = "<html>rn";
		TempLateContent += "<head>rn";
		TempLateContent += "<title></title>rn";
		TempLateContent += stylestr;
		TempLateContent += "</head>rn";
		TempLateContent += "<body>rn";
		TempLateContent += htmlstr;
		TempLateContent += "</body>rn";
		TempLateContent += "</html>rn";
		this.GetDateLayer().document.writeln(TempLateContent);
		this.GetDateLayer().document.close();
	},
	InsertHTML: function(id, htmlstr) {
		var L_DateLayer = this.GetDateLayer();
		if (L_DateLayer) {
			L_DateLayer.document.getElementById(id).innerHTML = htmlstr;
		}
	},
	WriteHead: function(yy, mm) //往 head 中写入当前的年与月
		{
			this.InsertHTML("L_calendar-year", yy + " 年");
			this.InsertHTML("L_calendar-month", mm + " 月");
		},
	IsPinYear: function(year) //判断是否闰平年
		{
			if (0 == year % 4 && ((year % 100 != 0) || (year % 400 == 0))) return true;
			else return false;
		},
	GetMonthCount: function(year, month) //闰年二月为29天
		{
			var c = this.MonHead[month - 1];
			if ((month == 2) && this.IsPinYear(year)) c++;
			return c;
		},
	GetDOW: function(day, month, year) //求某天的星期几
		{
			var dt = new Date(year, month - 1, day).getDay() / 7;
			return dt;
		},
	GetText: function(obj) {
		if (obj.innerText) {
			return obj.innerText
		} else {
			return obj.textContent
		}
	},
	PrevM: function() //往前翻月份
		{
			if (this.L_TheMonth > 1) {
				this.L_TheMonth--
			} else {
				this.L_TheYear--;
				this.L_TheMonth = 12;
			}
			this.SetDay(this.L_TheYear, this.L_TheMonth);
		},
	NextM: function() //往后翻月份
		{
			if (this.L_TheMonth == 12) {
				this.L_TheYear++;
				this.L_TheMonth = 1
			} else {
				this.L_TheMonth++
			}
			this.SetDay(this.L_TheYear, this.L_TheMonth);
		},
	Today: function() //Today Button
		{
			var today;
			this.L_TheYear = new Date().getFullYear();
			this.L_TheMonth = new Date().getMonth() + 1;
			today = new Date().getDate();
			if (this.InputObject) {
				this.InputObject.value = this.L_TheYear + "-" + this.L_TheMonth + "-" + today;
			}
			this.CloseLayer();
		},
	SetDay: function(yy, mm) //主要的写程序**********
		{
			this.WriteHead(yy, mm);
			//设置当前年月的公共变量为传入值
			this.L_TheYear = yy;
			this.L_TheMonth = mm;
			//当页面本身位于框架中时 IE会返回错误的parent
			if (window.top.location.href != window.location.href) {
				for (var i_f = 0; i_f < window.top.frames.length; i_f++) {
					if (window.top.frames[i_f].location.href == window.location.href) {
						L_DateLayer_Parent = window.top.frames[i_f];
					}
				}
			} else {
				L_DateLayer_Parent = window.parent;
			}
			for (var i = 0; i < 39; i++) {
				this.L_WDay[i] = ""
			}; //将显示框的内容全部清空
			var day1 = 1,
				day2 = 1,
				firstday = new Date(yy, mm - 1, 1).getDay(); //某月第一天的星期几
			for (i = 0; i < firstday; i++) this.L_WDay[i] = this.GetMonthCount(mm == 1 ? yy - 1 : yy, mm == 1 ? 12 : mm - 1) - firstday + i + 1 //上个月的最后几天
			for (i = firstday; day1 < this.GetMonthCount(yy, mm) + 1; i++) {
				this.L_WDay[i] = day1;
				day1++;
			}
			for (i = firstday + this.GetMonthCount(yy, mm); i < 39; i++) {
				this.L_WDay[i] = day2;
				day2++
			}
			for (i = 0; i < 39; i++) {
				var da = this.GetDateLayer().document.getElementById("L_calendar-day_" + i + "");
				var month, day;
				if (this.L_WDay[i] != "") {
					if (i < firstday) {
						da.innerHTML = "<b style="
						color: gray ">" + this.L_WDay[i] + "</b>";
						month = (mm == 1 ? 12 : mm - 1);
						day = this.L_WDay[i];
					} else if (i >= firstday + this.GetMonthCount(yy, mm)) {
						da.innerHTML = "<b style="
						color: gray ">" + this.L_WDay[i] + "</b>";
						month = (mm == 1 ? 12 : mm + 1);
						day = this.L_WDay[i];
					} else {
						da.innerHTML = "<b style="
						color: #000">" + this.L_WDay[i] + "</b>";
                    month=(mm == 1 ? 12 : mm);
						day = this.L_WDay[i];
						if (document.all) {
							da.onclick = Function("L_DateLayer_Parent." + this.NewName + ".DayClick(" + month + "," + day + ")");
						} else {
							da.setAttribute("onclick", "parent." + this.NewName + ".DayClick(" + month + "," + day + ")");
						}
					}
					da.title = month + " 月" + day + " 日";
					da.style.background = (yy == new Date().getFullYear() && month == new Date().getMonth() + 1 && day == new Date().getDate()) ? "#FFD700" : "#e0e0e0";
					if (this.InputDate != null) {
						if (yy == this.InputDate.getFullYear() && month == this.InputDate.getMonth() + 1 && day == this.InputDate.getDate()) {
							da.style.background = "#0650D2";
						}
					}
				}
			}
		},
	SelectYearInnerHTML: function(strYear) //年份的下拉框
		{
			if (strYear.match(/D/) != null) {
				alert("年份输入参数不是数字！");
				return;
			}
			var m = (strYear) ? strYear : new Date().getFullYear();
			if (m < 1000 || m > 9999) {
				alert("年份值不在 1000 到 9999 之间！");
				return;
			}
			var n = m - 10;
			if (n < 1000) n = 1000;
			if (n + 26 > 9999) n = 9974;
			var s = "<select name="
			L_SelectYear " id="
			L_SelectYear " style='font-size: 12px' "
			s += "onblur='document.getElementById("
			SelectYearLayer ").style.display="
			none "' "
			s += "onchange='document.getElementById("
			SelectYearLayer ").style.display="
			none ";"
			s += "parent." + this.NewName + ".L_TheYear = this.value; parent." + this.NewName + ".SetDay(parent." + this.NewName + ".L_TheYear,parent." + this.NewName + ".L_TheMonth)'>rn";
			var selectInnerHTML = s;
			for (var i = n; i < n + 26; i++) {
				if (i == m) {
					selectInnerHTML += "<option value='" + i + "' selected>" + i + "年" + "</option>rn";
				} else {
					selectInnerHTML += "<option value='" + i + "'>" + i + "年" + "</option>rn";
				}
			}
			selectInnerHTML += "</select>";
			var DateLayer = this.GetDateLayer();
			DateLayer.document.getElementById("SelectYearLayer").style.display = "";
			DateLayer.document.getElementById("SelectYearLayer").innerHTML = selectInnerHTML;
			DateLayer.document.getElementById("L_SelectYear").focus();
		},
	SelectMonthInnerHTML: function(strMonth) //月份的下拉框
		{
			if (strMonth.match(/D/) != null) {
				alert("月份输入参数不是数字！");
				return;
			}
			var m = (strMonth) ? strMonth : new Date().getMonth() + 1;
			var s = "<select name="
			L_SelectYear " id="
			L_SelectMonth " style='font-size: 12px' "
			s += "onblur='document.getElementById("
			SelectMonthLayer ").style.display="
			none "' "
			s += "onchange='document.getElementById("
			SelectMonthLayer ").style.display="
			none ";"
			s += "parent." + this.NewName + ".L_TheMonth = this.value; parent." + this.NewName + ".SetDay(parent." + this.NewName + ".L_TheYear,parent." + this.NewName + ".L_TheMonth)'>rn";
			var selectInnerHTML = s;
			for (var i = 1; i < 13; i++) {
				if (i == m) {
					selectInnerHTML += "<option value='" + i + "' selected>" + i + "月" + "</option>rn";
				} else {
					selectInnerHTML += "<option value='" + i + "'>" + i + "月" + "</option>rn";
				}
			}
			selectInnerHTML += "</select>";
			var DateLayer = this.GetDateLayer();
			DateLayer.document.getElementById("SelectMonthLayer").style.display = "";
			DateLayer.document.getElementById("SelectMonthLayer").innerHTML = selectInnerHTML;
			DateLayer.document.getElementById("L_SelectMonth").focus();
		},
	DayClick: function(mm, dd) //点击显示框选取日期，主输入函数*************
		{
			var yy = this.L_TheYear;
			//判断月份，并进行对应的处理
			if (mm < 1) {
				yy--;
				mm = 12 + mm;
			} else if (mm > 12) {
				yy++;
				mm = mm - 12;
			}
			if (mm < 10) {
				mm = "0" + mm;
			}
			if (this.ClickObject) {
				if (!dd) {
					return;
				}
				if (dd < 10) {
					dd = "0" + dd;
				}
				this.InputObject.value = yy + "-" + mm + "-" + dd; //注：在这里你可以输出改成你想要的格式
				this.CloseLayer();
			} else {
				this.CloseLayer();
				alert("您所要输出的控件对象并不存在！");
			}
		},
	SetDate: function() {
		if (arguments.length < 1) {
			alert("对不起！传入参数太少！");
			return;
		} else if (arguments.length > 2) {
			alert("对不起！传入参数太多！");
			return;
		}
		this.InputObject = (arguments.length == 1) ? arguments[0] : arguments[1];
		this.ClickObject = arguments[0];
		var reg = /^(d+)-(d{1,2})-(d{1,2})$/;
		var r = this.InputObject.value.match(reg);
		if (r != null) {
			r[2] = r[2] - 1;
			var d = new Date(r[1], r[2], r[3]);
			if (d.getFullYear() == r[1] && d.getMonth() == r[2] && d.getDate() == r[3]) {
				this.InputDate = d; //保存外部传入的日期
			} else this.InputDate = "";
			this.L_TheYear = r[1];
			this.L_TheMonth = r[2] + 1;
		} else {
			this.L_TheYear = new Date().getFullYear();
			this.L_TheMonth = new Date().getMonth() + 1
		}
		this.CreateHTML();
		var top = this.GetY();
		var left = this.GetX();
		var DateLayer = document.getElementById("L_DateLayer");
		DateLayer.style.top = top + this.ClickObject.clientHeight + 5 + "px";
		DateLayer.style.left = left + "px";
		DateLayer.style.display = "block";
		if (document.all) {
			this.GetDateLayer().document.getElementById("L_calendar").style.width = "160px";
			this.GetDateLayer().document.getElementById("L_calendar").style.height = "180px"
		} else {
			this.GetDateLayer().document.getElementById("L_calendar").style.width = "154px";
			this.GetDateLayer().document.getElementById("L_calendar").style.height = "180px"
			DateLayer.style.width = "158px";
			DateLayer.style.height = "250px";
		}
		//alert(DateLayer.style.display)
		this.SetDay(this.L_TheYear, this.L_TheMonth);
	},
	CloseLayer: function() {
		try {
			var DateLayer = document.getElementById("L_DateLayer");
			if ((DateLayer.style.display == "" || DateLayer.style.display == "block") && arguments[0] != this.ClickObject && arguments[0] != this.InputObject) {
				DateLayer.style.display = "none";
			}
		} catch (e) {}
	}
}

document.writeln('<iframe id="L_DateLayer" name="L_DateLayer" frameborder="0" style="position:absolute;width:160px; height:200px;z-index:9998;display:none;"></iframe>');
var L_DateLayer_Parent = null;
var MyCalendar = new L_calendar();
MyCalendar.NewName = "MyCalendar";
document.onclick = function(e) {
		e = window.event || e;
		var srcElement = e.srcElement || e.target;
		MyCalendar.CloseLayer(srcElement);
	}
	//Ajax tab scripts
var bustcachevar = 1 //bust potential caching of external pages after initial request? (1=yes, 0=no)
	//var loadstatustext="<img src='/ts1/Utility/smallSpinner.gif' /> loading...";
var loadstatustext = " loading...";
var enabletabpersistence = 1 //enable tab persistence via session only cookies, so selected tab is remembered (1=yes, 0=no)?
	////NO NEED TO EDIT BELOW////////////////////////
var loadedobjects = ""
var defaultcontentarray = new Object()
var bustcacheparameter = ""

function ajaxpage(url, containerid, targetobj) {
	var page_request = false
	if (window.XMLHttpRequest) // if Mozilla, IE7, Safari etc
		page_request = new XMLHttpRequest()
	else if (window.ActiveXObject) { // if IE
		try {
			page_request = new ActiveXObject("Msxml2.XMLHTTP")
		} catch (e) {
			try {
				page_request = new ActiveXObject("Microsoft.XMLHTTP")
			} catch (e) {}
		}
	} else
		return false
	var ullist = targetobj.parentNode.parentNode.getElementsByTagName("li")
	for (var i = 0; i < ullist.length; i++)
		ullist[i].className = "" //deselect all tabs
	targetobj.parentNode.className = "selected" //highlight currently clicked on tab
	if (url.indexOf("#default") != -1) { //if simply show default content within container (verus fetch it via ajax)
		document.getElementById(containerid).innerHTML = defaultcontentarray[containerid]
		return
	}
	document.getElementById(containerid).innerHTML = loadstatustext
	page_request.onreadystatechange = function() {
		loadpage(page_request, containerid)
	}
	if (bustcachevar) //if bust caching of external page
		bustcacheparameter = (url.indexOf("?") != -1) ? "&" + new Date().getTime() : "?" + new Date().getTime()
	page_request.open('GET', url + bustcacheparameter, true)
	page_request.send(null)
}

function loadpage(page_request, containerid) {
	if (page_request.readyState == 4 && (page_request.status == 200 || window.location.href.indexOf("http") == -1))
		document.getElementById(containerid).innerHTML = page_request.responseText
}

function loadobjs(revattribute) {
	if (revattribute != null && revattribute != "") { //if "rev" attribute is defined (load external .js or .css files)
		var objectlist = revattribute.split(/s*,s*/) //split the files and store as array
		for (var i = 0; i < objectlist.length; i++) {
			var file = objectlist[i]
			var fileref = ""
			if (loadedobjects.indexOf(file) == -1) { //Check to see if this object has not already been added to page before proceeding
				if (file.indexOf(".js") != -1) { //If object is a js file
					fileref = document.createElement('script')
					fileref.setAttribute("type", "text/javascript");
					fileref.setAttribute("src", file);
				} else if (file.indexOf(".css") != -1) { //If object is a css file
					fileref = document.createElement("link")
					fileref.setAttribute("rel", "stylesheet");
					fileref.setAttribute("type", "text/css");
					fileref.setAttribute("href", file);
				}
			}
			if (fileref != "") {
				document.getElementsByTagName("head").item(0).appendChild(fileref)
				loadedobjects += file + " " //Remember this object as being already added to page
			}
		}
	}
}

function expandtab(tabcontentid, tabnumber) { //interface for selecting a tab (plus expand corresponding content)
	var thetab = document.getElementById(tabcontentid).getElementsByTagName("a")[tabnumber]
	if (thetab.getAttribute("rel")) {
		ajaxpage(thetab.getAttribute("href"), thetab.getAttribute("rel"), thetab)
		loadobjs(thetab.getAttribute("rev"))
	}
}

function savedefaultcontent(contentid) { // save default ajax tab content
	if (typeof defaultcontentarray[contentid] == "undefined") //if default content hasn't already been saved
		defaultcontentarray[contentid] = document.getElementById(contentid).innerHTML
}

function startajaxtabs() {
	for (var i = 0; i < arguments.length; i++) { //loop through passed UL ids
		var ulobj = document.getElementById(arguments[i])
		var ulist = ulobj.getElementsByTagName("li") //array containing the LI elements within UL
		var persisttabindex = (enabletabpersistence == 1) ? parseInt(getCookie(arguments[i])) : "" //get index of persisted tab (if applicable)
		var isvalidpersist = (persisttabindex < ulist.length) ? true : false //check if persisted tab index falls within range of defined tabs
		for (var x = 0; x < ulist.length; x++) { //loop through each LI element
			var ulistlink = ulist[x].getElementsByTagName("a")[0]
			ulistlink.index = x
			if (ulistlink.getAttribute("rel")) {
				var modifiedurl = ulistlink.getAttribute("href").replace(/^http:/ / [ ^ /]+/ / i, "http://" + window.location.host + "/") ulistlink.setAttribute("href", modifiedurl) //replace URL's root domain with dynamic root domain, for ajax security sake
					savedefaultcontent(ulistlink.getAttribute("rel")) //save default ajax tab content
					ulistlink.onclick = function() {
						ajaxpage(this.getAttribute("href"), this.getAttribute("rel"), this)
						loadobjs(this.getAttribute("rev"))
						saveselectedtabindex(this.parentNode.parentNode.id, this.index)
						return false
					}
					//debugger
					if ((enabletabpersistence == 1 && persisttabindex < ulist.length && x == persisttabindex) || (enabletabpersistence == 0 && ulist[x].className == "selected") || (enabletabpersistence == 1 && !persisttabindex && ulist[x].className == "selected")) {
						ajaxpage(ulistlink.getAttribute("href"), ulistlink.getAttribute("rel"), ulistlink) //auto load currenly selected tab content
						loadobjs(ulistlink.getAttribute("rev")) //auto load any accompanying .js and .css files
					}
				}
			}
		}
	}
	////////////Persistence related functions//////////////////////////
	function saveselectedtabindex(ulid, index) { //remember currently selected tab (based on order relative to other tabs)
		if (enabletabpersistence == 1) //if persistence feature turned on
			setCookie(ulid, index)
	}

	function getCookie(Name) {
		var re = new RegExp(Name + "=[^;]+", "i"); //construct RE to search for target name/value pair
		if (document.cookie.match(re)) //if cookie found
			return document.cookie.match(re)[0].split("=")[1] //return its value
		return ""
	}

	function setCookie(name, value) {
		document.cookie = name + "=" + value //cookie value is domain wide (path=/)
	}
	// picture change scripts.
	var vda_current_time = get_local_time();
	var intervalTimeValue = 3000;
	var imageDatas = "";
	if (document.getElementById("ctl01_bcr_ctl08_hdnPicChange") != null) {
		imageDatas = document.getElementById("ctl01_bcr_ctl08_hdnPicChange").value;
	}
	if (imageDatas.length <= 0) {
		imageDatas = " , , * , , * , , * , , * , , ";
	}
	var imageArray = imageDatas.split('*');
	var vda_data_bigpic_changebox = new Array();
	var item = null;
	var i = null;
	for (i = 0; i < imageArray.length; i++) {
		item = {
			adv_title: imageArray[i].split(',')[0],
			link_url: imageArray[i].split(',')[1],
			file_url: imageArray[i].split(',')[2],
			file_type: 'img',
			color: '',
			fsize: '12',
			start_time: '2008-05-22 00:00:00',
			end_time: '2012-05-23 00:00:00',
			put_area: ''
		};
		vda_data_bigpic_changebox[i] = item;
	}
	var bigpic_changebox_width = 507;
	var bigpic_changebox_height = 185;
	var vda_data_default_bigpic_changebox = [];
	var PImgPlayer = {
		_timer: null,
		_items: [],
		_container: null,
		_index: 0,
		_imgs: [],
		intervalTime: intervalTimeValue,
		init: function(objID, w, h, time) {
			this.intervalTime = time || this.intervalTime;
			this._container = document.getElementById(objID);
			this._container.style.display = "block";
			this._container.style.width = w + "px";
			this._container.style.height = h + "px";
			this._container.style.position = "relative";
			this._container.style.overflow = "hidden";
			this._container.style.border = "0px solid #cccccc";
			var linkStyle = "display: block; TEXT-DECORATION: none;";
			if (document.all) {
				linkStyle += "FILTER:";
				linkStyle += "progid:DXImageTransform.Microsoft.Barn(duration=0.5, motion='out', orientation='vertical') ";
				linkStyle += "progid:DXImageTransform.Microsoft.Barn ( duration=0.5,motion='out',orientation='horizontal') ";
				linkStyle += "progid:DXImageTransform.Microsoft.Blinds ( duration=0.5,bands=10,Direction='down' )";
				linkStyle += "progid:DXImageTransform.Microsoft.CheckerBoard()";
				linkStyle += "progid:DXImageTransform.Microsoft.Fade(duration=0.5,overlap=0)";
				linkStyle += "progid:DXImageTransform.Microsoft.GradientWipe ( duration=1,gradientSize=1.0,motion='reverse' )";
				linkStyle += "progid:DXImageTransform.Microsoft.Inset ()";
				linkStyle += "progid:DXImageTransform.Microsoft.Iris ( duration=1,irisStyle=PLUS,motion=out )";
				linkStyle += "progid:DXImageTransform.Microsoft.Iris ( duration=1,irisStyle=PLUS,motion=in )";
				linkStyle += "progid:DXImageTransform.Microsoft.Iris ( duration=1,irisStyle=DIAMOND,motion=in )";
				linkStyle += "progid:DXImageTransform.Microsoft.Iris ( duration=1,irisStyle=SQUARE,motion=in )";
				linkStyle += "progid:DXImageTransform.Microsoft.Iris ( duration=0.5,irisStyle=STAR,motion=in )";
				linkStyle += "progid:DXImageTransform.Microsoft.RadialWipe ( duration=0.5,wipeStyle=CLOCK )";
				linkStyle += "progid:DXImageTransform.Microsoft.RadialWipe ( duration=0.5,wipeStyle=WEDGE )";
				linkStyle += "progid:DXImageTransform.Microsoft.RandomBars ( duration=0.5,orientation=horizontal )";
				linkStyle += "progid:DXImageTransform.Microsoft.RandomBars ( duration=0.5,orientation=vertical )";
				linkStyle += "progid:DXImageTransform.Microsoft.RandomDissolve ()";
				linkStyle += "progid:DXImageTransform.Microsoft.Spiral ( duration=0.5,gridSizeX=16,gridSizeY=16 )";
				linkStyle += "progid:DXImageTransform.Microsoft.Stretch ( duration=0.5,stretchStyle=PUSH )";
				linkStyle += "progid:DXImageTransform.Microsoft.Strips ( duration=0.5,motion=rightdown )";
				linkStyle += "progid:DXImageTransform.Microsoft.Wheel ( duration=0.5,spokes=8 )";
				linkStyle += "progid:DXImageTransform.Microsoft.Zigzag ( duration=0.5,gridSizeX=4,gridSizeY=40 ); width: 100%; height: 100%";
			}
			//small number mark style
			var ulStyle = "margin:0;width:" + w + "px;position:absolute;z-index:999;right:5px;FILTER:Alpha(Opacity=30,FinishOpacity=90, Style=1);overflow: hidden;bottom:-1px;height:16px; border-right:1px solid #fff;";
			//
			var liStyle = "margin:0;list-style-type: none; margin:0;padding:0; float:right;";
			//
			var baseSpacStyle = "clear:both; display:block; width:23px;line-height:18px; font-size:12px; FONT-FAMILY:'宋体';opacity: 0.6;";
			baseSpacStyle += "border:1px solid #fff;border-right:0;border-bottom:0;";
			baseSpacStyle += "color:#fff;text-align:center; cursor:pointer; ";
			//
			var ulHTML = "";
			for (var i = this._items.length - 1; i >= 0; i--) {
				var spanStyle = "";
				if (i == this._index) {
					spanStyle = baseSpacStyle + "background:#ff0000;font-weight:bold;";
				} else {
					spanStyle = baseSpacStyle + "background:#000;";
				}
				ulHTML += "<li style="
				"+liStyle+"
				">";
				ulHTML += "<span onmouseover="
				PImgPlayer.mouseOver(this);
				" onmouseout="
				PImgPlayer.mouseOut(this);
				" style="
				"+spanStyle+"
				" onclick="
				PImgPlayer.play("+i+");
				return false;
				" herf="
				javascript: ;
				" title="
				" + this._items[i].title + "
				">" + (i + 1) + "</span>";
				ulHTML += "</li>";
			}
			//
			var html = "<a href="
			"+this._items[this._index].link+"
			" title="
			"+this._items[this._index].title+"
			" target="
			_blank " style="
			"+linkStyle+"
			" onmouseover="
			clearInterval(PImgPlayer._timer);
			return false;
			" onmouseout="
			PImgPlayer._timer = setInterval('PImgPlayer.play()', PImgPlayer.intervalTime);
			return false;
			"></a><ul style="
			"+ulStyle+"
			">" + ulHTML + "</ul>";
			this._container.innerHTML = html;
			var link = this._container.getElementsByTagName("A")[0];
			link.style.width = w + "px";
			link.style.height = h + "px";
			link.style.background = 'url(' + this._items[0].img + ') no-repeat center center';
			this._timer = setInterval("PImgPlayer.play()", this.intervalTime);
		},
		addItem: function(_title, _link, _imgURL) {
			this._items.push({
				title: _title,
				link: _link,
				img: _imgURL
			});
			var img = new Image();
			img.src = _imgURL;
			this._imgs.push(img);
		},
		play: function(index) {
			if (index != null) {
				this._index = index;
				clearInterval(this._timer);
				this._timer = setInterval("PImgPlayer.play()", this.intervalTime);
			} else {
				this._index = this._index < this._items.length - 1 ? this._index + 1 : 0;
			}
			var link = this._container.getElementsByTagName("A")[0];
			if (link.filters) {
				var ren = Math.floor(Math.random() * (link.filters.length));
				link.filters[ren].Apply();
				link.filters[ren].play();
			}
			link.href = this._items[this._index].link;
			link.title = this._items[this._index].title;
			link.style.background = 'url(' + this._items[this._index].img + ') no-repeat center center';
			//

			var liStyle = "margin:0;list-style-type: none; margin:0;padding:0; float:right;";
			var baseSpacStyle = "clear:both; display:block; width:23px;line-height:18px; font-size:12px; FONT-FAMILY:'宋体'; opacity: 0.6;";
			baseSpacStyle += "border:1px solid #fff;border-right:0;border-bottom:0;";
			baseSpacStyle += "color:#fff;text-align:center; cursor:pointer; ";
			var ulHTML = "";
			for (var i = this._items.length - 1; i >= 0; i--) {
				var spanStyle = "";
				if (i == this._index) {
					spanStyle = baseSpacStyle + "background:#ff0000;font-weight:bold;";
				} else {
					spanStyle = baseSpacStyle + "background:#000;";
				}
				ulHTML += "<li style="
				"+liStyle+"
				">";
				ulHTML += "<span onmouseover="
				PImgPlayer.mouseOver(this);
				" onmouseout="
				PImgPlayer.mouseOut(this);
				" style="
				"+spanStyle+"
				" onclick="
				PImgPlayer.play("+i+");
				return false;
				" herf="
				javascript: ;
				" title="
				" + this._items[i].title + "
				">" + (i + 1) + "</span>";
				ulHTML += "</li>";
			}

			this._container.getElementsByTagName("UL")[0].innerHTML = ulHTML;
		},
		mouseOver: function(obj) {
			var i = parseInt(obj.innerHTML);
			if (this._index != i - 1) {
				obj.style.color = "#ff0000";
				obj.style.fontWeight = "bold";
			}
		},
		mouseOut: function(obj) {
			obj.style.color = "#fff";
		}
	}
	vda_loader_bigpic_changebox(); //main
	function vda_loader_bigpic_changebox() {
		load_img_turnplay_vda(vda_data_bigpic_changebox, vda_data_default_bigpic_changebox, bigpic_changebox_width, bigpic_changebox_height, 'bigpic_changebox', 'N');
	}

	function load_img_turnplay_vda(vda_data, default_data, width, height, div_id, view_text) {
		if (!document.getElementById(div_id)) {
			return;
		}
		var j = 0;
		var i = 0;
		var img_url_ret = Array();
		var img_text_ret = Array();
		var img_link_ret = Array();
		var current_vda = Array();
		if (vda_data.length > 0) {

			for (i = 0; i < vda_data.length; i++) {
				var start_time = vda_data[i].start_time;
				var end_time = vda_data[i].end_time;
				var put_area = vda_data[i].put_area;

				var current_time = get_current_time();
				//alert('start:'+start_time+' end:'+end_time+' current:'+current_time);
				if (current_time > start_time && current_time < end_time) {
					//alert(vda_data[i].title);
					if (typeof(vda_current_area) == "undefined" || put_area == '' || put_area.search(vda_current_area) != -1) {
						var title = vda_data[i].adv_title;
						var link_url = vda_data[i].link_url;
						var file_url = vda_data[i].file_url;
						if (vda_data[i].file_type == 'img' && vda_data[i].file_url != '') {
							j++;
							PImgPlayer.addItem(vda_data[i].adv_title, vda_data[i].link_url, vda_data[i].file_url);
						}
					}
				}
			}
			if (j > 0) {
				if (PImgPlayer._items.length == 1) {
					document.getElementById(div_id).innerHTML = '<a href="' + vda_data[0].link_url + '" target="_blank"><img src="' + vda_data[0].file_url + '" width="' + width + '" height="' + height + '" border="0" /></a>'
				} else PImgPlayer.init(div_id, width, height);
			}
		}
	}
	/*common function begin */
	function get_local_time() {
		var now = new Date();
		var ctime = '';
		var year = now.getYear();
		var month = now.getMonth() + 1;
		var day = now.getDate();
		var hours = now.getHours();
		var minutes = now.getMinutes();
		var seconds = now.getSeconds();

		if (year < 1900) {
			year = year + 1900;
		}
		ctime += year + "-";
		ctime += ((month < 10) ? "0" : "") + month + "-";
		ctime += ((day < 10) ? "0" : "") + day + " ";

		ctime += ((hours < 10) ? "0" : "") + hours + ":";
		ctime += ((minutes < 10) ? "0" : "") + minutes + ":";
		ctime += ((seconds < 10) ? "0" : "") + seconds + "";

		return ctime;
	}

	function get_current_time() {
		if (typeof(vda_current_time) == "undefined") {
			return get_local_time();
		} else {
			if (vda_current_time > '2008-06-06 16:04:41') {
				return vda_current_time;
			} else {
				return get_local_time();
			}
		}
	}

	function getRandomNumber(minNum, maxNum) {
		if (minNum == undefined) {
			minNum = 0;
			maxNum = 10;
		} else if (maxNum == undefined) {
			maxNum = minNum;
			minNum = 0;
		} else if (maxNum < minNum) {
			var tmpNum = maxNum;
			maxNum = minNum;
			minNum = tmpNum;
		}
		return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
	}

	function CharMode(iN) {
		if (iN >= 48 && iN <= 57) {
			return 1;
		}

		if (iN >= 65 && iN <= 90) {
			return 2;
		}

		if (iN >= 97 && iN <= 122) {
			return 4;
		} else {
			return 8;
		}
	}

	function bitTotal(num) {
		var modes = 0;
		for (i = 0; i < 4; i++) {
			if (num & 1) {
				modes++;
			}
			num >>>= 1;
		}
		return modes;
	}

	function checkStrong(sPW) {
		if (sPW.length <= 4) {
			return 0;
		}
		var Modes = 0;
		for (i = 0; i < sPW.length; i++) {
			Modes |= CharMode(sPW.charCodeAt(i));
		}

		return bitTotal(Modes);
	}
	/* 检查Image格式 */
	function CheckImage(obj) {
		var filePath = obj.value;
		if (filePath.Trim() == "") return;
		var i = filePath.lastIndexOf('.');
		var len = filePath.length;
		var str = filePath.substring(len, i + 1);
		var exName = "JPG,GIF,BMP,JPEG";
		var k = exName.indexOf(str.toUpperCase());
		if (k == -1) {
			alert("请选择图片格式JPG,GIF,BMP,JPEG");
			if (obj != null) {
				Upload.clear(obj);
			}
		}
	}
	var Upload = {
		clear: function(obj) {
			if (typeof obj != "object") return null;
			var tt = document.createElement("span");
			tt.id = "__tt__";
			obj.parentNode.insertBefore(tt, obj);
			var tf = document.createElement("form");
			tf.appendChild(obj);
			document.getElementsByTagName("body")[0].appendChild(tf);
			tf.reset();
			tt.parentNode.insertBefore(obj, tt);
			tt.parentNode.removeChild(tt);
			tt = null;
			tf.parentNode.removeChild(tf);
		},

		clearForm: function() {
			var inputs, frm;
			if (arguments.length == 0) {
				inputs = document.getElementsByTagName("input");
			} else {
				frm = arguments[0];
				if (typeof frm != "object") return null;
				inputs = frm.getElementsByTagName("input");
			}
			var fs = [];
			for (var i = 0; i < inputs.length; i++) {
				if (inputs[i].type == "file") fs[fs.length] = inputs[i];
			}
			var tf = document.createElement("form");
			for (var i = 0; i < fs.length; i++) {
				var tt = document.createElement("span");
				tt.id = "__tt__" + i;
				fs[i].parentNode.insertBefore(tt, fs[i]);
				tf.appendChild(fs[i]);
			}
			document.getElementsByTagName("body")[0].appendChild(tf);
			tf.reset();
			for (var i = 0; i < fs.length; i++) {
				var tt = document.getElementById("__tt__" + i);
				tt.parentNode.insertBefore(fs[i], tt);
				tt.parentNode.removeChild(tt);
			}
			tf.parentNode.removeChild(tf);
		}
	}

	function changeAuthCode() {
		return changeAuthCodeByAspx("authCode.aspx");
	}

	function changeAuthCodeByAspx(aspxFile) {
		var num = new Date().getTime();
		var rand = Math.round(Math.random() * 10000);
		num = num + rand;
		document.getElementById("yzm").src = aspxFile + "?tag=" + num;
		document.getElementById("identifier").value = num;
		return false;
	}
	/*common function end*/