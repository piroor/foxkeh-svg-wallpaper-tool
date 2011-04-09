(function(global){

 var SWT = global.SWT;

 /**
  * パーツリストView
  */
 SWT.PartsListView = function(partsList) {
	
	this.partsListElement = $(partsList);
	this.list = this.partsListElement.find("> li a");

	this.init();
	
	//イベント処理
	var self = this;
	this.list.click(function(){ self.select(this); return false; });
 
 };
 
 SWT.PartsListView.prototype.init = function() {

    this.appendSVGDropBox();

 };
 
 SWT.PartsListView.prototype.appendSVGDropBox = function() {

    var svgDropBox = new SVGDropBox({width:70, height:70});
    var list = document.createElement("li");
    list.appendChild(svgDropBox.element);
    this.partsListElement.append(list);
    
    //イベント処理
    var self = this;
    $(list).click(function(){ self.select(svgDropBox,true); });
    svgDropBox.element.addEventListener("drop",function(e){
	
	e.stopPropagation();
        e.preventDefault();
	
	if(svgDropBox.validFile) {
	    self.appendSVGDropBox();   
	}
	
    }, false);
    
 };
 
 SWT.PartsListView.prototype.select = function(selectedList,isSVGDropBox) {
	
	this.selectedListIsSVGDropBox = (typeof isSVGDropBox == "boolean")? isSVGDropBox : false;
	this.selected = selectedList;
	$(this).trigger("selected");
 
 };
 
}(window));