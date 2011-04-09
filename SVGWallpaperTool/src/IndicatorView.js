(function(global){

 var SWT = global.SWT;
 
 /**
  * インジケーターView
  */
 SWT.IndicatorView = function(wallpaper, indicatorElement) {
       
       this.wallpaper = wallpaper;
       this.element = $(indicatorElement);
 
       //イベント
       var self = this;
       $(this.wallpaper).bind("load_start",function(){ self.onLoadingStarted(); });
       $(this.wallpaper).bind("load_all_complete", function(){ self.onLoadingAllCompleted(); });
       $(this.wallpaper).bind("parts_fulled", function(){ self.onPartsFulled() });

 };
 
 //ローディング開始
 SWT.IndicatorView.prototype.onLoadingStarted = function() {
       
       this.element.html('<span class="SWT_loading">Loading...</span>');
       
 };
 
 //ローディング完全完了
 SWT.IndicatorView.prototype.onLoadingAllCompleted = function() {
       
       this.element.html('');
       
 };
 
 //パーツが追加できる上限いっぱいになった場合の処理
 SWT.IndicatorView.prototype.onPartsFulled = function() {
    
    this.element.html('Can not add any more parts!');
        
 };
 
}(window));