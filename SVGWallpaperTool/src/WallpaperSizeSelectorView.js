(function(global){

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
 
}(window));