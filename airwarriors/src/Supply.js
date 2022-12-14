/**
 * Created by wulix on 2016/8/15.
 */

var Supplier = cc.Sprite.extend({
    cureMode:0,
    cureHp:0,
    zOrder:1001,
    active:true,
    ctor:function (arg) {
        this._super();

        this.cureMode = arg.cureMode;
        this.cureHp = arg.cureHp;
        this.setSpriteFrame(arg.textureName);
    },

    update:function (dt) {
        var p = this.getPosition();
        if ((p.x < 0 || p.x > 320) && (p.y < 0 || p.y > 568)) {
            this.active = false;
        }
        this._timeTick += dt;
        if (this._timeTick > 0.1) {
            this._timeTick = 0;
            if (this._hurtColorLife > 0) {
                this._hurtColorLife--;
            }
        }

        var p = this.getPosition();
        if (p.x < -10 || p.x > g_sharedGameLayer.screenRect.width + 10 || p.y < 0 || p.y > g_sharedGameLayer.screenRect.height) {
            this.active = false;
            this.innerDestroy();
        }
    },

    innerDestroy:function(){
            this.setVisible(false);
            this.active = false;
            this.stopAllActions();
            MW.ACTIVE_SUPPLIERS--;
    },

    destroy:function () {
        var a = Explosion4Supply.getOrCreateExplosion();
        a.setPosition(this.getPosition());
        //SparkEffect.getOrCreateSparkEffect(this.getPosition());
        if (MW.SOUND) {
            cc.audioEngine.playEffect(res.cureMusic_mp3);
        }
        MW.ACTIVE_SUPPLIERS--;
        this.setVisible(false);
        this.active = false;
        this.stopAllActions();
    },

    collideRect:function (p) {
        var a = this.getContentSize();
        return cc.rect(p.x - a.width / 2, p.y - a.height / 2, a.width, a.height / 2);
    },
});


Supplier.getOrCreateSupplier = function (arg) {
    var selChild = null;
    for (var j = 0; j < MW.CONTAINER.SUPPLIES.length; j++) {
        selChild = MW.CONTAINER.SUPPLIES[j];

        if (selChild.active == false && selChild.cureMode == arg.cureMode) {
            selChild.cureHp = arg.cureHp;
            selChild.active = true;
            selChild.setVisible(true);
            MW.ACTIVE_SUPPLIERS++;
            return selChild;
        }
    }
    selChild = Supplier.create(arg);
    MW.ACTIVE_SUPPLIERS++;
    return selChild;
};


Supplier.create = function (arg) {
    var supplier = new Supplier(arg);
    g_sharedGameLayer.addSupply(supplier, supplier.zOrder, MW.UNIT_TAG.SUPPLY);
    MW.CONTAINER.SUPPLIES.push(supplier);
    return supplier;
};
