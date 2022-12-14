var SettingsLayer = cc.Layer.extend({
    init:function () {
        var bRet = false;
        if (this._super()) {
            var sp = cc.Sprite.create(res.loading_png);
            sp.setAnchorPoint(0,0);
            this.addChild(sp, 0, 1);

            var title = cc.Sprite.createWithSpriteFrame("#game_way.png");
            title.setPosition(winSize.width / 2, winSize.height - 100);
            this.addChild(title);


            var way = cc.Sprite.createWithSpriteFrame("#game_des.png");
            way.setPosition(winSize.width / 2, winSize.height - 200);
            this.addChild(way);

            var newGameNormal = cc.Sprite.create(res.menu_png, cc.rect(133, 0, 133, 48));
            var newGameSelected = cc.Sprite.create(res.menu_png, cc.rect(133, 48, 133, 48));
            var newGameDisabled = cc.Sprite.create(res.menu_png, cc.rect(133, 48 * 2, 133, 48));



            var flare = cc.Sprite.create(res.flare_jpg);
            this.addChild(flare);
            flare.setVisible(false);
            var newGame = cc.MenuItemSprite.create(newGameNormal, newGameSelected, newGameDisabled, function () {
                flareEffect(flare, this, this.onNewGame);
            }.bind(this));



            var menu = cc.Menu.create(newGame);
            menu.alignItemsVerticallyWithPadding(10);
            this.addChild(menu, 1, 2);
            menu.setPosition(winSize.width / 2, winSize.height / 2 - 80);

            bRet = true;
        }

        return bRet;
    },

    onNewGame:function (pSender) {
        //load resources
        cc.LoaderScene.preload(g_maingame, function () {
            var scene = cc.Scene.create();
            scene.addChild(GameLayer.create());
            cc.director.runScene(scene);
        }, this);
    },
    onBackCallback:function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(SysMenu.create());
        cc.director.runScene(scene);
    },
    onSoundControl:function(){
        MW.SOUND = !MW.SOUND;
        var audioEngine = cc.audioEngine;
        if(MW.SOUND){
            audioEngine.playMusic(res.mainMainMusic_mp3);
        }
        else{
            audioEngine.stopMusic();
        }
    },
    onModeControl:function(){
    }
});

SettingsLayer.create = function () {
    var sg = new SettingsLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};
