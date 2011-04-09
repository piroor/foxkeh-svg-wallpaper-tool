(function(global){

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
 
}(window));