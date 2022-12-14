var StartLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        var size = cc.winSize;

        var bg = cc.Sprite.create(res.BackGround_jpg);
        bg.setPosition(size.width / 2, size.height / 2);
        this.addChild(bg);

        var helloLabel = cc.LabelTTF.create("Hello World", "Arial", 38);
        helloLabel.setPosition(size.width / 2, size.height / 2);
        this.addChild(helloLabel);

        return true;
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});