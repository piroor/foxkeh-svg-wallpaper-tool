(function(global){

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
	var copyright = new SVGSprite.display.Sprite(svgElement);

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
	var background = new SVGSprite.display.Sprite(svgElement);

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

}(window));
