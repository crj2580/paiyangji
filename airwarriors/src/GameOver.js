var GameOver = cc.Layer.extend({
    _ship: null,
    _lbScore: 0,

    init: function () {
        var bRet = false;
        if (this._super()) {
            var sp = cc.Sprite.create(res.loading_png);
            sp.setAnchorPoint(0, 0);
            this.addChild(sp, 0, 1);

            var logo = cc.Sprite.create("#game_over.png");
            logo.setAnchorPoint(0, 1);
            logo.setPosition(0, 450);
            this.addChild(logo, 10, 1);

            var playAgainNormal = cc.Sprite.create(res.menu_png, cc.rect(133 * 2, 0, 133, 48));
            var playAgainSelected = cc.Sprite.create(res.menu_png, cc.rect(133 * 2, 48, 133, 48));
            var playAgainDisabled = cc.Sprite.create(res.menu_png, cc.rect(133 * 2, 48 * 2, 133, 48));

            var flare = cc.Sprite.create(res.flare_jpg);
            this.addChild(flare);
            flare.setVisible(false);
            var playAgain = cc.MenuItemSprite.create(playAgainNormal, playAgainSelected, playAgainDisabled, function () {
                flareEffect(flare, this, this.onPlayAgain);
            }.bind(this));

            var menu = cc.Menu.create(playAgain);
            this.addChild(menu, 1, 2);
            menu.setPosition(winSize.width / 2, 200);


            var coin = cc.Sprite.create("#coin.png");
            coin.setPosition(winSize.width / 2 - 20, 280);
            this.addChild(coin, 10, 1);

            var lbScore = cc.LabelTTF.create(MW.SCORE, "Arial Bold", 25);
            lbScore.setPosition(winSize.width / 2 + 30, 280);
            lbScore.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
            lbScore.setColor(cc.color(253, 195, 61, 255));
            this.addChild(lbScore, 10);

            // $.post('https://g.api.troncell.com/api/UserAction/PostPlayerData4ActionQrcode', {
            //     QrType: 'AfterGame',
            //     SnsType: 'Taobao',
            //     SecurityKey: 'ABCD',
            //     Score: MW.SCORE
            // }, function (result) {
            //     console.log(result)
            //     if (result.success) {
            //         console.log(result.result)
            //     }
            // })

            var poweredBy = cc.Sprite.createWithSpriteFrameName("#powered_by.png");
            poweredBy.setPosition(winSize.width / 2, 25);
            this.addChild(poweredBy, 10, 1);

            if (MW.SOUND) {
                cc.audioEngine.playMusic(res.mainMainMusic_mp3);
            }
            bRet = true;
        }
        return bRet;
    },
    onPlayAgain: function (pSender) {
        var scene = cc.Scene.create();
        scene.addChild(GameLayer.create());
        //scene.addChild(GameControlMenu.create());
        cc.director.runScene(scene);
    }
});

GameOver.create = function () {
    var sg = new GameOver();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

GameOver.scene = function () {
    var scene = cc.Scene.create();
    var layer = GameOver.create();
    scene.addChild(layer);
    return scene;
};
