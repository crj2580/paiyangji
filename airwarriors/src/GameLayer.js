//
// MoonWarriors
//
// Handles the Game Logic
//

STATE_PLAYING = 0;
STATE_GAMEOVER = 1;
MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;

var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _time: null,
    _ship: null,
    _backSky: null,
    _backSkyHeight: 0,
    _backSkyRe: null,
    _levelManager: null,
    _tmpScore: 0,
    _isBackSkyReload: false,
    _isBackTileReload: false,
    lbScore: null,
    screenRect: null,
    explosionAnimation: [],
    _beginPos: cc.p(0, 0),
    _state: STATE_PLAYING,
    _explosions: null,
    _explosions4supply: null,

    _texOpaqueBatch: null,
    _texTransparentBatch: null,
    _lifeLayer: null,

    _displayFrame: null,
    musicToggle: null,
    mProgressBgSpr: null,
    mProgressSpr: null,

    init: function () {
        var bRet = false;
        if (this._super()) {

            cc.spriteFrameCache.addSpriteFrames(res.textureOpaquePack_plist);
            cc.spriteFrameCache.addSpriteFrames(res.bullet_plist);
            cc.spriteFrameCache.addSpriteFrames(res.b01_plist);

            // reset global values
            MW.CONTAINER.ENEMIES = [];
            MW.CONTAINER.ENEMY_BULLETS = [];
            MW.CONTAINER.PLAYER_BULLETS = [];
            MW.CONTAINER.EXPLOSIONS = [];
            MW.CONTAINER.SPARKS = [];
            MW.CONTAINER.HITS = [];
            MW.CONTAINER.BACKSKYS = [];
            MW.CONTAINER.BACKTILEMAPS = [];
            MW.ACTIVE_ENEMIES = 0;

            MW.SCORE = 0;
            MW.LIFE = 4;

            // console.log(window.localStorage.whosyourdaddy)
            if (window.localStorage.whosyourdaddy) {
                MW.LIFE = 30;
            }

            this._state = STATE_PLAYING;

            // OpaqueBatch
            var texOpaque = cc.textureCache.addImage(res.textureOpaquePack_png);
            this._texOpaqueBatch = cc.Sprite.create();
            this._texOpaqueBatch.setTexture(texOpaque);
            this._texOpaqueBatch.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
            this.addChild(this._texOpaqueBatch);

            // TransparentBatch
            var texTransparent = cc.textureCache.addImage(res.textureTransparentPack_png);
            this._texTransparentBatch = cc.Sprite.create();
            this._texTransparentBatch.setTexture(texTransparent);

            this.addChild(this._texTransparentBatch);

            winSize = cc.director.getWinSize();
            this._levelManager = new LevelManager(this);

            this.screenRect = cc.rect(0, 0, winSize.width, winSize.height + 10);

            // score frame
            this._displayFrame = cc.Sprite.createWithSpriteFrame("#game_display.png");
            this._displayFrame.setScale(0.4)
            this._displayFrame.setAnchorPoint(0, 1);
            this._displayFrame.setPosition(20, cc.director.getVisibleSize().height - 5);
            this.addChild(this._displayFrame, 1000);


            // score
            this.lbScore = cc.LabelTTF.create("0", "Arial Bold", 15);
            this.lbScore.setAnchorPoint(1, 0);
            // this.lbScore.setColor(cc.color(253, 195, 61, 255));
            this.lbScore.setColor(cc.color(255, 78, 0, 255));
            this.lbScore.setHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
            this.addChild(this.lbScore, 1000);
            // this.lbScore.setPosition(winSize.width / 2 + 60, winSize.height - 35);
            this.lbScore.setPosition(winSize.width / 2 + 98 + this.lbScore.width / 2, winSize.height - 29);


            //music
            // var musicOn = cc.Sprite.create("#sound_open.png");
            // var musicOff = cc.Sprite.create("#sound_close.png");

            // this.musicToggle = cc.MenuItemToggle.create(
            //     cc.MenuItemSprite.create(musicOn),
            //     cc.MenuItemSprite.create(musicOff));
            // this.musicToggle.setCallback(this.onSoundControl);
            // var state = MW.SOUND ? 0 : 1;
            // this.musicToggle.setSelectedIndex(state);
            // this.musicToggle.runAction(cc.rotateBy(1, 180, 180).repeatForever());

            // var menu = cc.Menu.create(this.musicToggle);
            // menu.setPosition(winSize.width - 20, winSize.height - 22);
            // this.addChild(menu, 10000);





            this.mProgressBgSpr = cc.Sprite.create(res.progressBack_png);
            this.mProgressBgSpr.setScale(0.4)
            this.mProgressBgSpr.setAnchorPoint(0.0, 0.5);
            this.mProgressBgSpr.setPosition(50, winSize.height - 20);
            this.addChild(this.mProgressBgSpr, 1000);

            this.mProgressSpr = cc.Sprite.createWithTexture(res.progressFront_png);
            this.mProgressSpr.setScale(0.4)
            this.mVisibleRect = cc.rect(0, 0, 240, 30);
            // this.mVisibleRect = cc.rect(0, 0, 83, 11);
            this.mProgressSpr.setAnchorPoint(0.0, 0.5);
            this.mProgressSpr.setPosition(50, winSize.height - 20);
            this.mProgressSpr.setTextureRect(this.mVisibleRect);
            this.addChild(this.mProgressSpr, 1000);

            //menu.runAction(cc.rotateBy(1,180,180).repeatForever());

            // ship life
            // var life = cc.Sprite.createWithTexture("#fly1.png");
            // life.setScale(0.6);
            // life.setAnchorPoint(1,0);
            // life.setPosition(300, 10);
            // //this.addChild(life);
            // this.addChild(life, 1000, 5);

            this._lifeLayer = LifesLayer.create();
            this._lifeLayer.setAnchorPoint(0, 1);
            this._lifeLayer.setPosition(200, 10);
            this.addChild(this._lifeLayer, 1000, 5);



            // ship Life count
            // this._lbLife = cc.LabelTTF.create("0", "Arial", 20);
            // this._lbLife.setPosition(60, 463);
            // this._lbLife.setColor(cc.color(255, 0, 0, 255));
            // this.addChild(this._lbLife, 1000);

            // explosion batch node
            cc.spriteFrameCache.addSpriteFrames(res.explosion_plist);
            var explosionTexture = cc.textureCache.addImage(res.explosion_png);
            this._explosions = cc.Sprite.create();
            this._explosions.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
            this.addChild(this._explosions);
            Explosion.sharedExplosion();



            // explosion batch node
            cc.spriteFrameCache.addSpriteFrames(res.b01_plist);
            var explosionTexture = cc.textureCache.addImage(res.b01_png);
            this._explosions4supply = cc.Sprite.create();
            this._explosions4supply.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
            this.addChild(this._explosions4supply);
            Explosion4Supply.sharedExplosion();



            // ship
            this._ship = new Ship();
            this._texTransparentBatch.addChild(this._ship, this._ship.zOrder, MW.UNIT_TAG.PLAYER);
            // accept touch now!
            this._ship.setScale(0.4)

            if (cc.sys.capabilities.hasOwnProperty('keyboard'))
                //this.setKeyboardEnabled(true);

                if (cc.sys.capabilities.hasOwnProperty('mouse'))
                    /*if ('mouse' in sys.capabilities)*/
                    //this.setMouseEnabled(true);

                    if (cc.sys.capabilities.hasOwnProperty('touches'))
                        /*if ('touches' in sys.capabilities)*/
                        cc.eventManager.addListener({
                            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                            onTouchesMoved: function (touches, event) {

                                var currentShip = event.getCurrentTarget();
                                var point = touches[0];
                                currentShip.move(point);
                            }
                            //}
                        }, this._ship);

            // if(cc.sys.capabilities.hasOwnProperty("accelerometer")){
            //
            //     cc.eventManager.addListener({
            //        event:cc.EventListener.ACCELERATION,
            //
            //         callback: function(accelEvent, event)
            //         {
            //             cc.log('Accel X: ' + accelEvent.x + ' Y: ' + accelEvent.y + ' Z: ' + accelEvent.z);
            //         }
            //     },this);
            //     }
            // }

            // schedule
            this.scheduleUpdate();
            this.schedule(this.scoreCounter, 1);

            if (MW.SOUND) {
                cc.audioEngine.playMusic(res.bgMusic_mp3, true);
            }

            bRet = true;

            g_sharedGameLayer = this;


            //pre set
            Bullet.preSet();
            Enemy.preSet();
            HitEffect.preSet();
            SparkEffect.preSet();
            Explosion.preSet();
            Explosion4Supply.preSet();
            BackSky.preSet();
            BackTileMap.preSet();

            this.initBackground();
        }
        return bRet;
    },
    updateProgress: function () {
        var penergyPercent = 0
        if (this._ship === undefined || this._ship == null) {
        }
        else {
            penergyPercent = this._ship.HP / MW.ShipMaxHP;
        }

        if (penergyPercent > 1.0)
            penergyPercent = 1.0;
        else if (penergyPercent < 0.0)
            penergyPercent = 0.0;
        // var vw = 83 * penergyPercent;
        var vw = 240 * penergyPercent;
        // this.mVisibleRect = cc.rect(0, 0, vw, 11);
        this.mVisibleRect = cc.rect(0, 0, vw, 30);
        this.mProgressSpr.setTextureRect(this.mVisibleRect);
    },
    onSoundControl: function () {
        MW.SOUND = !MW.SOUND;
        var audioEngine = cc.audioEngine;
        if (MW.SOUND) {
            audioEngine.playMusic(res.mainMainMusic_mp3);
        }
        else {
            audioEngine.stopMusic();
        }
    },

    initBackground: function () {
        this._backSky = BackSky.getOrCreate();
        this._backSkyHeight = this._backSky.getContentSize().height;

        this.moveTileMap();
        this.schedule(this.moveTileMap, 5);
    },

    moveTileMap: function () {
        var backTileMap = BackTileMap.getOrCreate();
        var ran = Math.random();
        backTileMap.setPosition(ran * 320, winSize.height);
        var move = cc.MoveBy.create(ran * 2 + 10, cc.p(0, -winSize.height - 240));
        var fun = cc.CallFunc.create(function () {
            backTileMap.destroy();
        }, this);
        backTileMap.runAction(cc.Sequence.create(move, fun));
    },

    update: function (dt) {
        if (this._state == STATE_PLAYING) {
            this.checkIsCollide();
            this.removeInactiveUnit(dt);
            this.checkIsReborn();
            this.updateUI();
            this._movingBackground(dt);
        }
    },

    checkIsCollide: function () {
        var selChild, bulletChild;
        // check collide
        var i, locShip = this._ship;
        for (i = 0; i < MW.CONTAINER.ENEMIES.length; i++) {
            selChild = MW.CONTAINER.ENEMIES[i];
            if (!selChild.active)
                continue;

            for (var j = 0; j < MW.CONTAINER.PLAYER_BULLETS.length; j++) {
                bulletChild = MW.CONTAINER.PLAYER_BULLETS[j];
                if (bulletChild.active && this.collide(selChild, bulletChild)) {
                    bulletChild.hurt();
                    selChild.hurt();
                }
            }
            if (this.collide(selChild, locShip)) {
                if (locShip.active) {
                    selChild.hurt();
                    locShip.hurt();
                }
            }
        }

        for (i = 0; i < MW.CONTAINER.ENEMY_BULLETS.length; i++) {
            selChild = MW.CONTAINER.ENEMY_BULLETS[i];
            if (selChild.active && this.collide(selChild, locShip)) {
                if (locShip.active) {
                    selChild.hurt();
                    locShip.hurt();
                }
            }
        }

        for (i = 0; i < MW.CONTAINER.SUPPLIES.length; i++) {
            selChild = MW.CONTAINER.SUPPLIES[i];
            if (!selChild.active)
                continue;

            if (this.collide(selChild, locShip)) {
                if (locShip.active) {
                    selChild.destroy();
                    locShip.cure(selChild.cureHp);
                }
            }
        }
    },
    removeInactiveUnit: function (dt) {
        var selChild, children = this._texOpaqueBatch.getChildren();
        for (var i in children) {
            selChild = children[i];
            if (selChild && selChild.active)
                selChild.update(dt);
        }

        children = this._texTransparentBatch.getChildren();
        for (i in children) {
            selChild = children[i];
            if (selChild && selChild.active)
                selChild.update(dt);
        }
    },
    checkIsReborn: function () {
        var locShip = this._ship;
        if (MW.LIFE > 0 && !locShip.active) {
            locShip.born();
        } else if (MW.LIFE <= 0 && !locShip.active) {
            this._state = STATE_GAMEOVER;
            // XXX: needed for JS bindings.
            this._ship = null;
            this.runAction(cc.Sequence.create(
                cc.DelayTime.create(0.2),
                cc.CallFunc.create(this.onGameOver, this)));
        }
    },
    updateUI: function () {
        if (this._tmpScore < MW.SCORE) {
            this._tmpScore += 4;
        }

        if (MW.SCORE > 12000 && this._levelManager._currentLevel.level == 1) {
            console.log(this._levelManager._currentLevel)
            this._levelManager._currentLevel = Level2;
            this._levelManager.setLevel(this._levelManager._currentLevel);
        }
        if (MW.SCORE > 26000 && this._levelManager._currentLevel.level == 2) {
            console.log(this._levelManager._currentLevel)
            this._levelManager._currentLevel = Level3;
            this._levelManager.setLevel(this._levelManager._currentLevel);
        }
        if (MW.SCORE > 42000 && this._levelManager._currentLevel.level == 3) {
            console.log(this._levelManager._currentLevel)
            this._levelManager._currentLevel = Level4;
            this._levelManager.setLevel(this._levelManager._currentLevel);
        }
        if (MW.SCORE > 60000 && this._levelManager._currentLevel.level == 4) {
            console.log(this._levelManager._currentLevel)
            this._levelManager._currentLevel = Level5;
            this._levelManager.setLevel(this._levelManager._currentLevel);
        }


        //this._lbLife.setString(MW.LIFE + '');
        this._lifeLayer.setLifeNum(MW.LIFE);
        this.lbScore.setString(this._tmpScore);
        this.lbScore.setPosition(winSize.width / 2 + 98 + this.lbScore.width / 2, winSize.height - 29);
        this.updateProgress();
    },
    collide: function (a, b) {
        var pos1 = a.getPosition();
        var pos2 = b.getPosition();
        if (Math.abs(pos1.x - pos2.x) > MAX_CONTAINT_WIDTH || Math.abs(pos1.y - pos2.y) > MAX_CONTAINT_HEIGHT)
            return false;

        var aRect = a.collideRect(pos1);
        var bRect = b.collideRect(pos2);
        return cc.rectIntersectsRect(aRect, bRect);
    },
    _movingBackground: function (dt) {
        var movingDist = 16 * dt;       // background's moving rate is 16 pixel per second

        var locSkyHeight = this._backSkyHeight, locBackSky = this._backSky;
        var currPosY = locBackSky.getPositionY() - movingDist;
        var locBackSkyRe = this._backSkyRe;

        if (locSkyHeight + currPosY <= winSize.height) {
            if (locBackSkyRe != null)
                throw "The memory is leaking at moving background";
            locBackSkyRe = this._backSky;
            this._backSkyRe = this._backSky;

            //create a new background
            this._backSky = BackSky.getOrCreate();
            locBackSky = this._backSky;
            locBackSky.setPositionY(currPosY + locSkyHeight - 2);
        } else
            locBackSky.setPositionY(currPosY);

        if (locBackSkyRe) {
            //locBackSkyRe
            currPosY = locBackSkyRe.getPositionY() - movingDist;
            if (currPosY + locSkyHeight < 0) {
                locBackSkyRe.destroy();
                this._backSkyRe = null;
            } else
                locBackSkyRe.setPositionY(currPosY);
        }
    },
    scoreCounter: function () {
        if (this._state == STATE_PLAYING) {
            this._time++;
            this._levelManager.loadLevelResource(this._time);
        }
    },
    onGameOver: function () {
        var actionid = this.getQueryStringValue("actionId");
        if (actionid == undefined || actionid == "") {
            actionid = -1;
            console.log(1)
        }
        var openid = this.getQueryStringValue("openid");
        if (actionid === -1) {
            var scene = cc.Scene.create();
            scene.addChild(GameOver.create());
            cc.director.runScene(scene);
        }
        else {
            $('body').fadeOut(500);

            var score = this._tmpScore;
            $.post('https://g.api.troncell.com/api/UserAction/PostDataByUser', {
                OpenId: openId,
                actionId: actionid,
                QrType: 'AfterGame',
                SnsType: 'WeChat',
                Score: score,
                SecurityKey: securityKey
            }, function (result) {
                console.log(result)
                window.location.href = 'https://m.sensingstore.com/plane-ranking.html?actionId=' + actionid;
            })



            // $.ajax({
            //     url: "/action/updatescore",
            //     data: {
            //         actionId: actionid,
            //         score: this._tmpScore
            //     },
            //     success: function (data) {
            //         if (data.status.toLowerCase() == "ok") {
            //             console.log("update score successfully!");
            //             var gameResultUrl = "http://game.troncell.com/GameResult/Transfer?actionId=" + actionid + "&openid=" + openid;
            //             window.location = gameResultUrl;
            //         }
            //     },
            //     error: function (error) {

            //         console.log("update score failed!");
            //         var scene = cc.Scene.create();
            //         scene.addChild(GameOver.create());
            //         cc.director.runScene(scene);
            //     }
            // });
        }

        //UpdateScore(actonid,this._tmpScore);


    },
    getQueryStringValue: function (key) {
        return decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }
});

GameLayer.create = function () {
    var sg = new GameLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

GameLayer.scene = function () {
    var scene = cc.Scene.create();
    //var layer = GameLayer.create();
    var bg = cc.Sprite.createWithSpriteFrameName("#bg01.png");
    bg.setAnchorPoint(0, 0);
    scene.addChild(bg, 1);
    return scene;
};

GameLayer.prototype.addEnemy = function (enemy, z, tag) {
    this._texTransparentBatch.addChild(enemy, z, tag);
};

GameLayer.prototype.addSupply = function (supplier, z, tag) {
    this._texTransparentBatch.addChild(supplier, z, tag);
};

GameLayer.prototype.addExplosions = function (explosion) {
    this._explosions.addChild(explosion);
};

GameLayer.prototype.addBulletHits = function (hit, zOrder) {
    this._texOpaqueBatch.addChild(hit, zOrder);
};

GameLayer.prototype.addSpark = function (spark) {
    this._texOpaqueBatch.addChild(spark);
};

GameLayer.prototype.addBullet = function (bullet, zOrder, mode) {
    this._texOpaqueBatch.addChild(bullet, zOrder, mode);
};

GameLayer.prototype.addSupplyEffect = function (effect) {
    this._texTransparentBatch.addChild(effect);
}
