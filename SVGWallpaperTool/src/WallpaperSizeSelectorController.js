(function(global){

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