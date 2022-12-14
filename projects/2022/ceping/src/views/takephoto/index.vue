<template>
  <div id="box">
    <!-- 相机页面 -->
    <div class="camera">
      <video id="video" ref="video" v-show="showvideo"></video>
    </div>
    <!-- 拍摄成品 剪裁区域为1080x1500  -->
    <canvas width="1080" height="1500" id="canvas" ref="canvas"></canvas>
    <div class="output">
      <img id="photo" ref="photo" style="display: none" />
    </div>
    <!-- 拍摄按钮和文字 -->
    <img
      src="~assets/img/pingce04/4-button.png"
      id="startbutton"
      ref="startbutton"
      @click="takepicture()"
      v-show="showbutton"
    />
    <!-- 微信二维码 -->
    <div v-if="wechartShow" class="weixinDiv">
      <div class="weixinTimerCount">{{ timerCount }}S</div>
    </div>
    <div v-if="wechartShow">
      <transition name="slide-fade">
        <img :src="qrCodeImage" class="weixincode" />
      </transition>
      <img src="~assets/img/pingce04/weixin.png" class="weixinInfo" />
    </div>
    <!-- <canvas id="canvas"></canvas> -->

    <div id="box2" v-if="showphoto">
      <div class="gohome" @click="goHome">
        <img src="~assets/img/pingce02/home.png" />
      </div>
      <div class="again" @click="takeagain">
        <img src="~assets/img/pingce04/photoagain.png" />
      </div>
      <!-- 拍摄成品 -->
     <div id="box4">
      <div id="box3"></div>
      <img id="jietuphoto" class="jietuphoto" :src="picture" />
     </div>

      <!-- 装饰部分 -->
      <!-- 分数和等级-->
      <div class="score">
        <span class="text">{{ score }}</span>
      </div>
      <div class="level">
        <span v-if="score <= 45">入门阶段</span
        ><span v-else-if="score <= 65">进阶阶段</span
        ><span v-else>高级阶段</span>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import $ from "jquery";
