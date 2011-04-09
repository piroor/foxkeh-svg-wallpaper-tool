(function(global){

 var SWT = global.SWT;

 /**
  * パーツコントロールView
  */
 SWT.PartsControllView = function(wallpaper, parentElement, options) {
       
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
 SWT.PartsControllView.prototype.init = function(options) {
       
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
 SWT.PartsControllView.prototype._createSlider = function(className,option) {
       
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
 SWT.PartsControllView.prototype.enable = function() {
       
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
 SWT.PartsControllView.prototype.disable = function() {
       
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
 
}(window));