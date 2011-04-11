(function (SVGSprite){

    /**
     * Sprite を初期化する
     * 
     * @class SVGSprite.Sprite は、表示リストの基本的なオブジェクトです。<br />
     * SVGエレメントのドラッグを有効／無効にすることができます。
     * 
     * @param {SVGElement} svgElement	SVGElement名
     * @return {Void}
     */
    SVGSprite.Sprite = function(svgElement) {

        this.constructor(svgElement);
         
    }
    SVGSprite.Sprite.prototype = new SVGSprite.DisplayObjectContainer();

    /**
     * ドラッグ可能にする
     * @param {Boolean} lockCenter 未定
     * @param {} bounds
     * @return {Void}
     */
    SVGSprite.Sprite.prototype.startDrag = function(lockCenter, bounds) {

        //mousedown を無効化して、不要なドラッグを防止
        this.svgElement.ownerSVGElement.addEventListener("mousedown", function(e){e.preventDefault();}, false);
        
        //ドラッグ範囲の設定
        if(typeof bounds != "undefined" && bounds != null && !isNaN(bounds.x) && !isNaN(bounds.y)  && !isNaN(bounds.width) && !isNaN(bounds.height) ) {
            
            this._bounds = bounds;
            this._bounds.left = this._bounds.x;
            this._bounds.right = this._bounds.x+this._bounds.width;
            this._bounds.top = this._bounds.y;
            this._bounds.bottom = this._bounds.y+this._bounds.height;
                
        } else {
            
            this._bounds = null;
            
        }
        
        //ドラッグ開始
        SVGSprite.Sprite.drag.startDrag(this);
	
    }

    /**
      * ドラッグ不可にする
      *
      * @return {Void}
      *
      */
    SVGSprite.Sprite.prototype.stopDrag = function() {

        SVGSprite.Sprite.drag.stopDrag();

    }

    /**
     * ドラッグ管理用オブジェクト
     *
     */
    SVGSprite.Sprite.drag = {
        
        /** 現在ドラッグ中のSVGSprite */
        target: null,
        
        /** ターゲットの初期位置 */
        origX: 0,
        origY: 0,
        
        /** ドラッグ時のマウス初期位置 */
        origMouseX: null,
        origMouseY: null
        
    };
     
    /**
     * ドラッグを開始する
     * @param	{Event}	event	マウスイベント
     * @return {Void}
     */
    SVGSprite.Sprite.drag.startDrag = function(target) {
        
        //ターゲットの設定
        this.target = target;
        
        //ターゲットの初期位置を設定
        this.origX = target.x;
        this.origY = target.y;
        
        //ドラッグ開始
        SVGSprite.Sprite.drag.target.svgElement.ownerSVGElement.addEventListener("mousemove", SVGSprite.Sprite.drag._doDrag, true);
    }

    /**
     * ドラッグを実行する
     * @param	{Event}	event	マウスイベント
     * @return {Void}
     */
    SVGSprite.Sprite.drag._doDrag = function(event) {

        var that = SVGSprite.Sprite.drag;
        
        //マウスの初期位置設定
        if(that.origMouseX == null) {
        
            that.origMouseX = event.clientX;
            that.origMouseY = event.clientY;
	                
        }
	            
        //再描画一時停止
        //var id = that.target.svgElement.ownerSVGElement.suspendRedraw(1000); //Operaの場合 unsuspendRedrawに不具合あり？
        
        //移動
        var x = ((event.clientX-that.origMouseX)/that.target._viewPortScaleX) + that.origX; 
        var y = ((event.clientY-that.origMouseY)/that.target._viewPortScaleY) + that.origY;
        	
        //移動制限
        if(that.target._bounds != null) {
            x = (x < that.target._bounds.left)? that.target._bounds.left : (x+that.target.width > that.target._bounds.right)? that.target._bounds.right-that.target.width : x;
            y = (y < that.target._bounds.top)? that.target._bounds.top : (y+that.target.height > that.target._bounds.bottom)? that.target._bounds.bottom-that.target.height : y;
        }
	
        that.target.x = x;
        that.target.y = y;
        
        //再描画再開
        //that.target.svgElement.ownerSVGElement.unsuspendRedraw(id);
            
    }

    /**
     * ドラッグを終了する
     * @param	{Event}	event	マウスイベント
     * @return {Void}
     */
    SVGSprite.Sprite.drag.stopDrag = function() {
        
        var that = SVGSprite.Sprite.drag;
        
        if(SVGSprite.Sprite.drag.target != null) {
            SVGSprite.Sprite.drag.target.svgElement.ownerSVGElement.removeEventListener("mousemove", SVGSprite.Sprite.drag._doDrag, true);
        }
        
        //各種プロパティを初期化
        that.target = null;
        that.origX = 0;
        that.origY = 0;
        that.origMouseX = null;
        that.origMouseY = null;
            
    }

}(SVGSprite));
