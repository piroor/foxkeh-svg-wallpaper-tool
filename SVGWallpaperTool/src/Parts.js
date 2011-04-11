(function(global){

 var SWT = global.SWT;

 /**
  * パーツ
  */
 SWT.Parts = function(svgElement) {
	
       this.constructor(svgElement);
       this.index = null;
       this.scale = 1;
       this.active = false;
       
       this.buttonMode = true;
 
       //BBoxTool
       this.SVGBoundingBox = null;//new SVGBoundingBox(this);
 
       //イベント処理
       var self = this;
       this.addEventListener("mousedown", function(){ self.activate(); }, false);
 
 };
 
 SWT.Parts.prototype = new SVGSprite.display.Sprite;
 
 SWT.Parts.prototype.setSvgElement = function(svgElement) {

       this._svgElement = svgElement;
     
 };
 
/**
 * 子要素として追加する
 *
 * @param {SVGElement} content 追加先の要素
 *
 */
 SWT.Parts.prototype.appendTo = function(content) {

	content.appendChild(this.svgElement);
	
	if(this.SVGBoundingBox == null) {
            this.SVGBoundingBox = new SVGBoundingBox(this);
	}
	
};

 
 //scale
 SWT._defineSetterGetter(SWT.Parts.prototype, "scale",
       
       //setter
       function(scale) {
                            
              this.scaleX = scale;
              this.scaleY = Math.abs(scale);
              
              this._scale = scale;
              
       },
       
       //getter
       function() {
              
              return this._scale;
              
       }
 );
 
 //active
 SWT.Parts.prototype.activate = function() {
	 
       if(!this.active) {
	
              var self = this;
              this.setStartDrag();
              
              self.addEventListener('mousedown', function(){ 
                     self.setStartDrag(); 
              });
              
	      //BBoxToolを有効に
	      this.SVGBoundingBox.enable();
	      
              $(this).trigger("activated");
       }
       
       this.active = true;
 
 };
 
 //deactive
 SWT.Parts.prototype.deactive = function() {
	
       if(this.active) {
              
	      //BBoxToolwを無効に
	      this.SVGBoundingBox.disable();
	      
              this.active = false;
              $(this).trigger("deactivated");
                     
       }
       
 };
 
 
 //ドラッグを開始する
 SWT.Parts.prototype.setStartDrag = function() {
	
	var self = this;
 
	this.startDrag(false);
	window.addEventListener('mouseup', function(){ 
						 
		self.stopDrag();
						 
	}, false);

 };
 
}(window));
