/**
 * Created by wulix on 2016/7/26.
 */

var LifesLayer = cc.Layer.extend({
    lifeNum: 3,
    init: function () {
        var bRet = false;
        if (this._super()) {
            for (var j = 0; j < this.lifeNum - 1; j++) {
                // ship life
                var life = cc.Sprite.createWithTexture("#hero01.png");
                life.setScale(0.2);
                life.setAnchorPoint(1, 0);
                life.setPosition(j * 45, 10);
                this.addChild(life, 1000, 5);
            }
            bRet = true;
        }
        return bRet;
    },
    setLifeNum: function (lifes) {
        if (this.lifeNum === lifes) return;
        this.lifeNum = lifes;
        this.removeAllChildren();
        for (var j = 0; j < this.lifeNum - 1; j++) {
            // ship life
            var life = cc.Sprite.createWithTexture("#hero01.png");
            life.setScale(0.2);
            life.setAnchorPoint(1, 0);
            life.setPosition(105 - j * 45, 10);
            this.addChild(life, 1000, 5);
        }
    }
});

LifesLayer.create = function () {
    var sg = new LifesLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
