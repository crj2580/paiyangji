var BackSky = cc.Sprite.extend({
    active:true,
    ctor:function (frameName) {
        this._super();
        this.setSpriteFrame(frameName);
        this.setAnchorPoint(0, 0);
    },
    destroy:function () {
        this.setVisible(false);
        this.active = false;
    }
});

BackSky.create = function (frameName) {
    var background = new BackSky(frameName);
    g_sharedGameLayer.addChild(background, -10);
    MW.CONTAINER.BACKSKYS.push(background);
    return background;
};

BackSky.getOrCreate = function () {
    var selChild = null;
    for (var j = 0; j < MW.CONTAINER.BACKSKYS.length; j++) {
        selChild = MW.CONTAINER.BACKSKYS[j];
        if (selChild.active == false) {
            selChild.setVisible(true);
            selChild.active = true;
            return selChild;
        }
    }
    selChild = BackSky.create();
    return selChild;
};


BackSky.preSet = function () {
    var background1 = null;
    //for (var i = 0; i < 2; i++) {
    background1 = BackSky.create("bg01.png");
    background1.setVisible(false);
    background1.active = false;

    var background2 = null;
    //for (var i = 0; i < 2; i++) {
    background2 = BackSky.create("bg02.png");
    background2.setVisible(false);
    background2.active = false;
    //}
};

var BackTileMapLvl1 = [
        "lvl1_map1.png",
        "lvl1_map2.png",
        "lvl1_map3.png",
        "lvl1_map4.png"
];

var BackTileMap = cc.Sprite.extend({
    active:true,
    ctor:function (frameName) {
        this._super();
        this.setSpriteFrame(frameName);
        this.setAnchorPoint(0.5, 0);
    },
    destroy:function () {
        this.setVisible(false);
        this.active = false;
    }
});

BackTileMap.create = function (frameName) {
    var backTileMap = new BackTileMap(frameName);
    g_sharedGameLayer.addChild(backTileMap, -9);
    MW.CONTAINER.BACKTILEMAPS.push(backTileMap);
    return backTileMap;
};

BackTileMap.getOrCreate = function () {
    var selChild = null;
    for (var j = 0; j < MW.CONTAINER.BACKTILEMAPS.length; j++) {
        selChild = MW.CONTAINER.BACKTILEMAPS[j];
        if (selChild.active == false) {
            selChild.setVisible(true);
            selChild.active = true;
            return selChild;
        }
    }
    selChild = BackTileMap.create(BackTileMapLvl1[0|Math.random()*4]);
    return selChild;
};


BackTileMap.preSet = function () {
    var backTileMap = null;
    for (var i = 0; i < BackTileMapLvl1.length; i++) {
        backTileMap = BackTileMap.create(BackTileMapLvl1[i]);
        backTileMap.setVisible(false);
        backTileMap.active = false;
    }
};

