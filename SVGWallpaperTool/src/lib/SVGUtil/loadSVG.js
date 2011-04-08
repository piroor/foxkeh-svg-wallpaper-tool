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
