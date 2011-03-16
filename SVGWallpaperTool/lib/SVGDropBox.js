/*!
 * Copyright 2011, Mozilla Japan.
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * https://bitbucket.org/foxkeh/svg-wallpaper-tool/src/tip/MIT-LICENSE.txt
 * https://bitbucket.org/foxkeh/svg-wallpaper-tool/src/tip/GPL-LICENSE.txt
 */
(function(global){
 
    var SVGDropBox = function(option){
        
        option = option || {};
        this.imageWidth = option.width || 100;
        this.imageHeight = option.height || 100;
	this.validFile = false;
        
        this.init();
    };
    
    SVGDropBox.MIMETYPE = {
        svg : "image/svg+xml",
        jpeg: "image/png",
        png : "image/jpeg",
        gif : "image/gif"
    };
    
    /**
     *初期化
     */
    SVGDropBox.prototype.init = function(){
	
        //ドロップ領域用の要素を作成
        this.element = document.createElement("div");

	//FileReaderが定義されていない場合は初期化せず
	if(typeof FileReader === 'undefined') {
	    
	    return;
	    
	}
        
	//クラス名の付与
	this.className = "SVGDropBox";
        this.element.className = this.className;
	
        //Dropサポートの有無        
        if(this.isDropSupported()) { //Dropが有効の場合
            
            var p = document.createElement("p");
            p.innerHTML = "drop File";
            
            var self = this;
            
            this.element.addEventListener("dragenter", function(e){
		e.stopPropagation();
		e.preventDefault();
                
                self.element.className = self.className+" SVGDropBoxDragover";
                
	    }, false);
			
	    this.element.addEventListener("dragover", function(e){
		e.stopPropagation();
		e.preventDefault();
	    }, false);
            
            this.element.addEventListener("dragleave", function(e){
                e.stopPropagation();
		e.preventDefault();

                self.element.className = (typeof self.content == "undefined")? self.className : self.className+" SVGDropBOXDroped";                

            }, false);
            
            this.element.addEventListener("drop",function(e){
		
                e.stopPropagation();
                e.preventDefault();
                
                self.element.className = self.className;
                
                //ドロップされたファイルの取得
                var dt = e.dataTransfer;
                var files = dt.files;
                
                //ファイルのロード
                if(files.length > 0) {
		    
                    self.loadFile(files[0]);
		
		}
                
            },false);
            
            this.element.appendChild(p);
            
        } else { //Dropが無効の場合

            
            var p = document.createElement("p");
            p.innerHTML = "select File";
            
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            
            var self = this;
            input.addEventListener("change", function(e){
				
		var file = e.currentTarget.files[0];
		self.loadFile(file);
                
            }, false);
            
            this.element.appendChild(p);
            this.element.appendChild(input);
            
        }
        
     
    };
    
    /**
     * via Modernizr v1.6
     */
    SVGDropBox.prototype.isDropSupported = function(){
	
        var element = document.createElement('div');
        var eventName = 'ondrop';

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = (eventName in element);

        if (!isSupported) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if (!element.setAttribute) {
            element = document.createElement('div');
          }
          if (element.setAttribute && element.removeAttribute) {
            element.setAttribute(eventName, '');
            isSupported = typeof element[eventName] == 'function';

            // If property was created, "remove it" (by setting value to `undefined`)
            if (typeof element[eventName] != 'undefined') {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
    
    };
    
    SVGDropBox.prototype.isSVG = function(file){
      
        return (file.type == SVGDropBox.MIMETYPE.svg);
        
    };
    
    SVGDropBox.prototype.isImage = function(file){
        
        var type = file.type;
        return (type==SVGDropBox.MIMETYPE.jpeg||type==SVGDropBox.MIMETYPE.gif||type==SVGDropBox.MIMETYPE.png);
        
    }
    
    SVGDropBox.prototype.loadFile = function(file) {
        
	//サイズが0byteだった場合は処理をしない Firefox3.6のバグ対策
	if(file.size > 0) {
	
	    //ファイルタイプを判別
	    this.fileType = this.isSVG(file)? "svg" : this.isImage(file)? "image" : "other";
	    	    
	    var reader = new FileReader();
	    
	    var self = this;
	    reader.onload = function(e){ self.onFileLoaded(e);};
	    
	    if(this.fileType=="svg") {
		
		reader.readAsText(file, "utf-8");
		this.validFile = true;
		
	    } else if(this.fileType=="image"){
		
		reader.readAsDataURL(file);
		this.validFile  = true;
		
	    }
	    
	}
	
    };
    
    SVGDropBox.prototype.onFileLoaded = function(e) {
        
        var result = e.target.result;
        var container = document.createElement("div");
        container.className = "SVGDropBoxContainer";
        
        if(this.fileType == "svg") {
            
            //パース
            var parser = new DOMParser();  
            var svgDoc = parser.parseFromString(result, "text/xml");
                        
            var svgElement = document.importNode(svgDoc.getElementsByTagName("svg")[0], true);
            
            var width = svgElement.width.baseVal.value;
            var height = svgElement.height.baseVal.value;
            var aspect = height/width;

            var imageWidth = (this.imageWidth*aspect < this.imageHeight)? this.imageWidth : this.imageHeight/aspect;
            var imageHeight = (this.imageWidth*aspect < this.imageHeight)? this.imageWidth*aspect : this.imageHeight;
            
            svgElement.setAttribute("viewBox", "0 0 "+width+" "+height);
            svgElement.setAttribute("width", imageWidth);
            svgElement.setAttribute("height", imageHeight);
                    
            var contentElement = svgElement;
	    
	    result = svgDoc.getElementsByTagName("svg")[0];
                
        } else if(this.fileType == "image") {
            
            var image = document.createElement("img");
            image.src = result;
            image.setAttribute("width", this.imageWidth);
            
            var contentElement = image;
            
        }
        
        container.appendChild(contentElement);

        var children = this.element.childNodes;
        
        for(var i=0,l=children.length; i<l; i++) {
            
            this.element.removeChild(children[i]);
            
        }
        
        this.element.appendChild(container);
	this.element.className = self.className+" SVGDropBOXDroped";
	
	this.contentElement = contentElement;
        this.container = container;
        this.content = result;
        
    };
    
    
    
    global.SVGDropBox = SVGDropBox;
 
})(window);