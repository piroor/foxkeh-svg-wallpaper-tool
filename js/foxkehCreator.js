(function(global){


 $(function(){
 		
		//アコーディオン
		$("#pallets").accordion();
		
		//初期化
		var initParam = {
   
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
		
		var foxkehCreator =  new FoxkehCreator.FoxkehCreator(initParam);
   
		//グローバルオブジェクトに
		global.foxkehCreator = foxkehCreator;
		
					
   });
 
})(this);