/*!
 * SVG Wallpaper Tool
 * https://bitbucket.org/foxkeh/svg-wallpaper-tool/
 *
 * Copyright 2011, Mozilla Japan.
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * https://bitbucket.org/foxkeh/svg-wallpaper-tool/src/tip/MIT-LICENSE.txt
 * https://bitbucket.org/foxkeh/svg-wallpaper-tool/src/tip/GPL-LICENSE.txt
 *
 * Includes Modernizr.js  
 * www.modernizr.com
 * Developed by: 
 * - Faruk Ates  http://farukat.es/
 * - Paul Irish  http://paulirish.com/
 * Copyright (c) 2009-2011
 * Dual-licensed under the BSD or MIT licenses.
 * http://www.modernizr.com/license/
 *
 */
 (function(){
	
	var SVGUtil = {};
		
	SVGUtil.loadSVG = function (url,callback) {
		 
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
	window.SVGUtil = SVGUtil;
	
}());(function(){
    
    var SVGBoundingBox = function(SVGSprite,options) {
         
        options = (typeof options == "undefined")? {} : options;
        
        //SVGSprite
        this.SVGSprite = SVGSprite;
        
	this.isSafari = (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1);
	
        //オプション
        this.options = {
            scale: (typeof options.scale == "boolean")? options.scale : true,
            rotation: (typeof options.rotation == "boolean")? options.rotation : true
        }
        
        
        this.center = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.SVGSprite.svgElement.ownerSVGElement.appendChild(this.center);
        this.SVGSprite.svgElement.ownerSVGElement.appendChild(this.point);
        
        
        //初期化
        this.init();
    
    };
    
    /**
     * 初期化する
     */
    SVGBoundingBox.prototype.init = function(){

        this.origMouseX = this.origMouseY = this._rotateInitRotate = null;      
        this.origWidth = this.SVGSprite.width;
        this.origHeight = this.SVGSprite.height;
        
        //枠を作る
        var _bbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        _bbox.setAttribute("width", this.origWidth);
        _bbox.setAttribute("height", this.origHeight);
        this._bbox = _bbox;
        
        //拡大縮小ボックス
        var _scaleBox = document.createElementNS("http://www.w3.org/2000/svg", "g");
	/*var _scaleBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "use");
        _scaleBoxSVG.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href","svg/scale.svg#scale");
        _scaleBoxSVG.setAttribute("transform", "scale("+1/this.SVGSprite._viewPortScaleX+")");
	_scaleBox.appendChild(_scaleBoxSVG);
	*/
	var _scaleSVGSrc = '<svg xmlns="http://www.w3.org/2000/svg">';
	_scaleSVGSrc += '<g id="scale">';
	_scaleSVGSrc += '<rect width="20" height="20" x="0" y="0" style="color:#000000;fill:#ffffff;stroke:#000000;stroke-width:0.5" />';
	_scaleSVGSrc += '<g transform="translate(0, -6)">';
	_scaleSVGSrc += '<path d="M 4.730198,11.40495 15.722277,22.397029" style="fill:none;stroke:#000000;stroke-width:0.5;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none" />';
	_scaleSVGSrc += '<path d="m 8.4005759,8.3507412 -4.1659224,-10e-8 -4.16592245,0 L 2.1516922,4.7429466 4.2346535,1.1351519 6.3176146,4.7429464 z" ';
	_scaleSVGSrc += 'transform="matrix(0.51977901,-0.51977901,0.51977901,0.51977901,-0.95968357,9.9839171)" ';
	_scaleSVGSrc += 'style="color:#000000;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.505;marker:none;visibility:visible;display:inline;overflow:visible;enable-background:accumulate" />';
	_scaleSVGSrc += '<path d="m 8.4005759,8.3507412 -4.1659224,-10e-8 -4.16592245,0 L 2.1516922,4.7429466 4.2346535,1.1351519 6.3176146,4.7429464 z" ';
	_scaleSVGSrc += 'transform="matrix(-0.51977901,0.51977901,-0.51977901,-0.51977901,20.372362,22.713437)" ';
	_scaleSVGSrc += 'style="color:#000000;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.505;marker:none;visibility:visible;display:inline;overflow:visible;enable-background:accumulate" />';
	_scaleSVGSrc += '</g>';
	_scaleSVGSrc += '</g>';
	_scaleSVGSrc += '</svg>';
	var parser = new DOMParser()
	var _scaleSVGXML = parser.parseFromString(_scaleSVGSrc, "text/xml");
	var _scaleSVG = document.adoptNode(_scaleSVGXML.getElementById("scale"));
	_scaleSVG.setAttribute("transform", "scale("+1/this.SVGSprite._viewPortScaleX+")");
	_scaleBox.appendChild(_scaleSVG);
        this._scaleBox = _scaleBox;
        
        //回転ボックス
        var _rotateBox = document.createElementNS("http://www.w3.org/2000/svg", "g");
        //var _rotateBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "use");
        //_rotateBoxSVG.setAttribute("transform", "scale("+1/this.SVGSprite._viewPortScaleX+")");
        //_rotateBoxSVG.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href","svg/rotate.svg#rotate");
        //_rotateBox.appendChild(_rotateBoxSVG);
	var _rotateSVGSrc = '<svg xmlns="http://www.w3.org/2000/svg">';
	_rotateSVGSrc += '<g id="rotate">';
	_rotateSVGSrc += '<rect width="20" height="20" x="0" y="0" style="color:#000000;fill:#ffffff;stroke:#000000;stroke-width:0.5" />';
	_rotateSVGSrc += '<g transform="translate(0, -6)">';
	_rotateSVGSrc += '<path d="m 8.4005759,8.3507412 -4.1659224,-10e-8 -4.16592245,0 L 2.1516922,4.7429466 4.2346535,1.1351519 6.3176146,4.7429464 z"';
	_rotateSVGSrc += '  transform="matrix(0,0.73507853,-0.73507853,0,19.836613,7.6490556)"';
	_rotateSVGSrc += '  style="color:#000000;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.505;marker:none;visibility:visible;display:inline;overflow:visible;enable-background:accumulate" />';
	_rotateSVGSrc += '<path d="m 8.4005759,8.3507412 -4.1659224,-10e-8 -4.16592245,0 L 2.1516922,4.7429466 4.2346535,1.1351519 6.3176146,4.7429464 z"';
	_rotateSVGSrc += '  transform="matrix(-0.73507853,0,0,-0.73507853,7.6878788,25.768073)"';
	_rotateSVGSrc += '  style="color:#000000;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:0.505;marker:none;visibility:visible;display:inline;overflow:visible;enable-background:accumulate" />';
	_rotateSVGSrc += '<path d="m 4.3217759,21.80785 c 0,-6.426081 4.9898167,-11.635449 11.1450671,-11.635449"';
	_rotateSVGSrc += '  style="color:#000000;fill:none;stroke:#000000;stroke-width:0.40038314;stroke-opacity:1;marker:none;visibility:visible;display:inline;overflow:visible;enable-background:accumulate" />';
	_rotateSVGSrc += '</g></g>';
	_rotateSVGSrc += '</svg>';
	var _rotateSVGXML = (new DOMParser()).parseFromString(_rotateSVGSrc, "text/xml");
	var _rotateSVG = document.adoptNode(_rotateSVGXML.getElementById("rotate"));
	_rotateSVG.setAttribute("transform", "scale("+1/this.SVGSprite._viewPortScaleX+")");
	_rotateBox.appendChild(_rotateSVG);
	this._rotateBox = _rotateBox;
        
        this._setBoxes();
        
        var self = this;
        $(this._scaleBox).mousedown( function(e){ self._startScale(); });
        $(this._rotateBox).mousedown( function(e){ self._startRotate(); });
        	
	//this.SVGSprite.svgElement.ownerSVGElement.addEventListener("mousemove", function(e){
	$(window).mousemove(function(e){
	    
            self._doScale(e);
            self._doRotate(e);
        
	});
        
	window.addEventListener('mouseup', function(e){
            
            self._endScale();
            self._endRotate();
            
        }, true);

        
    };
    
    /**
     * BOX調整
     */
    SVGBoundingBox.prototype._setBoxes = function(){
        
        var strokeWidth = (20/Math.abs(this.SVGSprite.scaleX))/this.SVGSprite._viewPortScaleX;
        var boxWidth = (20/this.SVGSprite.scaleX);
        
        //枠
        var _bbox = this._bbox;
        _bbox.setAttribute("x", this.SVGSprite._svgTransformUtil.origOffset.x);
        _bbox.setAttribute("y", this.SVGSprite._svgTransformUtil.origOffset.y);
        _bbox.setAttribute("style", "opacity:0.6; fill:#fff; stroke:#fff; stroke-width:"+strokeWidth+"; stroke-linejoin:round;");
        
        //拡大縮小
        var _scaleBox = this._scaleBox;
        //_scaleBox.setAttribute("x", (this.SVGSprite._svgTransformUtil.origOffset.x+this.origWidth-(boxWidth/3))*this.SVGSprite.scaleX);
        //_scaleBox.setAttribute("y", (this.SVGSprite._svgTransformUtil.origOffset.y+this.origHeight-(boxWidth/3))*this.SVGSprite.scaleX);
        var _scaleX = (this.SVGSprite._svgTransformUtil.origOffset.x+this.origWidth-(boxWidth*.5))*this.SVGSprite.scaleX;
        var _scaleY = (this.SVGSprite._svgTransformUtil.origOffset.y+this.origHeight-(boxWidth*.5))*this.SVGSprite.scaleX;
        _scaleBox.setAttribute("transform", "scale("+1/this.SVGSprite.scaleX+") translate("+_scaleX+", "+_scaleY+")");
        //_scaleBox.setAttribute("width", boxWidth);
        //_scaleBox.setAttribute("height", boxWidth);
        //_scaleBox.setAttribute("style", "opacity:1; fill:#fff; stroke:#000; stroke-width:"+(.5/this.SVGSprite.scaleX)+"; stroke-linejoin:round;cursor:se-resize");
        _scaleBox.setAttribute("style", "cursor:se-resize");
        
        
        //回転
        var _rotateBox = this._rotateBox;
        //_rotateBox.setAttribute("x", ((this.SVGSprite._svgTransformUtil.origOffset.x-(boxWidth*.6))*(this.SVGSprite.scaleX)));
        //_rotateBox.setAttribute("y", ((this.SVGSprite._svgTransformUtil.origOffset.y-(boxWidth*.6))*(this.SVGSprite.scaleX)));
        var _rotateX = (this.SVGSprite._svgTransformUtil.origOffset.x-(boxWidth*.8))*(this.SVGSprite.scaleX);
        var _rotateY = (this.SVGSprite._svgTransformUtil.origOffset.y-(boxWidth*.8))*(this.SVGSprite.scaleX);
        _rotateBox.setAttribute("transform", "scale("+1/this.SVGSprite.scaleX+") translate("+_rotateX+", "+_rotateY+")");
        //_rotateBox.setAttribute("width", boxWidth);
        //_rotateBox.setAttribute("height", boxWidth);
        //_rotateBox.setAttribute("style", "opacity:1; fill:#eee; stroke:#000; stroke-width:"+(.5/this.SVGSprite.scaleX)+"; stroke-linejoin:round;cursor:pointer");
        _rotateBox.setAttribute("style", "cursor:pointer");

    };

    /**
     * 有効化
     */
    SVGBoundingBox.prototype.enable = function(){
        
        //枠を挿入
        this.SVGSprite._svgTransformUtil.transformWrapper.appendChild(this._bbox);
        this.SVGSprite._svgTransformUtil.transformWrapper.appendChild(this.SVGSprite._oapcityElement);
        
        //拡大縮小ボックスを挿入
        this.SVGSprite._svgTransformUtil.transformWrapper.appendChild(this._scaleBox);
        
        //回転ボックスを挿入
        this.SVGSprite._svgTransformUtil.transformWrapper.appendChild(this._rotateBox);
        
    };
    
    /**
     * 無効化
     */
    SVGBoundingBox.prototype.disable = function(){

        //枠を削除
        this.SVGSprite._svgTransformUtil.transformWrapper.removeChild(this._bbox);
        
        //拡大縮小ボックスを削除
        this.SVGSprite._svgTransformUtil.transformWrapper.removeChild(this._scaleBox);
        
        //回転ボックスを削除
        this.SVGSprite._svgTransformUtil.transformWrapper.removeChild(this._rotateBox);
        
    };
    
    /**
     * 拡大縮小開始
     */
    SVGBoundingBox.prototype._startScale = function(){

        this._scaling = true;
        this._scaleOrigWidth = this.SVGSprite.width;
        this._scaleOrigHeight = this.SVGSprite.height;
        
    };
    
    /**
     * 拡大縮小中
     */
    SVGBoundingBox.prototype._doScale = function(event) {
        	   
        if(this._scaling) {
            	    
            //マウスの初期位置設定
            /*if(this.origMouseX == null) {
            
                this.origMouseX = event.pageX;
                this.origMouseY = event.pageY;
                            
            }*/

            /*            
            //移動量
            var x = ((event.clientX-this.origMouseX)/this.SVGSprite._viewPortScaleX);
            var y = ((event.clientY-this.origMouseY)/this.SVGSprite._viewPortScaleY);
            var _scale = Math.sqrt(x*x+y*y); //√(c-a)^2+(d-b)^2
            _scale = (x<0||y<0)? -_scale : _scale;
            
            this.SVGSprite.width = this._scaleOrigWidth+_scale;
	    this.SVGSprite.scaleY = this.SVGSprite.scaleX;
            this.SVGSprite.height = this._scaleOrigHeight+_scale;
	    */
	    
	    if(this.origMouseX == null) {
		
		this.origScreenCTM = this.SVGSprite._svgTransformUtil.transformWrapper.getScreenCTM();
	    
	    }
	    
	    var x = (this.isSafari)? event.pageX : event.pageX-$(window).scrollLeft();
	    var y = (this.isSafari)? event.pageY : event.pageY-$(window).scrollTop();
	    
	    var ctm = this.origScreenCTM;
			
	    var p = this.SVGSprite.svgElement.ownerSVGElement.createSVGPoint();
	    p.x = x;
	    p.y = y;
	    p = p.matrixTransform(ctm.inverse());
	    
            if(this.origMouseX == null) {
            
                this.origMouseX = p.x;
		this.origScaleX = this.SVGSprite.scaleX;
		this.origFlipped = ((this.SVGSprite.scaleY<0 && this.origScaleX>0) || (this.SVGSprite.scaleY>0 && this.origScaleX<0));
		
            }
	    
	    //var cp = this.SVGSprite.svgElement.ownerSVGElement.createSVGPoint();
	    //cp.x = this.SVGSprite.width/2;//this.SVGSprite.x;
	    //cp.y = this.SVGSprite.height/2;//this.SVGSprite.y;
	    //cp = cp.matrixTransform(this.SVGSprite._svgTransformUtil.transformWrapper.getCTM().inverse());
	    
	    /*this.point.setAttribute("cx", p.x);
            this.point.setAttribute("cy", p.y);
	    this.center.setAttribute("cx", cp.x);
            this.center.setAttribute("cy", cp.y);
	    */
	    
	    var ratio = (p.x-(this.origMouseX/2))/(this.origMouseX/2); //中心点を基準とした初期座標とマウス座標の差分
	    var scale = this.origScaleX*ratio;
	    	    
	    this.SVGSprite.scaleX = scale;
	    this.SVGSprite.scaleY = (this.origFlipped)? -scale : scale;
	    
            this._setBoxes();
                        
        }
        
        	
    };
        
     /**
     * 拡大縮小完了
     */
    SVGBoundingBox.prototype._endScale = function() {
        
        this._scaling = false;
        this.origMouseX = this.origMouseY = null;
        
    };
    
    /**
     * 回転開始
     */
    SVGBoundingBox.prototype._startRotate = function(){

        this._rotation = true;
        this._rotateOrigRotation = this.SVGSprite.rotation;
        this._rotateOrigX = this.SVGSprite.x;
        this._rotateOrigY = this.SVGSprite.y;
        
    };
    
    /**
     * 回転中
     */
    SVGBoundingBox.prototype._doRotate = function(event) {
                
        if(this._rotation) {
            
            var clientX = event.layerX/this.SVGSprite._viewPortScaleX;
            var clientY = event.layerY/this.SVGSprite._viewPortScaleX;
            
            if(this._rotateInitRotate == null) {
                
                var _x = (clientX*this.SVGSprite._viewPortScaleX)-this._rotateOrigX;
                var _y = (clientY*this.SVGSprite._viewPortScaleY)-this._rotateOrigY;
                var _radian = Math.atan2(_y,_x);
                var _rotation = _radian/(Math.PI/180);
                this._rotateInitRotate = _rotation;
                
            }
                        
                        
            //移動量
            var x = (clientX)-this._rotateOrigX;
            var y = (clientY)-this._rotateOrigY;
            
            var radian = Math.atan2(y,x);
            var rotation = (radian/(Math.PI/180))-this._rotateInitRotate;
            
	    
            //console.log(rotation);
            /*
            this.center.setAttribute("r", 20);
            this.center.setAttribute("cx", this._rotateOrigX);
            this.center.setAttribute("cy", this._rotateOrigY);
            
            this.point.setAttribute("r", 20);
            this.point.setAttribute("cx", (clientX));
            this.point.setAttribute("cy", (clientY));
            this.point.setAttribute("fill", "#f00");
	    */
            
            this.SVGSprite.rotation = this._rotateOrigRotation+rotation;
            
            this._setBoxes();
                        
        }
        
        	
    };
        
     /**
     * 回転完了
     */
    SVGBoundingBox.prototype._endRotate = function() {
        	
        this._rotation = false;
        this._rotateInitRotate = null;
        
    };
    
    //グローバルオブジェクトに
    window.SVGBoundingBox = SVGBoundingBox;
    
    
}());(function(global){
 
    var SVGDropBox = function(option){
        
        option = option || {};
        this.imageWidth = option.width || 100;
        this.imageHeight = option.height || 100;
	this.validFile = false;
        
        this.init();
    };
    
    SVGDropBox.MIMETYPE = {
        svg : "image/svg+xml",
        jpeg: "image/png",
        png : "image/jpeg",
        gif : "image/gif"
    };
    
    /**
     *初期化
     */
    SVGDropBox.prototype.init = function(){
	
        //ドロップ領域用の要素を作成
        this.element = document.createElement("div");

	//FileReaderが定義されていない場合は初期化せず
	if(typeof FileReader === 'undefined') {
	    
	    return;
	    
	}
        
	//クラス名の付与
	this.className = "SVGDropBox";
        this.element.className = this.className;
	
        //Dropサポートの有無        
        if(this.isDropSupported()) { //Dropが有効の場合
            
            var p = document.createElement("p");
            p.innerHTML = "drop File";
            
            var self = this;
            
            this.element.addEventListener("dragenter", function(e){
		e.stopPropagation();
		e.preventDefault();
                
                self.element.className = self.className+" SVGDropBoxDragover";
                
	    }, false);
			
	    this.element.addEventListener("dragover", function(e){
		e.stopPropagation();
		e.preventDefault();
	    }, false);
            
            this.element.addEventListener("dragleave", function(e){
                e.stopPropagation();
		e.preventDefault();

                self.element.className = (typeof self.content == "undefined")? self.className : self.className+" SVGDropBOXDroped";                

            }, false);
            
            this.element.addEventListener("drop",function(e){
		
                e.stopPropagation();
                e.preventDefault();
                
                self.element.className = self.className;
                
                //ドロップされたファイルの取得
                var dt = e.dataTransfer;
                var files = dt.files;
                
                //ファイルのロード
                if(files.length > 0) {
		    
                    self.loadFile(files[0]);
		
		}
                
            },false);
            
            this.element.appendChild(p);
            
        } else { //Dropが無効の場合

            
            var p = document.createElement("p");
            p.innerHTML = "select File";
            
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            
            var self = this;
            input.addEventListener("change", function(e){
				
		var file = e.currentTarget.files[0];
		self.loadFile(file);
                
            }, false);
            
            this.element.appendChild(p);
            this.element.appendChild(input);
            
        }
        
     
    };
    
    /**
     * via Modernizr v1.6
     */
    SVGDropBox.prototype.isDropSupported = function(){
	
        var element = document.createElement('div');
        var eventName = 'ondrop';

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = (eventName in element);

        if (!isSupported) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if (!element.setAttribute) {
            element = document.createElement('div');
          }
          if (element.setAttribute && element.removeAttribute) {
            element.setAttribute(eventName, '');
            isSupported = typeof element[eventName] == 'function';

            // If property was created, "remove it" (by setting value to `undefined`)
            if (typeof element[eventName] != 'undefined') {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
    
    };
    
    SVGDropBox.prototype.isSVG = function(file){
      
        return (file.type == SVGDropBox.MIMETYPE.svg);
        
    };
    
    SVGDropBox.prototype.isImage = function(file){
        
        var type = file.type;
        return (type==SVGDropBox.MIMETYPE.jpeg||type==SVGDropBox.MIMETYPE.gif||type==SVGDropBox.MIMETYPE.png);
        
    }
    
    SVGDropBox.prototype.loadFile = function(file) {
        
	//サイズが0byteだった場合は処理をしない Firefox3.6のバグ対策
	if(file.size > 0) {
	
	    //ファイルタイプを判別
	    this.fileType = this.isSVG(file)? "svg" : this.isImage(file)? "image" : "other";
	    	    
	    var reader = new FileReader();
	    
	    var self = this;
	    reader.onload = function(e){ self.onFileLoaded(e);};
	    
	    if(this.fileType=="svg") {
		
		reader.readAsText(file, "utf-8");
		this.validFile = true;
		
	    } else if(this.fileType=="image"){
		
		reader.readAsDataURL(file);
		this.validFile  = true;
		
	    }
	    
	}
	
    };
    
    SVGDropBox.prototype.onFileLoaded = function(e) {
        
        var result = e.target.result;
        var container = document.createElement("div");
        container.className = "SVGDropBoxContainer";
        
        if(this.fileType == "svg") {
            
            //パース
            var parser = new DOMParser();  
            var svgDoc = parser.parseFromString(result, "text/xml");
                        
            var svgElement = document.importNode(svgDoc.getElementsByTagName("svg")[0], true);
            
            var width = svgElement.width.baseVal.value;
            var height = svgElement.height.baseVal.value;
            var aspect = height/width;

            var imageWidth = (this.imageWidth*aspect < this.imageHeight)? this.imageWidth : this.imageHeight/aspect;
            var imageHeight = (this.imageWidth*aspect < this.imageHeight)? this.imageWidth*aspect : this.imageHeight;
            
            svgElement.setAttribute("viewBox", "0 0 "+width+" "+height);
            svgElement.setAttribute("width", imageWidth);
            svgElement.setAttribute("height", imageHeight);
                    
            var contentElement = svgElement;
	    
	    result = svgDoc.getElementsByTagName("svg")[0];
                
        } else if(this.fileType == "image") {
            
            var image = document.createElement("img");
            image.src = result;
            image.setAttribute("width", this.imageWidth);
            
            var contentElement = image;
            
        }
        
        container.appendChild(contentElement);

        var children = this.element.childNodes;
        
        for(var i=0,l=children.length; i<l; i++) {
            
            this.element.removeChild(children[i]);
            
        }
        
        this.element.appendChild(container);
	this.element.className = self.className+" SVGDropBOXDroped";
	
	this.contentElement = contentElement;
        this.container = container;
        this.content = result;
        
    };
    
    
    
    global.SVGDropBox = SVGDropBox;
 
})(window);(function(global){
    
  var SWT = {};
 
 /**
  * クロスブラウザ用ゲッターセッター関数
  * @param {Object} obj ゲッターセッターを設定したいオブジェクト
  * @param {String} name ゲッターセッタープロパティ名
  * @param {Function} setter セッター関数
  * @param {Function} getter ゲッター関数
 */
 SWT._defineSetterGetter = function(obj, name, setter, getter) {

   //__defineSetter__が未定義かつObject.definePropertyが有効な場合
   if (!Object.prototype.__defineSetter__ && Object.defineProperty({},"x",{get: function(){return true}}).x) {

       Object.defineProperty(obj,name, {
           set: setter,
           get: getter 
       });

   } else if(Object.prototype.__defineSetter__) {
   
       obj.__defineSetter__(name, setter);
       obj.__defineGetter__(name, getter);
   
   }

 };

 /**
  * 初期化
  */
 SWT.SVGWallpaperTool = function(param) {
       
       if(!param) {
	      return;
       }
 
       /**
        * 基本オブジェクト
        */
 
	//壁紙
       if(param.wallpaperSVG) {
	      this.wallpaper = new SWT.Wallpaper($("#"+param.wallpaperSVG)[0]);
       } else {
	      return;
       }
       
 
       /**
        * UI
        */
 
 	//壁紙サイズ設定
	if(param.sizeSelector) {
	      var select = $("#"+param.sizeSelector);
	      this.sizeSelectorView = new SWT.WallpaperSizeSelectorView(select);
	      this.sizeSelectorController = new SWT.WallpaperSizeSelectorController(this.sizeSelectorView, this.wallpaper);
	}
 
	//背景画像リストコントローラー
	if(param.backgroundList) {
		var list = $("#"+param.backgroundList);
		this.backgroundListController = new SWT.BackgroundListController(this.wallpaper, list);
	}
 
	//パーツリスト
	if(param.partsList) {
		
		var partsList = $("#"+param.partsList);
		this.partsListView = new SWT.PartsListView(partsList);
		this.partsListController = new SWT.PartsListController(this.wallpaper, this.partsListView);
  
	}
 
	//ダウンロードボタン
	if(param.downLoadButton) {
		var button = $("#"+param.downLoadButton);
		this.downloadButtonController = new SWT.DownloadButtonController(this.wallpaper, button);
	}
 
       //パーツコントローラー
       if(param.partsControll) {
              var partsControll = $("#"+param.partsControll);
              var options = {
                     scale: param.scaleOptions,
                     alpha: param.alphaOptions,
                     rotation: param.rotationOptions
              };
              this.partsControllView = new SWT.PartsControllView(this.wallpaper, partsControll, options);
              this.partsControllController = new SWT.PartsControllController(this.wallpaper, this.partsControllView);
       }
       
       //インジケーター
       if(param.indicator) {
              var indicator = $("#"+param.indicator);
              this.indicatorView = new SWT.IndicatorView(this.wallpaper, indicator);
       }
       
       
       /**
        * 画像読み込み
        */
       
       //コピーライト画像読み込み
       if(param.copyright) {
              this.wallpaper.loadCopyright(param.copyright);
       }
       
       //背景画像読み込み
       if(param.background) {
	      this.wallpaper.loadBackground(param.background);
       }
 
       //パーツ読み込み
       if(param.parts) {	
	      for(var i=0,l=param.parts.length; i<l; i++) {
		     this.wallpaper.loadParts({ file: param.parts[i] });
	      }
       }
 
 };
 
 //グローバルオブジェクト化
 global.SWT = SWT;
 global.SVGWallpaperTool = SWT.SVGWallpaperTool;
 
}(window));(function(global){

 var SWT = global.SWT;

 /**
  * 壁紙
  */
 SWT.Wallpaper = function(svg, partsLimit) {
	
	this.svg = svg;
	this._origWidth = svg.width.baseVal.value;
	this.partsLimit = (typeof partsLimit == "number")? partsLimit : 5; //パーツ数の最大値
	this.parts = [];
	this.activeParts = null;
        this._loadingObjects = [];
	
	//初期化
	this.init();
        
 };
 
 //壁紙を初期化
 SWT.Wallpaper.prototype.init = function() {
 
	//レイヤーを作成
	var backgroundLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
	backgroundLayer.setAttribute("class", "wallpaperBackground");
	
	var partsLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
	partsLayer.setAttribute("class", "wallpaperParts");
	
        var copyrightLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
	copyrightLayer.setAttribute("class", "wallpaperCopyright");
        
	this._backgroundLayer = backgroundLayer;
	this._partsLayer = partsLayer;
        this._copyrightLayer = copyrightLayer;
 
	//レイヤーを追加
	this.svg.appendChild(this._backgroundLayer);
	this.svg.appendChild(this._partsLayer);
        this.svg.appendChild(this._copyrightLayer);

	//mousedown を無効化して、不要なドラッグを防止
	//this.svg.addEventListener("mousedown", function(e){e.preventDefault();}, false);

       //ドラッグ時にゴミが残ってしまう問題対策
       var self = this;
       window.addEventListener('mousemove', function(){ self._refresh(); }, true);
        
       //イベント処理
       $(this._backgroundLayer).click(function(){ self.deactivateParts(); });
        
 };
 
 //ロード中オブジェクトを追加
 SWT.Wallpaper.prototype._addLoadingObjects = function(url) {
       
       this._loadingObjects.push(url);
   
       //イベント発生
       $(this).trigger("load_start");
       
       var index = this._loadingObjects.length-1;
       return index;

 };
 
 //ロード中オブジェクトを削除
 SWT.Wallpaper.prototype._removeLoadingObjects = function(index) {
       
       //this._loadingObjects.splice(index,1);
       this._loadingObjects[index] = "";
       
       //ロード完了イベント
       $(this).trigger("load_complete");
       
       //ロード完全完了イベント
       if(this._loadingObjects.join("") == "") {
              
           $(this).trigger("load_all_complete");
                         
       }
       
 };
 
 //リフレッシュ
 SWT.Wallpaper.prototype._refresh = function() {
	$(this.svg).hide().show();
 };
 
 //viewBoxを設定
 SWT.Wallpaper.prototype.setViewBox = function(width, height) {
	
	var _width = this._origWidth;
	var _height = Math.floor(_width * (height/width));
	
	this.svg.setAttribute("width", _width);
	this.svg.setAttribute("height", _height);
	this.svg.setAttribute("viewBox", "0 0 "+width+" "+height);
 
	//サイズの調整
        this._adjustmentCopyrightSize();
	this._adjustmentBackgroundSize();
 
 };
 
 //viewBoxを取得
 SWT.Wallpaper.prototype.getViewBox = function() {
 
	return this.svg.viewBox.baseVal;
 
 };
 
 //copyrightを設定
 SWT.Wallpaper.prototype.setCopyright = function(svgElement) {

	//既存の画像をリムーブ
	if(this._copyright) {
		this._copyrightLayer.removeChild(this._copyright.svgElement);
	}
 
	this._copyrightLayer.appendChild(svgElement);
	var copyright = new SVGSprite.Sprite(svgElement);

	this._copyright = copyright;
 
	//サイズの調整
	this._adjustmentCopyrightSize();
 };
 
 //コピーライトのサイズ調整
 SWT.Wallpaper.prototype._adjustmentCopyrightSize = function() {
	
	 if(this._copyright) {
 
		var viewBox = this.getViewBox();
		var width = this._copyright.width;
		var height = this._copyright.height;
                
		this._copyright.x = viewBox.width-(width/2)-10;
		this._copyright.y = viewBox.height-(height/2)-5;
                
		this._refresh();
 
	 }
	 
 };
 
 //コピーライトをロード
 SWT.Wallpaper.prototype.loadCopyright = function(url) {
	
	var self = this;
        
        var index = this._addLoadingObjects(url);     
        
	SVGUtil.loadSVG(url, function(svg){
	      
	      self.setCopyright(svg);
              self._removeLoadingObjects(index);      				
	
	});
 
 };
 
 //背景を設定
 SWT.Wallpaper.prototype.setBackground = function(svgElement) {
	 
	//既存の背景をリムーブ
	if(this._background) {
		this._backgroundLayer.removeChild(this._background.svgElement);
	}
 
	this._backgroundLayer.appendChild(svgElement);
	var background = new SVGSprite.Sprite(svgElement);

	this._background = background;
 
	//サイズの調整
	this._adjustmentBackgroundSize();
 
 };
 
 //背景画像のサイズ調整
 SWT.Wallpaper.prototype._adjustmentBackgroundSize = function() {
	
	 if(this._background) {
 
		var viewBox = this.getViewBox();
		var width = viewBox.width;
		var height = viewBox.height;
	 
		var viewBoxAspect = width/height;
		var bgAspect = this._background.width/this._background.height;
	 
		if(viewBoxAspect < bgAspect) {
			
			width = height*bgAspect; 
 
		} else {
 
			height = bgAspect/width;
 
		}
              
                var deltaWidth = width-viewBox.width;
                var deltaHeight = height-viewBox.height;
                
		this._background.width = width;
		this._background.height = height;
		this._background.x = (viewBox.width/2)-(deltaWidth/2);
		this._background.y = (viewBox.height/2)-(deltaHeight/2);
 
		this._refresh();
 
	 }
	 
 };

 //背景をロード
 SWT.Wallpaper.prototype.loadBackground = function(url) {
	
       var self = this;
 
       var index = this._addLoadingObjects(url);    
 
       SVGUtil.loadSVG(url, function(svg){
       
	      self.setBackground(svg);
              self._removeLoadingObjects(index);       							
	
       });
 
 };
 
 //パーツを追加
 SWT.Wallpaper.prototype.addParts = function(parts) {
	
	if(this.parts.length < this.partsLimit) {
 
		this.parts.push(parts);
		parts.index = this.parts.length-1;
		parts.appendTo(this._partsLayer);
		
		this._refresh();
	 
		//イベント処理
		var self = this;
		$(parts).bind("activated", function(e){ 
					
		     self._activatedPartsHandler(e);

		});
 
	} else {
	    
		$(this).trigger('parts_fulled');
	    
	}
 };
 
 //パーツを削除
 SWT.Wallpaper.prototype.removeParts = function(parts) {
       
       var newPartsList = [];
       
       //リストから削除
       for(var i=0,l=this.parts.length; i<l; i++) {
		
	      if(i!=parts.index) {
		     
		     newPartsList.push(this.parts[i]);
                     this.parts[i].index = newPartsList.length-1;
                     
	      }

       }
       this.parts = newPartsList;
       
       //要素を削除
       parts.svgElement.parentNode.removeChild(parts.svgElement);
       
       //アクティブパーツだった場合
       if(parts === this.activeParts) {
              
              this.activeParts = null;
              $(this).trigger("parts_deactivated");
              
       }
       
       delete parts;
       
 };
 
 //パーツをアクティブに
 SWT.Wallpaper.prototype._activatedPartsHandler = function(e) {
	
	var parts = e.currentTarget;
	this.activeParts = parts;
 
	//他のパーツを非アクティブに
	for(var i=0,l=this.parts.length; i<l; i++) {
		
		if(i!=parts.index) {
			
			this.parts[i].deactive();
 
		}
 
	}
		
       var self = this;       

       $(this).trigger("parts_activated");
       
 };
 
 //全パーツを非アクティブに
 SWT.Wallpaper.prototype.deactivateParts = function(e) {
   
       	for(var i=0,l=this.parts.length; i<l; i++) {
					
	      this.parts[i].deactive();
 
	}
        
        this.activeParts = null;

       $(this).trigger("parts_deactivated");
 };
 
 //パーツをロード
 SWT.Wallpaper.prototype.loadParts = function(param) {
 
	 var self = this;
	 
	 if(typeof param.svgElement != "undefined" && param.svgElement instanceof SVGElement) {
	    
	    var parts = new SWT.Parts(param.svgElement);
	    var viewBox = self.getViewBox();
	    
	    var viewBox = this.getViewBox();
	    parts.x = viewBox.width/2;
	    parts.y = viewBox.height/2;
	    this.addParts(parts);
	    
	 } else {
	    
	    var index = this._addLoadingObjects(param.file);
	    
	    SVGUtil.loadSVG(param.file, function(svg){
		   
		 var parts = new SWT.Parts(svg);
		   
		 var viewBox = self.getViewBox();
		 parts.x = viewBox.width/2;
		 parts.y = viewBox.height/2;
		 
		 self._removeLoadingObjects(index); 
		 
		 self.addParts(parts);
		   
		 
	   
	   });
	    
	}
		
 
 };

 //パーツの階層を１つ上げる
 SWT.Wallpaper.prototype.upPartsIndex = function(parts) {
       
       var currentIndex = parts.index;
       var targetIndex = currentIndex+1;
       
       if(targetIndex < this.parts.length) {
              
              var target = this.parts[targetIndex];
              
              //リストの順位を交換
              this.parts[targetIndex] = parts;
              this.parts[currentIndex] = target;
              
              parts.index = targetIndex;
              target.index = currentIndex;
              
              //要素の位置を交換
              for(var i=0,l=this.parts.length; i<l; i++) {
                     
                     this._partsLayer.removeChild(this.parts[i].svgElement);
                     
              }
              for(var i=0,l=this.parts.length; i<l; i++) {
                     
                     this._partsLayer.appendChild(this.parts[i].svgElement);
                     
              }
              
              
       }
       
       
 };
 
 //パーツの階層を１つ下げる
 SWT.Wallpaper.prototype.downPartsIndex = function(parts) {
       
       var currentIndex = parts.index;
       var targetIndex = currentIndex-1;
       
       if(currentIndex > 0) {
              
              var target = this.parts[targetIndex];
              
              //リストの順位を交換
              this.parts[targetIndex] = parts;
              this.parts[currentIndex] = target;
              
              parts.index = targetIndex;
              target.index = currentIndex;
              
              //要素の位置を交換
              for(var i=0,l=this.parts.length; i<l; i++) {
                     
                     this._partsLayer.removeChild(this.parts[i].svgElement);
                     
              }
              for(var i=0,l=this.parts.length; i<l; i++) {
                     
                     this._partsLayer.appendChild(this.parts[i].svgElement);
                     
              }
              
              
       }
       
       
 };
 
 

 //SVGを出力
 SWT.Wallpaper.prototype.toDataURL = function() {
	
	//クローン
	var tmpSVG = this.svg.cloneNode(true);
 
	//サイズ調整
	var viewBox = this.getViewBox();
	tmpSVG.setAttribute("width", viewBox.width);
	tmpSVG.setAttribute("height", viewBox.height);
	
	//dataURIに変換
	var serialzedSVG = new XMLSerializer().serializeToString(tmpSVG);
	var svgBase64 = ';base64,'+Base64.encode(serialzedSVG);
	var mimeType = "application/octet-stream"; //data:image/svg+xml
	var dataURL = "data:"+mimeType+svgBase64;	
	
	delete tmpSVG;
	return dataURL;
  
 };

}(window));(function(global){

 var SWT = global.SWT;

 /**
  * パーツ
  */
 SWT.Parts = function(svgElement) {
	
       this.constructor(svgElement);
       this.index = null;
       this.scale = 1;
       this.active = false;
       
       this.buttonMode = true;
 
       //BBoxTool
       this.SVGBoundingBox = null;//new SVGBoundingBox(this);
 
       //イベント処理
       var self = this;
       this.addEventListener("mousedown", function(){ self.activate(); }, false);
 
 };
 
 SWT.Parts.prototype = new SVGSprite.Sprite;
 
 SWT.Parts.prototype.setSvgElement = function(svgElement) {

       this._svgElement = svgElement;
     
 };
 
/**
 * 子要素として追加する
 *
 * @param {SVGElement} content 追加先の要素
 *
 */
 SWT.Parts.prototype.appendTo = function(content) {

	content.appendChild(this.svgElement);
	
	if(this.SVGBoundingBox == null) {
            this.SVGBoundingBox = new SVGBoundingBox(this);
	}
	
};

 
 //scale
 SWT._defineSetterGetter(SWT.Parts.prototype, "scale",
       
       //setter
       function(scale) {
                            
              this.scaleX = scale;
              this.scaleY = Math.abs(scale);
              
              this._scale = scale;
              
       },
       
       //getter
       function() {
              
              return this._scale;
              
       }
 );
 
 //active
 SWT.Parts.prototype.activate = function() {
	 
       if(!this.active) {
	
              var self = this;
              this.setStartDrag();
              
              self.addEventListener('mousedown', function(){ 
                     self.setStartDrag(); 
              });
              
	      //BBoxToolを有効に
	      this.SVGBoundingBox.enable();
	      
              $(this).trigger("activated");
       }
       
       this.active = true;
 
 };
 
 //deactive
 SWT.Parts.prototype.deactive = function() {
	
       if(this.active) {
              
	      //BBoxToolwを無効に
	      this.SVGBoundingBox.disable();
	      
              this.active = false;
              $(this).trigger("deactivated");
                     
       }
       
 };
 
 
 //ドラッグを開始する
 SWT.Parts.prototype.setStartDrag = function() {
	
	var self = this;
 
	this.startDrag(false);
	window.addEventListener('mouseup', function(){ 
						 
		self.stopDrag();
						 
	}, false);

 };
 
}(window));(function(global){

 var SWT = global.SWT;

 /**
  * パーツコントロールView
  */
 SWT.PartsControllView = function(wallpaper, parentElement, options) {
       
       this.wallpaper = wallpaper;
       this.parentElement = $(parentElement);
       this.isEnable = false;
       this.init(options);
 
       //イベント処理
       var self = this;
       $(this.wallpaper).bind("parts_activated", function(){ self.enable(); });
       $(this.wallpaper).bind("parts_deactivated", function(){ self.disable(); });
       
 };
 
 //初期化
 SWT.PartsControllView.prototype.init = function(options) {
       
       //要素作成
       var html = '<dl>';
       //html +=	'<dt>Reduce/Enlarge :</dt>';
       //html +=	'<dd><div class="scaleControll"></div></dd>';
       html +=	'<dt>Transparency :</dt>';
       html +=	'<dd><div class="alphaControll"></div></dd>';
       //html +=	'<dt>Rotation :</dt>';
       //html +=	'<dd><div class="rotationControll"></div></dd>';
       html +=	'<dt>Flip :</dt>';
       html +=	'<dd><div class="flipHorizontallyControll"></div><div class="flipVerticallyControll"></div></dd>';
       html +=	'<dt>Ordering/Delete :</dt>';
       html +=	'<dd><div class="upIndexControll"></div><div class="downIndexControll"></div><div title="remove element" class="removeControll"></div></dd>';
       html +=	'</dl>';
       html +=  '<div class="removeDialog"><p>Do you want to delete this element?</p></div>';
       
       this.parentElement.html(html);
       
       //コントローラー初期化
       //this.scaleControll = this._createSlider("scaleControll",options.scale);
       this.alphaControll = this._createSlider("alphaControll",options.alpha);
       //this.rotationControll = this._createSlider("rotationControll",options.rotation);
       this.flipHorizontallyControll = this.parentElement.find(".flipHorizontallyControll").button({
            icons: {
                primary: "ui-icon-triangle-2-n-s"
            },
            text: false,
            disabled: true
       });       
       this.flipVerticallyControll = this.parentElement.find(".flipVerticallyControll").button({
            icons: {
                primary: "ui-icon-triangle-2-e-w"
            },
            text: false,
            disabled: true
       });       
       this.upIndexControll = this.parentElement.find(".upIndexControll").button({
            icons: {
                primary: "ui-icon-circle-triangle-n"
            },
            text: false,
            disabled: true
       });
       this.downIndexControll = this.parentElement.find(".downIndexControll").button({
            icons: {
                primary: "ui-icon-circle-triangle-s"
            },
            text: false,
            disabled: true
       });
       this.removeControll = this.parentElement.find(".removeControll").button({
            icons: {
                primary: "ui-icon-circle-close"
            },
            text: false,
            disabled: true
       });
       
       //ダイアログ初期化
       this.removeDialog = this.parentElement.find(".removeDialog").dialog({
              autoOpen: false,
              modal: true,
              width: 400
       });
       
       this.disable();

 };
 
 //スライダー作成
 SWT.PartsControllView.prototype._createSlider = function(className,option) {
       
       var min = (typeof option.min == "number")? option.min : 0;
       var max = (typeof option.max == "number")? option.max : 100;
       var step = (typeof option.step == "number")? option.step : 1;
       
       var slider = this.parentElement.find("."+className).slider({
              range: "min",
              min: min,
              max: max,
              step: step,
              disabled: true
       });
              
       return slider;

 };

 //有効
 SWT.PartsControllView.prototype.enable = function() {
       
       if(this.wallpaper.activeParts != null) {
              
              var parts = this.wallpaper.activeParts;
              
              //this.scaleControll.slider("enable").slider( "value" , parts.scale);
              this.alphaControll.slider("enable").slider( "value" , parts.alpha);
              //this.rotationControll.slider("enable").slider( "value" , parts.rotation);
	      this.flipHorizontallyControll.button("enable");
	      this.flipVerticallyControll.button("enable");
              this.upIndexControll.button("enable");
              this.downIndexControll.button("enable");
              this.removeControll.button("enable");
              this.parentElement.css({opacity: 1});
              
              this.isEnable = true;
       }
 };
 
 //無効
 SWT.PartsControllView.prototype.disable = function() {
       
       //this.scaleControll.slider("disable");
       this.alphaControll.slider("disable");
       //this.rotationControll.slider("disable");
       this.flipHorizontallyControll.button("disable");
       this.flipVerticallyControll.button("disable");
       this.upIndexControll.button("disable");
       this.downIndexControll.button("disable");
       this.removeControll.button("disable");
       this.parentElement.css({opacity: .3});
       
       this.isEnable = false;
 };
 
}(window));(function(global){

 var SWT = global.SWT;

 /**
  * パーツコントロールController
  */
 SWT.PartsControllController = function(wallpaper, partsControllView) {
       
       this.wallpaper = wallpaper;
       this.partsControllView = partsControllView;
       
       //初期化
       this.init();
       
 };
 
 SWT.PartsControllController.prototype.init = function() {
       
       var partsControllView = this.partsControllView;
       var self = this;
       
       //イベント処理
       /*partsControllView.scaleControll.bind( "slide", function(event, ui) {
              self.wallpaper.activeParts.scale = ui.value;
       });*/
       partsControllView.alphaControll.bind( "slide", function(event, ui) {
              self.wallpaper.activeParts.alpha = ui.value;
       });
       /*partsControllView.rotationControll.bind( "slide", function(event, ui) {
              self.wallpaper.activeParts.rotation = ui.value;
       });*/
       partsControllView.flipVerticallyControll.bind("click", function(){
	    if(partsControllView.isEnable) {
		self.wallpaper.activeParts.scaleX *= -1;
		self.wallpaper._refresh();
	    }
       });
       partsControllView.flipHorizontallyControll.bind("click", function(){
	    if(partsControllView.isEnable) {
		self.wallpaper.activeParts.scaleY *= -1;
		self.wallpaper._refresh();
	    }
       });      
       partsControllView.upIndexControll.bind("click", function(){
              if(partsControllView.isEnable) {
                     self.wallpaper.upPartsIndex(self.wallpaper.activeParts);
              }
       });
       partsControllView.downIndexControll.bind("click", function() {
              if(partsControllView.isEnable) {
                     self.wallpaper.downPartsIndex(self.wallpaper.activeParts);
              }
       });
       partsControllView.removeControll.bind("click", function() {
              if(partsControllView.isEnable) {
                     partsControllView.removeDialog.dialog("option", "buttons",{
                            "Ok": function() {
                                 self.wallpaper.removeParts(self.wallpaper.activeParts);
                                 $(this).dialog("close");
                            },
                            "Cancel": function() {
                                  $(this).dialog("close");     
                            }
                     }).dialog("open");
              }
       });
       
 };
 
}(window));(function(global){

 var SWT = global.SWT;

 /**
  * パーツリストView
  */
 SWT.PartsListView = function(partsList) {
	
	this.partsListElement = $(partsList);
	this.list = this.partsListElement.find("> li a");

	this.init();
	
	//イベント処理
	var self = this;
	this.list.click(function(){ self.select(this); return false; });
 
 };
 
 SWT.PartsListView.prototype.init = function() {

    this.appendSVGDropBox();

 };
 
 SWT.PartsListView.prototype.appendSVGDropBox = function() {

    var svgDropBox = new SVGDropBox({width:70, height:70});
    var list = document.createElement("li");
    list.appendChild(svgDropBox.element);
    this.partsListElement.append(list);
    
    //イベント処理
    var self = this;
    $(list).click(function(){ self.select(svgDropBox,true); });
    svgDropBox.element.addEventListener("drop",function(e){
	
	e.stopPropagation();
        e.preventDefault();
	
	if(svgDropBox.validFile) {
	    self.appendSVGDropBox();   
	}
	
    }, false);
    
 };
 
 SWT.PartsListView.prototype.select = function(selectedList,isSVGDropBox) {
	
	this.selectedListIsSVGDropBox = (typeof isSVGDropBox == "boolean")? isSVGDropBox : false;
	this.selected = selectedList;
	$(this).trigger("selected");
 
 };
 
}(window));(function(global){

 var SWT = global.SWT;
 
 /**
  * パーツリストController
  */
 SWT.PartsListController = function(wallpaper,partsListView) {
	
        this.wallpaper = wallpaper;
	this.partsListView = partsListView;
        
	 //イベント処理
	 var self = this;
	$(this.partsListView).bind("selected", function(){ self.selectedHandler(); });

 };
 
 SWT.PartsListController.prototype.selectedHandler = function() {
	
	if(this.partsListView.selectedListIsSVGDropBox) {
	    
	    var svgDropBox = this.partsListView.selected;
	    
	    if(typeof svgDropBox.fileType != "undefined") {
		
		var svgElement;
		
		if(svgDropBox.fileType == "svg") {
		
		    svgElement = document.importNode(svgDropBox.content, true);
		
		} else if(svgDropBox.fileType == "image") {
		    
		    var width = svgDropBox.contentElement.naturalWidth;
		    var height = svgDropBox.contentElement.naturalHeight;
		    
		    svgString  = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
		    svgString += '<image xlink:href="'+svgDropBox.content+'" width="'+width+'" height="'+height+'" />';
		    svgString += '</svg>';
		    
		    var parser = new DOMParser();  
		    var svgDoc = parser.parseFromString(svgString, "text/xml");
		    
		    var svgElement = document.importNode(svgDoc.getElementsByTagName("svg")[0], true);
		    
		}
		
		this.wallpaper.loadParts({svgElement: svgElement});
		
	    }
	    
	} else {
	    var url = $(this.partsListView.selected).attr("href");
	    this.wallpaper.loadParts({file: url});
	}
 }; 
 
}(window));(function(global){

 var SWT = global.SWT;

 /**
  * 背景リストコントローラー
  */
 SWT.BackgroundListController = function(wallpaper, element) {
	
	this.wallpaper = wallpaper;
	this.list = $(element).find("> li a");
 
 
	//イベント処理
	var self = this;
	this.list.click(function(){ self.select(this); return false; });

 };
 
 //選択時の動作
 SWT.BackgroundListController.prototype.select = function(element) {
 
	var url = $(element).attr("href");
 
	//読み込み
	this.wallpaper.loadBackground(url);
 
 };
 
}(window));(function(global){

 var SWT = global.SWT;

 /**
  * ダウンロードボタンController
  */
 SWT.DownloadButtonController = function(wallpaper, buttunElement) {
	
	this.wallpaper = wallpaper;
	this.buttonElement = $(buttunElement);
		
	//イベント処理
	var self = this;
	this.buttonElement.mouseover(function(){ this.href = self.wallpaper.toDataURL(); });
 
 };
 
}(window));(function(global){

 var SWT = global.SWT;
 
 /**
  * インジケーターView
  */
 SWT.IndicatorView = function(wallpaper, indicatorElement) {
       
       this.wallpaper = wallpaper;
       this.element = $(indicatorElement);
 
       //イベント
       var self = this;
       $(this.wallpaper).bind("load_start",function(){ self.onLoadingStarted(); });
       $(this.wallpaper).bind("load_all_complete", function(){ self.onLoadingAllCompleted(); });
       $(this.wallpaper).bind("parts_fulled", function(){ self.onPartsFulled() });

 };
 
 //ローディング開始
 SWT.IndicatorView.prototype.onLoadingStarted = function() {
       
       this.element.html('<span class="SWT_loading">Loading...</span>');
       
 };
 
 //ローディング完全完了
 SWT.IndicatorView.prototype.onLoadingAllCompleted = function() {
       
       this.element.html('');
       
 };
 
 //パーツが追加できる上限いっぱいになった場合の処理
 SWT.IndicatorView.prototype.onPartsFulled = function() {
    
    this.element.html('Can not add any more parts!');
        
 };
 
}(window));(function(global){

 var SWT = global.SWT;

 /**
  * キャンバスサイズセレクターView
  */
 SWT.WallpaperSizeSelectorView = function(selectElement) {
	
	this.selectElement = $(selectElement);
	 
	//event
	var self = this;
	this.selectElement.bind("change", function(){
		$(self).trigger("change"); 
	});
 
 };
 
 SWT.WallpaperSizeSelectorView.prototype.getWidth = function() {
 
	var value = this.selectElement.val().split("x");
	return value[0];
 
 };

 SWT.WallpaperSizeSelectorView.prototype.getHeight = function() {
 
	var value = this.selectElement.val().split("x");
	return value[1];
 
 };
 
}(window));(function(global){

 var SWT = global.SWT;

 /**
  * キャンバスサイズセレクターController
  */
 SWT.WallpaperSizeSelectorController = function(sizeSelectorView, wallpaper) {
 
	this.sizeSelectorView = sizeSelectorView;
	this.wallpaper = wallpaper;
	
	this.changeHandler(null);

	//event
	var self = this;
	$(this.sizeSelectorView).bind("change", function(e){ self.changeHandler(e) });
 
 };
 
 SWT.WallpaperSizeSelectorController.prototype.changeHandler = function(e) {

	var width = this.sizeSelectorView.getWidth();
	var height = this.sizeSelectorView.getHeight();
 
	this.wallpaper.setViewBox(width, height);
 
 }; 

}(window));