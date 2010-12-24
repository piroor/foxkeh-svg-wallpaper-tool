/*!
 * Copyright 2010, Mozilla Japan.
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * https://bitbucket.org/foxkeh/wallpaper/src/tip/MIT-LICENSE.txt
 * https://bitbucket.org/foxkeh/wallpaper/src/tip/GPL-LICENSE.txt
 */
(function(global){

 $(function(){
 		
		//アコーディオン
		$("#pallets").accordion();
		
		//初期化
		var initParam = {
   
                              //壁紙表示用SVG要素ID名
                              wallpaperSVG: "wallpaper",
                              
                              //コピーライト表示用SVGファイル
                              copyright: "parts/svg/copyright/copyright_2010.svg",
                              
                              //初期バックグランド
                              background: "parts/svg/bg/bg_2010_10.svg", 
                              
                              //パーツの最大個数
                              partsLimit: 5,
                              
                              //初期パーツリスト
                              parts: [{
                                      file: "parts/svg/foxkeh/foxkeh_2010_10.svg",
                                      right: 100,
                                      bottom: 100,
                                      alpha: 1,
                                      scale: 1,
                                      rotation: 0
                                   }],
                              
                              //拡大縮小の設定値
                              //scaleOptions: {min: 0.1, max: 10, step: 0.1},
                              
                              //透明度の設定値
                              alphaOptions: {min: 0.1, max: 1, step: 0.05},
                              
                              //回転度の設定値
                              //rotationOptions: {min: -180, max: 180, step: 0.1},
                              
                              //壁紙サイズ選択要素ID名
                              sizeSelector: "sizeSelect",
                              
                              //背景一覧ID名
                              backgroundList: "backgroundList",
               
                              //パーツ一覧ID名
                              partsList : "partsList",
                              
                              //ダウンロードボタンID名
                              downLoadButton: "downloadButton",
                              
                              //パーツコントローラーID名
                              partsControll: "partsControll",
                              
                              //インジケーターID名
                              indicator: "indicator"
   
		};
		
		var foxkehCreator =  new FoxkehCreator.FoxkehCreator(initParam);
   
		//グローバルオブジェクトに(debug用)
		global.foxkehCreator = foxkehCreator;
                
                
               //位置調整
               setPosition();
               $(window).bind("resize", function(){ setPosition(); });
                
               function setPosition() {
                                    
                  var height = $(window).height();
                  var delta = height-$("#page").height();
                  var marginTop = (delta>0)? delta/4 : 0;
                  
                  $("#page").css({marginTop: marginTop});
                                  
               };
		
					
   });
 
})(this);