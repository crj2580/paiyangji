var SysMenu = cc.Layer.extend({
    _ship: null,

    init: function () {
        var bRet = false;
        if (this._super()) {
            winSize = cc.director.getWinSize();
            var sp = cc.Sprite.create(res.loading_png);
            sp.setAnchorPoint(0, 0);
            this.addChild(sp, 0, 1);

            var logo = cc.Sprite.createWithSpriteFrameName("#start_logo.png");
            logo.setAnchorPoint(0, 1);
            logo.setPosition(0, 480);
            this.addChild(logo, 10, 1);

            var newGameNormal = cc.Sprite.create(res.menu_png, cc.rect(133, 0, 133, 48));
            var newGameSelected = cc.Sprite.create(res.menu_png, cc.rect(133, 48, 133, 48));
            var newGameDisabled = cc.Sprite.create(res.menu_png, cc.rect(133, 48 * 2, 133, 48));

            var gameSettingsNormal = cc.Sprite.create(res.menu_png, cc.rect(0, 0, 133, 48));
            var gameSettingsSelected = cc.Sprite.create(res.menu_png, cc.rect(0, 48, 133, 48));
            var gameSettingsDisabled = cc.Sprite.create(res.menu_png, cc.rect(0, 48 * 2, 133, 48));

            var flare = cc.Sprite.create(res.flare_jpg);
            this.addChild(flare);
            flare.setVisible(false);
            var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, newGameDisabled, function () {
                this.onButtonEffect();
                // this.onNewGame();
                flareEffect(flare, this, this.onNewGame);
            }.bind(this));

            // setTimeout(() => {
            //     console.log('new')
            //     this.onNewGame();
            // })



            var gameSettings = cc.MenuItemSprite.create(gameSettingsNormal, gameSettingsSelected, gameSettingsDisabled, this.onSettings, this);

            var menu = cc.Menu.create(newGame, gameSettings);
            menu.alignItemsVerticallyWithPadding(10);
            this.addChild(menu, 1, 2);
            menu.setPosition(winSize.width / 2, winSize.height / 2 - 80);

            var poweredBy = cc.Sprite.createWithSpriteFrameName("#powered_by.png");
            poweredBy.setPosition(winSize.width / 2, 25);
            this.addChild(poweredBy, 10, 1);

            this.schedule(this.update, 0.1);

            //var boxFrame = cc.spriteFrameCache.getSpriteFrame("ship01.png");
            this._ship = cc.Sprite.createWithSpriteFrameName("#hero01.png");

            //this._ship =  new cc.Sprite("#ship01.png");
            this.addChild(this._ship, 0, 4);
            var pos = cc.p(Math.random() * winSize.width, 0);
            this._ship.setOpacity(180);
            this._ship.setPosition(pos);
            this._ship.runAction(cc.MoveBy.create(2, cc.p(Math.random() * winSize.width, pos.y + winSize.height + 100)));
            bRet = true;
        }

        return bRet;
    },
    onNewGame: function (pSender) {
        //load resources
        cc.LoaderScene.preload(g_maingame, function () {
            var scene = cc.Scene.create();
            scene.addChild(GameLayer.create());
            //scene.addChild(GameControlMenu.create());
            cc.director.runScene(scene);
        }, this);
    },
    onSettings: function (pSender) {
        this.onButtonEffect();
        var scene = cc.Scene.create();
        scene.addChild(SettingsLayer.create());
        cc.director.runScene(scene);
    },
    update: function () {
        if (this._ship.getPosition().y > 568) {
            var pos = cc.p(Math.random() * winSize.width, 10);
            this._ship.setPosition(pos);
            this._ship.runAction(cc.MoveBy.create(
                parseInt(5 * Math.random(), 10),
                cc.p(Math.random() * winSize.width, pos.y + 578)));
        }
    },
    onButtonEffect: function () {
    }
});

SysMenu.create = function () {
    var sg = new SysMenu();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

SysMenu.scene = function () {
    var scene = cc.Scene.create();
    var layer = SysMenu.create();
    scene.addChild(layer);
    return scene;
};
