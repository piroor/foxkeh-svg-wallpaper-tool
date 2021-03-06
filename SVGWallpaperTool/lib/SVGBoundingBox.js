(function(){
    
    var SVGBoundingBox = function(svgSprite,options) {
         
        options = (typeof options == "undefined")? {} : options;
        
        //svgSprite
        this.svgSprite = svgSprite;
        
	this.isSafari = (navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf("Chrome") == -1);
	
        //オプション
        this.options = {
            scale: (typeof options.scale == "boolean")? options.scale : true,
            rotation: (typeof options.rotation == "boolean")? options.rotation : true
        }
        
        
        this.center = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this.svgSprite.svgElement.ownerSVGElement.appendChild(this.center);
        this.svgSprite.svgElement.ownerSVGElement.appendChild(this.point);
        
        
        //初期化
        this.init();
    
    };
    
    /**
     * 初期化する
     */
    SVGBoundingBox.prototype.init = function(){

        this.origMouseX = this.origMouseY = this._rotateInitRotate = null;      
        this.origWidth = this.svgSprite.width;
        this.origHeight = this.svgSprite.height;
        
        //枠を作る
        var _bbox = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        _bbox.setAttribute("width", this.origWidth);
        _bbox.setAttribute("height", this.origHeight);
        this._bbox = _bbox;
        
        //拡大縮小ボックス
        var _scaleBox = document.createElementNS("http://www.w3.org/2000/svg", "g");
	/*var _scaleBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "use");
        _scaleBoxSVG.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href","svg/scale.svg#scale");
        _scaleBoxSVG.setAttribute("transform", "scale("+1/this.svgSprite._viewPortScaleX+")");
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
	_scaleSVG.setAttribute("transform", "scale("+1/this.svgSprite._viewPortScaleX+")");
	_scaleBox.appendChild(_scaleSVG);
        this._scaleBox = _scaleBox;
        
        //回転ボックス
        var _rotateBox = document.createElementNS("http://www.w3.org/2000/svg", "g");
        //var _rotateBoxSVG = document.createElementNS("http://www.w3.org/2000/svg", "use");
        //_rotateBoxSVG.setAttribute("transform", "scale("+1/this.svgSprite._viewPortScaleX+")");
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
	_rotateSVG.setAttribute("transform", "scale("+1/this.svgSprite._viewPortScaleX+")");
	_rotateBox.appendChild(_rotateSVG);
	this._rotateBox = _rotateBox;
        
        this._setBoxes();
        
        var self = this;
        $(this._scaleBox).mousedown( function(e){ self._startScale(); });
        $(this._rotateBox).mousedown( function(e){ self._startRotate(); });
        	
	//this.svgSprite.svgElement.ownerSVGElement.addEventListener("mousemove", function(e){
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
        
        var strokeWidth = (20/Math.abs(this.svgSprite.scaleX))/this.svgSprite._viewPortScaleX;
        var boxWidth = (20/this.svgSprite.scaleX);
        
        //枠
        var _bbox = this._bbox;
        _bbox.setAttribute("x", this.svgSprite._svgTransformUtil.origOffset.x);
        _bbox.setAttribute("y", this.svgSprite._svgTransformUtil.origOffset.y);
        _bbox.setAttribute("style", "opacity:0.6; fill:#fff; stroke:#fff; stroke-width:"+strokeWidth+"; stroke-linejoin:round;");
        
        //拡大縮小
        var _scaleBox = this._scaleBox;
        //_scaleBox.setAttribute("x", (this.svgSprite._svgTransformUtil.origOffset.x+this.origWidth-(boxWidth/3))*this.svgSprite.scaleX);
        //_scaleBox.setAttribute("y", (this.svgSprite._svgTransformUtil.origOffset.y+this.origHeight-(boxWidth/3))*this.svgSprite.scaleX);
        var _scaleX = (this.svgSprite._svgTransformUtil.origOffset.x+this.origWidth-(boxWidth*.5))*this.svgSprite.scaleX;
        var _scaleY = (this.svgSprite._svgTransformUtil.origOffset.y+this.origHeight-(boxWidth*.5))*this.svgSprite.scaleX;
        _scaleBox.setAttribute("transform", "scale("+1/this.svgSprite.scaleX+") translate("+_scaleX+", "+_scaleY+")");
        //_scaleBox.setAttribute("width", boxWidth);
        //_scaleBox.setAttribute("height", boxWidth);
        //_scaleBox.setAttribute("style", "opacity:1; fill:#fff; stroke:#000; stroke-width:"+(.5/this.svgSprite.scaleX)+"; stroke-linejoin:round;cursor:se-resize");
        _scaleBox.setAttribute("style", "cursor:se-resize");
        
        
        //回転
        var _rotateBox = this._rotateBox;
        //_rotateBox.setAttribute("x", ((this.svgSprite._svgTransformUtil.origOffset.x-(boxWidth*.6))*(this.svgSprite.scaleX)));
        //_rotateBox.setAttribute("y", ((this.svgSprite._svgTransformUtil.origOffset.y-(boxWidth*.6))*(this.svgSprite.scaleX)));
        var _rotateX = (this.svgSprite._svgTransformUtil.origOffset.x-(boxWidth*.8))*(this.svgSprite.scaleX);
        var _rotateY = (this.svgSprite._svgTransformUtil.origOffset.y-(boxWidth*.8))*(this.svgSprite.scaleX);
        _rotateBox.setAttribute("transform", "scale("+1/this.svgSprite.scaleX+") translate("+_rotateX+", "+_rotateY+")");
        //_rotateBox.setAttribute("width", boxWidth);
        //_rotateBox.setAttribute("height", boxWidth);
        //_rotateBox.setAttribute("style", "opacity:1; fill:#eee; stroke:#000; stroke-width:"+(.5/this.svgSprite.scaleX)+"; stroke-linejoin:round;cursor:pointer");
        _rotateBox.setAttribute("style", "cursor:pointer");

    };

    /**
     * 有効化
     */
    SVGBoundingBox.prototype.enable = function(){
        
        //枠を挿入
        this.svgSprite._svgTransformUtil.transformWrapper.appendChild(this._bbox);
        this.svgSprite._svgTransformUtil.transformWrapper.appendChild(this.svgSprite._oapcityElement);
        
        //拡大縮小ボックスを挿入
        this.svgSprite._svgTransformUtil.transformWrapper.appendChild(this._scaleBox);
        
        //回転ボックスを挿入
        this.svgSprite._svgTransformUtil.transformWrapper.appendChild(this._rotateBox);
        
    };
    
    /**
     * 無効化
     */
    SVGBoundingBox.prototype.disable = function(){

        //枠を削除
        this.svgSprite._svgTransformUtil.transformWrapper.removeChild(this._bbox);
        
        //拡大縮小ボックスを削除
        this.svgSprite._svgTransformUtil.transformWrapper.removeChild(this._scaleBox);
        
        //回転ボックスを削除
        this.svgSprite._svgTransformUtil.transformWrapper.removeChild(this._rotateBox);
        
    };
    
    /**
     * 拡大縮小開始
     */
    SVGBoundingBox.prototype._startScale = function(){

        this._scaling = true;
        this._scaleOrigWidth = this.svgSprite.width;
        this._scaleOrigHeight = this.svgSprite.height;
        
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
            var x = ((event.clientX-this.origMouseX)/this.svgSprite._viewPortScaleX);
            var y = ((event.clientY-this.origMouseY)/this.svgSprite._viewPortScaleY);
            var _scale = Math.sqrt(x*x+y*y); //√(c-a)^2+(d-b)^2
            _scale = (x<0||y<0)? -_scale : _scale;
            
            this.svgSprite.width = this._scaleOrigWidth+_scale;
	    this.svgSprite.scaleY = this.svgSprite.scaleX;
            this.svgSprite.height = this._scaleOrigHeight+_scale;
	    */
	    
	    if(this.origMouseX == null) {
		
		this.origScreenCTM = this.svgSprite._svgTransformUtil.transformWrapper.getScreenCTM();
	    
	    }
	    
	    var x = (this.isSafari)? event.pageX : event.pageX-$(window).scrollLeft();
	    var y = (this.isSafari)? event.pageY : event.pageY-$(window).scrollTop();
	    
	    var ctm = this.origScreenCTM;
			
	    var p = this.svgSprite.svgElement.ownerSVGElement.createSVGPoint();
	    p.x = x;
	    p.y = y;
	    p = p.matrixTransform(ctm.inverse());
	    
            if(this.origMouseX == null) {
            
                this.origMouseX = p.x;
		this.origScaleX = this.svgSprite.scaleX;
		this.origFlipped = ((this.svgSprite.scaleY<0 && this.origScaleX>0) || (this.svgSprite.scaleY>0 && this.origScaleX<0));
		
            }
	    
	    //var cp = this.svgSprite.svgElement.ownerSVGElement.createSVGPoint();
	    //cp.x = this.svgSprite.width/2;//this.svgSprite.x;
	    //cp.y = this.svgSprite.height/2;//this.svgSprite.y;
	    //cp = cp.matrixTransform(this.svgSprite._svgTransformUtil.transformWrapper.getCTM().inverse());
	    
	    /*this.point.setAttribute("cx", p.x);
            this.point.setAttribute("cy", p.y);
	    this.center.setAttribute("cx", cp.x);
            this.center.setAttribute("cy", cp.y);
	    */
	    
	    var ratio = (p.x-(this.origMouseX/2))/(this.origMouseX/2); //中心点を基準とした初期座標とマウス座標の差分
	    var scale = this.origScaleX*ratio;
	    	    
	    this.svgSprite.scaleX = scale;
	    this.svgSprite.scaleY = (this.origFlipped)? -scale : scale;
	    
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
        this._rotateOrigRotation = this.svgSprite.rotation;
        this._rotateOrigX = this.svgSprite.x;
        this._rotateOrigY = this.svgSprite.y;
        
    };
    
    /**
     * 回転中
     */
    SVGBoundingBox.prototype._doRotate = function(event) {
                
        if(this._rotation) {
            
            var clientX = event.layerX/this.svgSprite._viewPortScaleX;
            var clientY = event.layerY/this.svgSprite._viewPortScaleX;
            
            if(this._rotateInitRotate == null) {
                
                var _x = (clientX*this.svgSprite._viewPortScaleX)-this._rotateOrigX;
                var _y = (clientY*this.svgSprite._viewPortScaleY)-this._rotateOrigY;
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
            
            this.svgSprite.rotation = this._rotateOrigRotation+rotation;
            
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
    
    
}());
