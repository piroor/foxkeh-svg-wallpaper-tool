(function(global){

    /** 
     * @class SVGSpriteはSVGエレメントをFlash/FlexのSpriteライクに扱うためのライブラリです。<br />
     * SVGSpriteの各種クラスを含んでいます。<br />
     */
    var SVGSprite = {};
    
    //名前空間設定
    SVGSprite.display = {};
    
    /**
     * クロスブラウザ用ゲッターセッター関数
     * @param {Object} obj ゲッターセッターを設定したいオブジェクト
     * @param {String} name ゲッターセッタープロパティ名
     * @param {Function} setter セッター関数
     * @param {Function} getter ゲッター関数
     */
    SVGSprite._defineSetterGetter = function(obj, name, setter, getter) {

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
     * 仮親
     */
    SVGSprite.tmpParent = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    SVGSprite.tmpParent.setAttribute("width", 0);
    SVGSprite.tmpParent.setAttribute("height", 0);
    SVGSprite.tmpParent.id = "SVGSpriteTmpParent";

    /**
     * グローバルオブジェクトに
     */
    global.SVGSprite = SVGSprite;
    
})(this);
