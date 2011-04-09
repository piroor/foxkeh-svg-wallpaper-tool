(function(global){
    
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
 
}(window));