export default {
  name: "TakePhoto",
  data() {
    return {
      securityKey: "cace045bc83746fd8580767adc966023",
      score: 0,
      video: null,
      mediaStream: null,
      canvas: null,
      photo: null,
      startbutton: null,
      width: 1080,
      height: 1080,
      streaming: false,
      // 显示相机
      showvideo: true,
      // 显示相片
      showphoto: false,
      // 显示拍照按钮
      showbutton: true,
      // html2canvas
      imgUrl: "",
      picture: "",
      // 定时器
      timerCount: 20,
      // 隐藏微信区
      wechartShow: false,
      // 二维码
      qrCodeImage: "",
    };
  },
  mounted() {
    this.startup();
    this.getscore();
    // 调用定时器方法
    this.setTime();
  },
  beforeRouteLeave(to, form, next) {
    this.stopBothVideoAndAudio(this.mediaStream);
    next();
  },
  destroyed() {},
  methods: {
    //  base64转码
    base64ToBlob: function ({
      b64data = "",
      contentType = "",
      sliceSize = 512,
    } = {}) {
      return new Promise((resolve, reject) => {
        // 使用 atob() 方法将数据解码
        let byteCharacters = atob(b64data);
        let byteArrays = [];
        for (
          let offset = 0;
          offset < byteCharacters.length;
          offset += sliceSize
        ) {
          let slice = byteCharacters.slice(offset, offset + sliceSize);
          let byteNumbers = [];
          for (let i = 0; i < slice.length; i++) {
            byteNumbers.push(slice.charCodeAt(i));
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }
        let result = new Blob(byteArrays, {
          type: contentType,
        });
        resolve(result);
      });
    },
    // stop both mic and camera
    stopBothVideoAndAudio(stream) {
      stream.getTracks().forEach(function (track) {
        if (track.readyState == "live") {
          track.stop();
        }
      });
    },
    // 发请求
    PostPlayerData4ActionQrcode() {
      var _this = this;
      let base64 = this.imgUrl.split(",")[1];
      this.base64ToBlob({ b64data: base64, contentType: "image/jpeg" }).then(
        (res1) => {
          let formData = new FormData();
          formData.append("PlayingImage", res1, "upload.jpeg");
          $.ajax({
            type: "post",
            contentType: false,
            processData: false,
            url: `https://activity.api.troncell.com/api/UserAction/PostPlayerData4ActionQrcode?QrType=AfterGame&SnsType=WeChat&SecurityKey=${this.securityKey}`,
            data: formData,
            success(res) {
              console.log(res);
              _this.qrCodeImage = res.result.qrCodeImage;
            },
          });
        }
      );
    },
    // 获得分数 下面是拍照逻辑
    getscore() {
      this.score = this.$route.params.score;
    },
    // 微信扫码定时器
    setTime() {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.timerCount--;
        if (this.timerCount === 0) {
          clearInterval(this.timer); // 清除定时器
          this.wechartShow = false;
        }
      }, 1000);
    },
    // 拍照功能代码
    showViewLiveResultButton() {
      if (window.self !== window.top) {
        document.querySelector(".contentarea").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener("click", () => window.open(location.href));
        return true;
      }
      return false;
    },
    startup() {
      if (this.showViewLiveResultButton()) {
        return;
      }
      this.video = this.$refs.video;
      this.canvas = this.$refs.canvas;
      this.photo = this.$refs.photo;
      this.startbutton = this.$refs.startbutton;
      var that = this;
      navigator.mediaDevices
        .getUserMedia({
          video: { width: 1920, height: 1080 }, //强制分辨率1920x1080
          audio: false,
        })
        .then(function (stream) {
          that.mediaStream = stream;
          that.video.srcObject = stream;
          that.video.play();
        })
        .catch(function (err) {
          console.log("An error occurred: " + err);
        });
      this.video.addEventListener(
        "canplay",
        function (ev) {
          if (!that.streaming) {
            console.log(video.videoWidth,video.videoHeight)
           
           
          }
        },
        false
      );
      this.clearphoto();
    },
    clearphoto() {
      var context = this.canvas.getContext("2d");
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      var data = this.canvas.toDataURL("image/png");
      this.photo.setAttribute("src", data);
    },
    // 点击拍照
    takepicture() {
      // 清除定时器
      clearInterval(this.timer);
      this.timerCount = 20;
      var context = this.canvas.getContext("2d");
      if (this.width && this.height) {
        //这里模拟css缩放
        context.drawImage(video, 0, 0, this.video.videoWidth, this.video.videoHeight,-793,0,2666,1500);
        var data = this.canvas.toDataURL("image/png");
        this.photo.setAttribute("src", data);
        this.picture = data;
        console.log(this.video.videoWidth)
        console.log("this.canvas",this.canvas.width, "this.canvas.height", this.canvas.height);
      } else {
        this.clearphoto();
      }
      // 显示相片
      this.showvideo = false;
      this.showphoto = true;
      // 调用截图方法
      this.$nextTick(() => {
        this.toImage();
      });
      // 调用定时器方法
      this.setTime();
      // 显示微信区
      this.wechartShow = true;
      // 隐藏拍照按钮
      this.showbutton = false;
    },
    // 再次拍照
    takeagain() {
      this.showvideo = true;
      this.showphoto = false;
      (this.imgUrl = ""),
        (this.picture = ""),
        // 隐藏微信区
        (this.wechartShow = false);
      // 显示拍照按钮
      this.showbutton = true;
      // 清除定时器
      clearInterval(this.timer);
      this.timerCount = 20;
    },
    //回到首页
    goHome() {
      this.$router.push("/home");
    },
    // html2canvas
    // 页面元素转图片
    toImage() {
      html2canvas(document.getElementById("box4")).then((canvas) => {
        let dataURL = canvas.toDataURL("image/jpeg", 0.8);
        this.imgUrl = dataURL;
        // console.log(this.imgUrl);
        console.log(this.imgUrl);
        if (this.imgUrl !== "") {
          this.dialogTableVisible = true;
        }
        // 调用API方法
        this.PostPlayerData4ActionQrcode();
      });
    },
  },
};
</script>

<style>
@font-face {
  font-family: "演示悠然小楷";
  src: url(../../assets/font/演示悠然小楷.ttf);
  font-family: "fangong";
  src: url(../../assets/font/fangong.ttf);
}
#video {
   object-fit: cover;
    width: 2666px; 
    height: 1500px;  /**拍照区域的高度最小1500，这里等比缩放适应*/
    position: absolute;
    top: 0;
    left: -793px;
    z-index: -1;
}

