(function(global){

 var SWT = global.SWT;

 /**
  * パーツコントロールController
  */
 SWT.PartsControllController = function(wallpaper, partsControllView) {
       
       this.wallpaper = wallpaper;
       this.partsControllView = partsControllView;
       
       //初期化
       this.init();
       
 };
 
 SWT.PartsControllController.prototype.init = function() {
       
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
 
}(window));