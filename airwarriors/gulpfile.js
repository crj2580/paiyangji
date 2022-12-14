/**
 * Created by wulix on 2016/7/25.
 */
"use strict";

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

var paths = {
    jsdes : "./app/",
    jssrcroot:"./src/"
};

var jsList = [];
jsList.push("./src/Resource.js");
jsList.push("./src/GameServices.js");
jsList.push("./src/config/GameConfig.js");
jsList.push("./src/config/EnemyType.js");
jsList.push("./src/config/Level.js");

jsList.push("./src/HitEffect.js");
jsList.push("./src/Effect.js");
jsList.push("./src/SparkEffect.js");
jsList.push("./src/Explosion.js");
jsList.push("./src/Background.js");
jsList.push("./src/Life.js");
jsList.push("./src/Bullet.js");
jsList.push("./src/Enemy.js");
jsList.push("./src/Ship.js");
jsList.push("./src/Supply.js");

jsList.push("./src/SettingsLayer.js");
jsList.push("./src/LevelManager.js");
jsList.push("./src/GameOver.js");
jsList.push("./src/GameLayer.js");
jsList.push("./src/SysMenu.js");
jsList.push("./src/StartScene.js");

paths.js = paths.jssrcroot + "*.js";
paths.configJs = paths.jssrcroot + "config/*.js";
paths.minJs = paths.jsdes + "*.min.js";
paths.concatJsDest = paths.jsdes + "airwarriors.min.js";
paths.cocos2d = "cocos2d-js-v3.12-troncell.js";

gulp.task("min:js",function () {
   return gulp.src(jsList,{base:'.'})
       .pipe(concat(paths.concatJsDest))
       .pipe(uglify())
       .pipe(gulp.dest("."));
});





