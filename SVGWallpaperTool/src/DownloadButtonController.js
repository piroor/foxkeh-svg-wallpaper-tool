(function(global){

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
 
}(window));