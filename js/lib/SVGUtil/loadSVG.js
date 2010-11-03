/** 
 * @fileOverview 外部のSVGファイルを読み込む
 * 
 * @author OFFIBA.com
 * @version 20101021
 *
 * copyright 2010 OFFIBA,inc.
 * Dual licensed under the MIT or GPL Version 3 licenses.
 */ 

var global = this;

(function(global){
	
	function loadSVG(url,callback) {
		 
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
 
		xhr.onreadystatechange = function() {
			
			if(xhr.readyState == 4) {
 
				if(xhr.status == 200 && xhr.responseXML) {
				 
					var svg = xhr.responseXML.getElementsByTagName("svg")[0];
					svg = document.importNode(svg, true);
					
					callback(svg);
					this.svg = svg;

				}
 
			}
 
		};


		xhr.send(null);
 
 
	};
	
	//グローバルオブジェクトに
	if(typeof SVGUtil == "undefined") {
		global.SVGUtil = {};
	}
	
	global.SVGUtil.loadSVG = loadSVG;
	
})(this);