#photo {
  width: 700px;
  height: 1338px;
  position: absolute;
  top: 180px;
  left: 168px;
  z-index: -1;
}

#canvas {
  display: none;
}

.camera {
  position: relative;
  width: 100vw;
  height: 100vh;
}
.output {
  width: 340px;
  display: inline-block;
  vertical-align: top;
}
#startbutton {
  position: absolute;
  right: 96px;
  top: 510px;
  z-index: 100;
}
/* 再拍一次 */
#box .photoagain {
  position: absolute;
  left: 480px;
  bottom: 236px;
  transform: scale(1.8);
}
#box .againphotoInfo {
  position: absolute;
  right: 423px;
  bottom: 127px;
  font-size: 40px;
  font-weight: bold;
  color: #ff1111;
  text-shadow: 2px 2px 4px #ffffff;
  z-index: 100;
}
#box .takephotoInfo {
  position: absolute;
  right: 132px;
  top: 715px;
  font-size: 38px;
  font-weight: bold;
  color: #ff1111;
  text-shadow: 2px 2px 4px #ffffff;
  z-index: 100;
}
#box2 {
  width: 100vw;
  height: 100vh;
  background: url(~assets/img/pingce04/5.png) no-repeat center;
  position: absolute;
  z-index: 100;
  top: 0;
}
#box {
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  overflow-y: hidden;
  background: url(~assets/img/pingce04/4.png) no-repeat center;
}
#box .biankuang {
  position: absolute;
  left: 0vw;
  bottom: 0vh;
  z-index: 101;
}
#box .qianbi {
  position: absolute;
  right: 1vw;
  top: 1vh;
  z-index: 99;
}
/* 分数和等级 */
#box2 .score {
  position: absolute;
  top: 42vh;
  right: 18vw;
  font-size: 64px;
  font-family: "演示悠然小楷";
  color: #ffffff;
  width: 125px;
  height: 125px;
  background-image: url(../../assets/img/pingce04/5-score.png);
  background-size: cover;
  z-index: 102;
}
#box2 .score .text {
  position: absolute;
  top: 8px;
  right: 32px;
}
#box2 .level {
  position: absolute;
  width: 1em;
  left: 5vw;
  top: 21.4vh;
  font-size: 2em;
  font-weight: bold;
  color: #cf2e2e;
  font-family: "fangong";
  z-index: 102;
}
/* 拍照按钮 */
#box .takephoto {
  position: absolute;
  right: 9vw;
  top: 27vh;
}
#box .takephotoInfo {
  position: absolute;
  right: 12vw;
  top: 38vh;
  font-size: 2.5em;
  font-weight: bold;
  color: #ff1111;
  text-shadow: 2p 2px 4px #ffffff;
}
/* 微信 */
#box .weixinInfo {
  position: absolute;
  right: 18vw;
  bottom: 3vh;
}
#box .weixinDiv {
  position: absolute;
  left: 22vw;
  bottom: -0.5vh;
  z-index: 102;
  width: 60vw;
  height: 20vh;
  background-image: url(../../assets/img/pingce04/5-weixin.png);
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
#box .weixincode {
  width: 23vw;
  height: 13vh;
  position: absolute;
  right: 52vw;
  bottom: 3vh;
  z-index: 101;
}

/* 再次游戏和返回首页 */
#box .again {
  position: absolute;
  right: 2vw;
  bottom: 66vh;
}
#box .gohome {
  position: absolute;
  right: 2vw;
  bottom: 44vh;
}
#box4 {
  position: absolute;
  width: 710px;
  height: 1250px;
  left: 190px;
  top: 190px;
  background: url(~assets/img/pingce04/4.png) no-repeat center;
  background-size: contain;
  z-index: 52;
}

#box3 {
  position: absolute;
  width: 710px;
  height: 1250px;
 
  background: url(~assets/img/pingce04/4.png) no-repeat ;
  background-size: 100% 100%;
  z-index: 52;
}

.jietuphoto {
  position: absolute;
  left: 1px;
  top: 0;
  width: 709px;
  height: 930px;
  z-index: -12;
}
.weixinTimerCount {
  position: absolute;
  left: 350px;
  top: 60px;
  font-size: 48px;
  font-family: "思源黑体";
  color: #ffffff;
}
</style>