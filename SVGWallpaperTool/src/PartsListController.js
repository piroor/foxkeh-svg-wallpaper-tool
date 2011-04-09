(function(global){

 var SWT = global.SWT;
 
 /**
  * パーツリストController
  */
 SWT.PartsListController = function(wallpaper,partsListView) {
	
        this.wallpaper = wallpaper;
	this.partsListView = partsListView;
        
	 //イベント処理
	 var self = this;
	$(this.partsListView).bind("selected", function(){ self.selectedHandler(); });

 };
 
 SWT.PartsListController.prototype.selectedHandler = function() {
	
	if(this.partsListView.selectedListIsSVGDropBox) {
	    
	    var svgDropBox = this.partsListView.selected;
	    
	    if(typeof svgDropBox.fileType != "undefined") {
		
		var svgElement;
		
		if(svgDropBox.fileType == "svg") {
		
		    svgElement = document.importNode(svgDropBox.content, true);
		
		} else if(svgDropBox.fileType == "image") {
		    
		    var width = svgDropBox.contentElement.naturalWidth;
		    var height = svgDropBox.contentElement.naturalHeight;
		    
		    svgString  = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
		    svgString += '<image xlink:href="'+svgDropBox.content+'" width="'+width+'" height="'+height+'" />';
		    svgString += '</svg>';
		    
		    var parser = new DOMParser();  
		    var svgDoc = parser.parseFromString(svgString, "text/xml");
		    
		    var svgElement = document.importNode(svgDoc.getElementsByTagName("svg")[0], true);
		    
		}
		
		this.wallpaper.loadParts({svgElement: svgElement});
		
	    }
	    
	} else {
	    var url = $(this.partsListView.selected).attr("href");
	    this.wallpaper.loadParts({file: url});
	}
 }; 
 
}(window));