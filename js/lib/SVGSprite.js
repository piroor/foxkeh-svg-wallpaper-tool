/** 
 * @fileOverview SVG要素 を Flash/Flex の Sprite っぽく扱うためのライブラリ
 * 
 * @author OFFIBA.com
 * @version 20101021
 *
 * copyright 2010 OFFIBA,inc.
 * Dual licensed under the MIT or GPL Version 3 licenses.
 */
 
if(! SVGUtil.Transform) {
    
    throw new Error("require: SVGTransformUtil");
    
}

(function(global){

    /**
     * クロスブラウザ用ゲッターセッター関数
     * @param {Object} obj ゲッターセッターを設定したいオブジェクト
     * @param {String} name ゲッターセッタープロパティ名
     * @param {Function} setter セッター関数
     * @param {Function} getter ゲッター関数
     */
    function defineSetterGetter(obj, name, setter, getter) {

        //__defineSetter__が未定義かつObject.definePropertyが有効な場合
        if (!Object.prototype.__defineSetter__ && Object.defineProperty({},"x",{get: function(){return true}}).x) {

            Object.defineProperty(obj,name, {
                set: setter,
                get: getter 
            });

        } else if(Object.prototype.__defineSetter__) {
        
            obj.__defineSetter__(name, setter);
            obj.__defineGetter__(name, getter);
        
        }

    };


    /** 
     * @class SVGSpriteはSVGエレメントをFlash/FlexのSpriteライクに扱うためのライブラリです。<br />
     * SVGSpriteの各種クラスを含んでいます。<br />
     */
    var SVGSprite = {};
	
	/**
	 * 仮親
	 */
	 SVGSprite.tmpParent = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	 SVGSprite.tmpParent.setAttribute("width", 0);
	 SVGSprite.tmpParent.setAttribute("height", 0);
	 SVGSprite.tmpParent.id = "SVGSpriteTmpParent";
 
    /**
     * EventListener をラッパーするターゲットを設定する
     * 
     * @class SVGSprite.EventDispatcher はイベント送出用基本クラスです。<br />
     * SVGエレメントの EventListener にラッパーするためのクラスです。
     * 
     * @param {String} svgElement	ラッパー先のSVGElementかもしくはid
     */
    SVGSprite.EventDispatcher = function(svgElement) {
            
        /**
        * 内部保持用　SVGElement
        * @return {SVGElement}
        */
        this.svgElement = svgElement;
        
    }


    /**
     * イベントリスナーに登録する<br />
     * SVGエレメントの addEventListener に橋渡しする。
     * 
     * @param {String}	type イベントタイプ
     * @param {Function} listener リスナーファンクション
     * @param {Boolean} useCapture ユーズキャプチャー
     * @return {Void}
     * 
     */
    SVGSprite.EventDispatcher.prototype.addEventListener = function(type, listener, useCapture){

        useCapture = (useCapture)? true : false;
        this.svgElement.addEventListener(type, listener, useCapture);
        
    }


    /**
      * イベントリスナーから削除する<br />
      * SVGエレメントの removeEventListener に橋渡しする。
      * 
      * @param {String}	type イベントタイプ
      * @param {Function} listener リスナーファンクション
      * @param {Boolean} useCapture ユーズキャプチャー
      * @return {Void}
      * 
      */
    SVGSprite.EventDispatcher.prototype.removeEventListener = function(type, listener, useCapture){

        useCapture = (useCapture)? true : false;
        this.svgElement.removeEventListener(type, listener, useCapture);
        
    }
     
    /**
     * SVGSprite.DisplayObject を初期化する
     * 
     * @class SVGSprite.DisplayObject は表示することのできるオブジェクトの基本クラスです。<br />
     * SVGエレメントを移動、拡大縮小、回転、透過させることができます。
     * 
     * @return {Void}
     *
     * @example
     * var monkey = new SVGSprite.DisplayObject('monkey'); //引数にはSVGエレメントのidを指定<br />
     * monkey.x = 100;				//x座標の100pxに移動<br />
     * monkey.rotation = 90;	//90度回転<br />
     * monkey.scaleY = 1.5;		//y方向に1.5倍拡大<br />
     * monkey.alpha = .2;			//透明度を.2に設定
     */
    SVGSprite.DisplayObject = function(svgElement) {

        this.constructor(svgElement);

    }
    SVGSprite.DisplayObject.prototype = new SVGSprite.EventDispatcher();

    /**
     * svgElement setter/getter
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "svgElement",

        //setter
        function(svgElement) {
            
            if(typeof this._svgElement === "undefined" && svgElement){
                
                //_svgElement設定
                var _svgElement = svgElement;
                
                if (typeof svgElement === "string") {
                
                    var __svgElement = document.getElementById(svgElement);
                    
                    if(__svgElement) {
                        
                        _svgElement = __svgElement;
                        
                    } else {
                        
                        var _SVGs = document.getElementsByTagName('object');
                        
                        for(var i=0; i<_SVGs.length; i++) {
                                
                                if(_SVGs[i].type === "image/svg+xml") {
                                        
                                        _svgElement = _SVGs[i].contentDocument.getElementById(svgElement);
                                        
                                }
                                
                        }
                        
                    }
                     
                     
                }
                
                if(! _svgElement || _svgElement.namespaceURI !== "http://www.w3.org/2000/svg") {

                    throw new Error("引数が SVG Element ではありません。");

                }
                
                //_prefix設定
                this.__prefix = (typeof _svgElement.prefix === "string")? _svgElement.prefix+":" : "";
                
			    //親要素が無い場合は、仮親を作成
			    if(_svgElement.parentNode == null){
					document.body.appendChild(SVGSprite.tmpParent);
					SVGSprite.tmpParent.appendChild(_svgElement);
			    }
					   
                //transform用ユーティリティ
                this._svgTransformUtil = new SVGUtil.Transform(_svgElement);
                
                //SVGSpriteラッパーオブジェクト
                this._svgElement = document.createElementNS("http://www.w3.org/2000/svg", this.__prefix+"g");
                this._svgElement.setAttribute("class", "SVGSprite");
					   
				//ラップ
				this._svgTransformUtil.svgElement.parentNode.replaceChild(this._svgElement, this._svgTransformUtil.svgElement);
                this._svgElement.appendChild(this._svgTransformUtil.svgElement);

                /**
                 * オリジナルSVGエレメント
                 * @return {SVGElement}
                 */
                this.sourceSVGElement = _svgElement;
                
                /**
                * ボタンモード
                * @return {Boolean}
                */
                this.buttonMode = false;
                
            }
            
            
        },
        
        //getter
        function() {
            
            return this._svgElement;
            
        }
    );

    /**
     * prefix setter/getter
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "_prefix",
        
        //setter
        function() {
        
            throw new Error("参照専用です。");
        
        },
        
        //getter
        function() {
        
            return this.__prefix;
        
        }
    );

    /**
      * viewPortとviewBoxのX座標比を返す
      *
      * @return {Number}
      *
      */
    SVGSprite.DisplayObject.prototype._getViewPortScaleX = function(){
        
        return this._svgElement.nearestViewportElement.width.baseVal.value/this._svgElement.nearestViewportElement.viewBox.baseVal.width;

    }

    /**
     * _viewPortScaleX setter/getter
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "_viewPortScaleX",
        
        //setter
        function() {
            
            throw new Error("参照専用です。");
            
        },
        
        //getter
        function() {
        
            return this._getViewPortScaleX();
        
        }
    );

    /**
      * viewPortとviewBoxのY座標比を返す
      *
      * @return {Number}
      *
      */
    SVGSprite.DisplayObject.prototype._getViewPortScaleY = function(){
        
        return this._svgElement.nearestViewportElement.height.baseVal.value/this._svgElement.nearestViewportElement.viewBox.baseVal.height;

    }

    /**
     * _viewPortScaleY setter/getter
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "_viewPortScaleY",
        
        //setter
        function() {
            
            throw new Error("参照専用です。");
            
        },    
        //getter
        function() {
            
            return this._getViewPortScaleY();
            
        }
    );

    /**
     * x座標ゲッター／セッター
     *
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "x",
        
        //setter
        function(x) {
        
            this._svgTransformUtil.setX(x);
            
        },
        
        //getter
        function() {
        
            return this._svgTransformUtil.getX();
            
        }
        
    );

    /**
     * y座標ゲッター／セッター
     */
      
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "y",
        
        //setter
        function(y) {
            
            this._svgTransformUtil.setY(y);
                        
        },
        
        //getter
        function() {
        
            return this._svgTransformUtil.getY();
        
        }
    );

    /**
     * 幅ゲッター／セッター
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "width",
    
        //setter
        function(width) {
            
			this.scaleX = width/this._svgTransformUtil.origWidth;
					   
        },
        
        //getter
        function() {
            
            return this._svgTransformUtil.getWidth();
            
        }
    );

    /**
     * 高さ setter/getter
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "height",

        //setter
        function(height) {
        
            this.scaleY = height/this._svgTransformUtil.origHeight;
					   
        },
        
        //getter
        function() {

            return this._svgTransformUtil.getHeight();
        
        }
        
    );

    /**
     * scaleX setter/getter
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "scaleX",
        
        //setter
        function(scaleX) {
            
            this._svgTransformUtil.setScaleX(scaleX);
                        
        },
            
        //getter
        function() {
        
            return this._svgTransformUtil.getScaleX();
        
        }
    );

    /**
     * scaleY setter/getter
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "scaleY",
    
        //setter
        function(scaleY) {
        
            this._svgTransformUtil.setScaleY(scaleY);
            
        },
    
        //getter
        function() {
      
            return this._svgTransformUtil.getScaleY();
        
        }
        
    );

    /**
     * rotation setter/getter
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "rotation",


        //setter
        function(rotation) {
        
            this._svgTransformUtil.setRotate(rotation);
                        
        },
        
        //getter
        function() {
        
            return this._svgTransformUtil.getRotate();
            
        }
    );

    /**
     * alpha値を返す
     * @return {Number}
     */
    SVGSprite.DisplayObject.prototype._getAlpha = function() {
        
        var _alpha = this.svgElement.getAttribute('opacity');
        return  Number((typeof _alpha === 'string')? _alpha : 1);
    }

    /**
     * alpha setter/getter
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "alpha",
    
        //setter
        function(alpha) {
            
            var _alpha = Number(alpha);
            if(0 <= _alpha && _alpha <= 1) {
                this.svgElement.setAttribute('opacity', _alpha);
            }
        
        },
        
        //getter
        function() {
        
            return this._getAlpha();
        
        }
    );

    /**
     * buttonMode setter/getter
     */
    defineSetterGetter(SVGSprite.DisplayObject.prototype, "buttonMode",
        
        //setter
        function(buttonMode) {
        
            this._buttonMode = Boolean(buttonMode);
            
            if(this._buttonMode) {
                this.svgElement.setAttributeNS(null, "style", "cursor: move");
            } else {
                this.svgElement.setAttributeNS(null, "style", "cursor: normal");	
            }
                
        },
        
        //getter
        function() {
        
            return this._buttonMode;
        
        }
    );

    /**
     * SVGSprite.DisplayObjectContainer を初期化する
     * 
     * @class SVGSprite.DisplayObjectContainer は、子要素をもつことができる表示オブジェクトの基本要素です。<br />
     * 子要素の追加、削除、リストの参照などが行えます。
     * 
     * @param {SVGElement} svgElement	SVGElement名
     * @return {Void}
     */
    SVGSprite.DisplayObjectContainer = function(svgElement) {

        this.constructor(svgElement);
            
	};

    SVGSprite.DisplayObjectContainer.prototype = new SVGSprite.DisplayObject();

    /**
      * 子要素を追加する
      *
      * @param {SVGSprite.DisplayObject} child 追加する子要素
      *
      */
    SVGSprite.DisplayObjectContainer.prototype.addChild = function(child) {

        throw new Error("未実装です。");
        
	};

	/**
	 * 子要素として追加する
	 *
	 * @param {SVGElement} content 追加先の要素
	 *
	 */
	SVGSprite.DisplayObjectContainer.prototype.appendTo = function(content) {

		content.appendChild(this.svgElement);

	};
 
 
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
        if(that.target._bounds) {
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


    /**
     * グローバルオブジェクトに
     */
    global.SVGSprite = SVGSprite;
    
})(this);
