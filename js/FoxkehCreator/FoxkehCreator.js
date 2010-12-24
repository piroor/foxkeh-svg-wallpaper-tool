/*!
 * Copyright 2010, Mozilla Japan.
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * https://bitbucket.org/foxkeh/wallpaper/src/tip/MIT-LICENSE.txt
 * https://bitbucket.org/foxkeh/wallpaper/src/tip/GPL-LICENSE.txt
 */
(function(global){
 /**
  * クロスブラウザ用ゲッターセッター関数
  * @param {Object} obj ゲッターセッターを設定したいオブジェクト
  * @param {String} name ゲッターセッタープロパティ名
  * @param {Function} setter セッター関数
  * @param {Function} getter ゲッター関数
 */
 function defineSetterGetter(obj, name, setter, getter) {

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

 var FoxkehCreator = {};

 /**
  * 初期化
  */
 FoxkehCreator.FoxkehCreator = function(param) {
       
       /**
       param = {
       
              //初期バックグランド
              background: "parts/svg/bg/bg_2010_10.svg", 
              
              //初期パーツリスト
              parts: [{
                      file: "parts/svg/foxkeh/foxkeh_2010_10.svg",
                      right: 100,
                      bottom: 100,
                      alpha: 1,
                      scaleX: 1,
                      scaleY: 1,
                      rotation: 0
                   }],
       
              //壁紙表示用SVG要素ID名
              wallpaperSVG: "wallpaper",
              
              //壁紙サイズ選択要素ID名
              sizeSelector: "sizeSelect",
              
              //背景一覧ID名
              backgroundList: "backgroundList",
       
              //パーツ一覧ID名
              partsList : "partsList",
              
              //ダウンロードボタンID名
              downLoadButton: "downloadButton",
              
              //パーツコントローラーID名
              partsControll: "partsControll"
       
       };
       */
       
       if(!param) {
	      return;
       }
 
       /**
        * 基本オブジェクト [Model]
        */
 
	//壁紙
       if(param.wallpaperSVG) {
	      this.wallpaper = new FoxkehCreator.Wallpaper($("#"+param.wallpaperSVG)[0]);
       } else {
	      return;
       }
       
 
       /**
        * UI [View, Controller]
        */
 
 	//壁紙サイズ設定
	if(param.sizeSelector) {
	      var select = $("#"+param.sizeSelector);
	      this.sizeSelectorView = new FoxkehCreator.WallpaperSizeSelectorView(select);
	      this.sizeSelectorController = new FoxkehCreator.WallpaperSizeSelectorController(this.sizeSelectorView, this.wallpaper);
	}
 
	//背景画像リストコントローラー
	if(param.backgroundList) {
		var list = $("#"+param.backgroundList);
		this.backgroundListController = new FoxkehCreator.BackgroundListController(this.wallpaper, list);
	}
 
	//パーツリスト
	if(param.partsList) {
		
		var partsList = $("#"+param.partsList);
		this.partsListView = new FoxkehCreator.PartsListView(partsList);
		this.partsListController = new FoxkehCreator.PartsListController(this.wallpaper, this.partsListView);
  
	}
 
	//ダウンロードボタン
	if(param.downLoadButton) {
		var button = $("#"+param.downLoadButton);
		this.downloadButtonController = new FoxkehCreator.DownloadButtonController(this.wallpaper, button);
	}
 
       //パーツコントローラー
       if(param.partsControll) {
              var partsControll = $("#"+param.partsControll);
              var options = {
                     scale: param.scaleOptions,
                     alpha: param.alphaOptions,
                     rotation: param.rotationOptions
              };
              this.partsControllView = new FoxkehCreator.PartsControllView(this.wallpaper, partsControll, options);
              this.partsControllController = new FoxkehCreator.PartsControllController(this.wallpaper, this.partsControllView);
       }
       
       //インジケーター
       if(param.indicator) {
              var indicator = $("#"+param.indicator);
              this.indicatorView = new FoxkehCreator.IndicatorView(this.wallpaper, indicator);
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
		     this.wallpaper.loadParts(param.parts[i]);
	      }
       }
 
 };
 
 /**
  * 壁紙
  */
 FoxkehCreator.Wallpaper = function(svg, partsLimit) {
	
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
 FoxkehCreator.Wallpaper.prototype.init = function() {
 
	//レイヤーを作成
	var backgroundLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
	backgroundLayer.setAttribute("class", "foxkehWallpaperBackground");
	
	var partsLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
	partsLayer.setAttribute("class", "foxkehWallpaperParts");
	
        var copyrightLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
	copyrightLayer.setAttribute("class", "foxkehWallpaperCopyright");
        
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
 FoxkehCreator.Wallpaper.prototype._addLoadingObjects = function(url) {
       
       this._loadingObjects.push(url);
   
       //イベント発生
       $(this).trigger("load_start");
       
       var index = this._loadingObjects.length-1;
       return index;

 };
 
 //ロード中オブジェクトを削除
 FoxkehCreator.Wallpaper.prototype._removeLoadingObjects = function(index) {
       
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
 FoxkehCreator.Wallpaper.prototype._refresh = function() {
	$(this.svg).hide().show();
 };
 
 //viewBoxを設定
 FoxkehCreator.Wallpaper.prototype.setViewBox = function(width, height) {
	
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
 FoxkehCreator.Wallpaper.prototype.getViewBox = function() {
 
	return this.svg.viewBox.baseVal;
 
 };
 
 //copyrightを設定
 FoxkehCreator.Wallpaper.prototype.setCopyright = function(svgElement) {

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
 FoxkehCreator.Wallpaper.prototype._adjustmentCopyrightSize = function() {
	
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
 FoxkehCreator.Wallpaper.prototype.loadCopyright = function(url) {
	
	var self = this;
        
        var index = this._addLoadingObjects(url);     
        
	SVGUtil.loadSVG(url, function(svg){
	      
	      self.setCopyright(svg);
              self._removeLoadingObjects(index);      				
	
	});
 
 };
 
 //背景を設定
 FoxkehCreator.Wallpaper.prototype.setBackground = function(svgElement) {
	 
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
 FoxkehCreator.Wallpaper.prototype._adjustmentBackgroundSize = function() {
	
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
 FoxkehCreator.Wallpaper.prototype.loadBackground = function(url) {
	
       var self = this;
 
       var index = this._addLoadingObjects(url);    
 
       SVGUtil.loadSVG(url, function(svg){
       
	      self.setBackground(svg);
              self._removeLoadingObjects(index);       							
	
       });
 
 };
 
 //パーツを追加
 FoxkehCreator.Wallpaper.prototype.addParts = function(parts) {
	
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
 
	}
 };
 
 //パーツを削除
 FoxkehCreator.Wallpaper.prototype.removeParts = function(parts) {
       
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
 FoxkehCreator.Wallpaper.prototype._activatedPartsHandler = function(e) {
	
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
 FoxkehCreator.Wallpaper.prototype.deactivateParts = function(e) {
   
       	for(var i=0,l=this.parts.length; i<l; i++) {
					
	      this.parts[i].deactive();
 
	}
        
        this.activeParts = null;

       $(this).trigger("parts_deactivated");
 };
 
 //パーツをロード
 FoxkehCreator.Wallpaper.prototype.loadParts = function(param) {
		
	/*{
		 file: "parts/svg/foxkeh/foxkeh/foxkeh_2010_10.svg",
		 right: 100,
		 bottom: 100,
		 alpha: 1,
		 scaleX: 1,
		 scaleY: 1,
		 rotation: 0
	}*/
 
	 var self = this;
	 
         var index = this._addLoadingObjects(param.file);
         
	 SVGUtil.loadSVG(param.file, function(svg){
                
	      var parts = new FoxkehCreator.Parts(svg);
		
	      var viewBox = self.getViewBox();
	      parts.x = viewBox.width/2;
	      parts.y = viewBox.height/2;
	      self.addParts(parts);
                
              self._removeLoadingObjects(index); 
	
	});
		
 
 };

 //パーツの階層を１つ上げる
 FoxkehCreator.Wallpaper.prototype.upPartsIndex = function(parts) {
       
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
 FoxkehCreator.Wallpaper.prototype.downPartsIndex = function(parts) {
       
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
 FoxkehCreator.Wallpaper.prototype.toDataURL = function() {
	
	//クローン
	var tmpSVG = this.svg.cloneNode(true);
 
	//サイズ調整
	var viewBox = this.getViewBox();
	tmpSVG.setAttribute("width", viewBox.width);
	tmpSVG.setAttribute("height", viewBox.height);
	
	//dataURIに変換
	var serialzedSVG = new XMLSerializer().serializeToString(tmpSVG);
	var svgBase64 = ';base64'+Base64.encode(serialzedSVG);
	var mimeType = "application/octet-stream"; //data:image/svg+xml
	var dataURL = "data:"+mimeType+","+svgBase64;	
	
	delete tmpSVG;
	return dataURL;
  
 };
 
 
 /**
  * パーツ
  */
 FoxkehCreator.Parts = function(svgElement) {
	
       this.constructor(svgElement);
       this.index = null;
       this.scale = 1;
       this.active = false;
       
       this.buttonMode = true;
 
       //BBoxTool
       this.SVGBBoxTool = null;//new SVGBBoxTool(this);
 
       //イベント処理
       var self = this;
       this.addEventListener("mousedown", function(){ self.activate(); }, false);
 
 };
 
 FoxkehCreator.Parts.prototype = new SVGSprite.Sprite;
 
 FoxkehCreator.Parts.prototype.setSvgElement = function(svgElement) {

       this._svgElement = svgElement;
     
 };
 
/**
 * 子要素として追加する
 *
 * @param {SVGElement} content 追加先の要素
 *
 */
 FoxkehCreator.Parts.prototype.appendTo = function(content) {

	content.appendChild(this.svgElement);
	
	if(this.SVGBBoxTool == null) {
            this.SVGBBoxTool = new SVGBBoxTool(this);
	}
	
};

 
 //scale
 defineSetterGetter(FoxkehCreator.Parts.prototype, "scale",
       
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
 FoxkehCreator.Parts.prototype.activate = function() {
	 
       if(!this.active) {
	
              var self = this;
              this.setStartDrag();
              
              self.addEventListener('mousedown', function(){ 
                     self.setStartDrag(); 
              });
              
	      //BBoxToolを有効に
	      this.SVGBBoxTool.enable();
	      
              $(this).trigger("activated");
       }
       
       this.active = true;
 
 };
 
 //deactive
 FoxkehCreator.Parts.prototype.deactive = function() {
	
       if(this.active) {
              
	      //BBoxToolwを無効に
	      this.SVGBBoxTool.disable();
	      
              this.active = false;
              $(this).trigger("deactivated");
                     
       }
       
 };
 
 
 //ドラッグを開始する
 FoxkehCreator.Parts.prototype.setStartDrag = function() {
	
	var self = this;
 
	this.startDrag(false);
	window.addEventListener('mouseup', function(){ 
						 
		self.stopDrag();
						 
	}, false);

 };
 
 /**
  * キャンバスサイズセレクターView
  */
 FoxkehCreator.WallpaperSizeSelectorView = function(selectElement) {
	
	this.selectElement = $(selectElement);
	 
	//event
	var self = this;
	this.selectElement.bind("change", function(){
		$(self).trigger("change"); 
	});
 
 };
 
 FoxkehCreator.WallpaperSizeSelectorView.prototype.getWidth = function() {
 
	var value = this.selectElement.val().split("x");
	return value[0];
 
 };

 FoxkehCreator.WallpaperSizeSelectorView.prototype.getHeight = function() {
 
	var value = this.selectElement.val().split("x");
	return value[1];
 
 };
 
 /**
  * キャンバスサイズセレクターController
  */
 FoxkehCreator.WallpaperSizeSelectorController = function(sizeSelectorView, wallpaper) {
 
	this.sizeSelectorView = sizeSelectorView;
	this.wallpaper = wallpaper;
	
	this.changeHandler(null);

	//event
	var self = this;
	$(this.sizeSelectorView).bind("change", function(e){ self.changeHandler(e) });
 
 };
 
 FoxkehCreator.WallpaperSizeSelectorController.prototype.changeHandler = function(e) {

	var width = this.sizeSelectorView.getWidth();
	var height = this.sizeSelectorView.getHeight();
 
	this.wallpaper.setViewBox(width, height);
 
 };
 
 /**
  * パーツコントロールView
  */
 FoxkehCreator.PartsControllView = function(wallpaper, parentElement, options) {
       
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
 FoxkehCreator.PartsControllView.prototype.init = function(options) {
       
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
 FoxkehCreator.PartsControllView.prototype._createSlider = function(className,option) {
       
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
 FoxkehCreator.PartsControllView.prototype.enable = function() {
       
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
 FoxkehCreator.PartsControllView.prototype.disable = function() {
       
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
 
 /**
  * パーツコントロールController
  */
 FoxkehCreator.PartsControllController = function(wallpaper, partsControllView) {
       
       this.wallpaper = wallpaper;
       this.partsControllView = partsControllView;
       
       //初期化
       this.init();
       
 };
 
 FoxkehCreator.PartsControllController.prototype.init = function() {
       
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
 
 /**
  * パーツリストView
  */
 FoxkehCreator.PartsListView = function(partsList) {
	
	this.list = $(partsList).find("> li a");
	
	//イベント処理
	var self = this;
	this.list.click(function(){ self.select(this); return false; });
 
 };
 
 FoxkehCreator.PartsListView.prototype.select = function(selectedList) {
	
	this.selected = selectedList;
	$(this).trigger("selected");
 
 };
 
 /**
  * パーツリストController
  */
 FoxkehCreator.PartsListController = function(wallpaper,partsListView) {
	
        this.wallpaper = wallpaper;
	this.partsListView = partsListView;
        
	 //イベント処理
	 var self = this;
	$(this.partsListView).bind("selected", function(){ self.selectedHandler(); });

 };
 
 FoxkehCreator.PartsListController.prototype.selectedHandler = function() {
	
	var url = $(this.partsListView.selected).attr("href");
	this.wallpaper.loadParts({file: url});
 
 };
 
 /**
  * 背景リストコントローラー
  */
 FoxkehCreator.BackgroundListController = function(wallpaper, element) {
	
	this.wallpaper = wallpaper;
	this.list = $(element).find("> li a");
 
 
	//イベント処理
	var self = this;
	this.list.click(function(){ self.select(this); return false; });

 };
 
 //選択時の動作
 FoxkehCreator.BackgroundListController.prototype.select = function(element) {
 
	var url = $(element).attr("href");
 
	//読み込み
	this.wallpaper.loadBackground(url);
 
 };
 
 
 /**
  * ダウンロードボタンController
  */
 FoxkehCreator.DownloadButtonController = function(wallpaper, buttunElement) {
	
	this.wallpaper = wallpaper;
	this.buttonElement = $(buttunElement);
		
	//イベント処理
	var self = this;
	this.buttonElement.mouseover(function(){ this.href = self.wallpaper.toDataURL(); });
 
 };
 
 /**
  * インジケーターView
  */
 FoxkehCreator.IndicatorView = function(wallpaper, indicatorElement) {
       
       this.wallpaper = wallpaper;
       this.element = $(indicatorElement);
 
       //イベント
       var self = this;
       $(this.wallpaper).bind("load_start",function(){ self.onLoadingStarted(); });
       $(this.wallpaper).bind("load_all_complete", function(){ self.onLoadingAllCompleted(); });

 };
 
 //ローディング開始
 FoxkehCreator.IndicatorView.prototype.onLoadingStarted = function() {
       
       this.element.html('<img src="./images/loading.gif" /> Loading...');
       
 };
 
 //ローディング完全完了
 FoxkehCreator.IndicatorView.prototype.onLoadingAllCompleted = function() {
       
       this.element.html('');
       
 };
 
 //グローバルオブジェクト化
 global.FoxkehCreator = FoxkehCreator;
 
})(this);