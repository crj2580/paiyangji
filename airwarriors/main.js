window.onload = function () {
    cc.game.onStart = function () {
        //cc.path.pathStr = "cocos2d";
        // Pass true to enable retina display, disabled by default to improve performance
        //cc.view.enableRetina(false);
        // Adjust viewport meta
        cc.view.enableAutoFullScreen(true);
        cc.view.adjustViewPort(true);//设置html5的viewport meta属性
        // Setup the resolution policy and design resolution size
        cc.view.setDesignResolutionSize(320, 568, cc.ResolutionPolicy.FIXED_WIDTH);//设置画面尺寸和适配规则
        // The game will be resized when browser size change
        cc.view.resizeWithBrowserSize();//设置是否跟随浏览器窗口变化


        //load resources
        cc.LoaderScene.preload(g_mainmenu, function () {
            // console.log('new')
            cc.spriteFrameCache.addSpriteFrames(res.displayTexturePack_plist);
            cc.spriteFrameCache.addSpriteFrames(res.textureTransparentPack_plist);
            // cc.director.runScene(SysMenu.scene());

            // cc.LoaderScene.preload(g_maingame, function () {
                var scene = cc.Scene.create();
                scene.addChild(GameLayer.create());
                //scene.addChild(GameControlMenu.create());
                cc.director.runScene(scene);
            // }, this);

        }, this);
    };
    cc.game.run("gameCanvas");
};
