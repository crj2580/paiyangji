<template>
  <div id="box">
    <!-- 相机页面 -->
    <div class="camera">
      <video id="video" ref="video" v-show="showvideo"></video>
    </div>
     <!-- 拍摄成品 -->
    <canvas id="canvas" ref="canvas"></canvas>
    <div class="output">
      <img id="photo" ref="photo" style="display:none"/>
    </div>
      <!-- 拍摄按钮和文字 -->
      <img
        src="~assets/img/pingce04/takephoto.png"
        id="startbutton"
        ref="startbutton"
        @click="takepicture()"
        v-show="showbutton"
      />
      <span class="takephotoInfo" v-show="showbutton">点我拍照</span>
      <!-- 微信二维码 -->
      <div v-if="wechartShow">
        <transition name="slide-fade">
          <img :src="qrCodeImage" class="weixincode">
        </transition>
        <img src="~assets/img/pingce04/weixin.png" class="weixinInfo">
        <span class="time">{{timerCount}} S</span>
      </div>
      <!-- 下面按钮 -->
      <div>
        <img src="~assets/img/pingce04/photoagain.png" class="again" @click="takeagain()">
        <img src="~assets/img/pingce04/home.png" class="gohome" @click="$router.push('/home')">
      </div>
    <!-- <canvas id="canvas"></canvas> -->

    <div id="box2" style="border:1px solid #0000;">
      <!-- 拍摄成品 -->
     <img class="jietuphoto" :src="picture" />

      <!-- 装饰部分 -->
      <!-- logo -->
      <img
        src="~assets/img/pingce04/logo.png"
        style="position: absolute; left: 8vw; top: 8vh; z-index: 103"
      />
      <!-- 分数和等级-->
      <span class="score">{{ score }}</span>
      <div class="level">
        <span v-if="score <= 45">入门</span
        ><span v-else-if="score <= 65">进阶</span><span v-else>高级</span>
      </div>
      <!-- 边框装饰和铅笔 -->
      <div class="biankuang">
        <img src="~assets/img/pingce04/zhuangshi.png" />
      </div>
      <div class="qianbi">
        <img src="~assets/img/pingce04/pencil.png" />
      </div>
      <!-- 字母 -->
      <img src="~assets/img/pingce04/A.png" class="zimuA" />
      <img src="~assets/img/pingce04/B.png" class="zimuB" />
      <img src="~assets/img/pingce04/C.png" class="zimuC" />
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import $ from 'jquery'
export default {
  name: "TakePhoto",
  data() {
    return {
      securityKey: "cace045bc83746fd8580767adc966023",
      score: 0,
      video: null,
      mediaStream:null,
      canvas: null,
      photo: null,
      startbutton: null,
      width: 320,
      height: 0,
      streaming: false,
      // 显示相机
      showvideo: true,
      // 显示相片
      showphoto: false,
      // 显示拍照按钮
      showbutton: true,
      // html2canvas
      imgUrl: "",
      picture: '',
      // 定时器
      timerCount: 20,
      // 隐藏微信区
      wechartShow: false,
      // 二维码
      qrCodeImage: '',
    };
  },
  mounted() {
    this.startup();
    this.getscore();
    // 调用定时器方法
    this.setTime()
    
  },
  beforeRouteLeave(to, form, next) {
    this.stopBothVideoAndAudio(this.mediaStream);
    next()
  },
  destroyed() {
    
  },
  methods: {
    //  base64转码
     base64ToBlob: function ({ b64data = '', contentType = '', sliceSize = 512 } = {}) {
        return new Promise((resolve, reject) => {
          // 使用 atob() 方法将数据解码
          let byteCharacters = atob(b64data);
          let byteArrays = [];
          for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);
            let byteNumbers = [];
            for (let i = 0; i < slice.length; i++) {
              byteNumbers.push(slice.charCodeAt(i));
            }
            byteArrays.push(new Uint8Array(byteNumbers));
          }
          let result = new Blob(byteArrays, {
            type: contentType
          })
          resolve(result)
        })
      },
    // stop both mic and camera
    stopBothVideoAndAudio(stream) {
        stream.getTracks().forEach(function(track) {
            if (track.readyState == 'live') {
                track.stop();
            }
        });
    },
    // 发请求
    PostPlayerData4ActionQrcode() {
      var _this = this
      let base64 = this.imgUrl.split(',')[1]
      this.base64ToBlob({ b64data: base64, contentType: 'image/jpeg' }).then(res1 => {
        let formData = new FormData();
        formData.append("PlayingImage", res1,'upload.jpeg');
        $.ajax({
          type: 'post',
          contentType: false,
          processData: false,
          url: `https://activity.api.troncell.com/api/UserAction/PostPlayerData4ActionQrcode?QrType=AfterGame&SnsType=WeChat&SecurityKey=${this.securityKey}`,
          data: formData,
          success(res) {
            console.log(res);
            _this.qrCodeImage = res.result.qrCodeImage
            
          }
        })
      })
      
      
    },
    // 获得分数 下面是拍照逻辑
    getscore() {
      this.score = this.$route.params.score;
    },
    // 微信扫码定时器
    setTime() {
        if (this.timer) clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.timerCount--
          if (this.timerCount === 0) {
          clearInterval(this.timer) // 清除定时器
          this.wechartShow = false
        }
        }, 1000)
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
      this.video = this.$refs.video
      this.canvas = this.$refs.canvas
      this.photo = this.$refs.photo
      this.startbutton = this.$refs.startbutton
      var that = this;
      navigator.mediaDevices
        .getUserMedia({
          video: true,
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
            that.height =
              that.video.videoHeight / (that.video.videoWidth / that.width);
            if (isNaN(that.height)) {
              that.height = that.width / (4 / 3);
            }
            that.video.setAttribute("width", that.width);
            that.video.setAttribute("height", that.height);
            that.canvas.setAttribute("width", that.width);
            that.canvas.setAttribute("height", that.height);
            that.streaming = true;
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
      clearInterval(this.timer)
      this.timerCount = 20
      var context = this.canvas.getContext("2d");
      if (this.width && this.height) {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        context.drawImage(video, 0, 0, this.width, this.height);
        var data = this.canvas.toDataURL("image/png");
        this.photo.setAttribute("src", data);
        this.picture = data
      } else {
        this.clearphoto();
      }
      // 显示相片
      this.showvideo = false;
      // 调用截图方法
      this.$nextTick(() => {
        this.toImage()
      })
      // 调用定时器方法
      this.setTime()
      // 显示微信区
      this.wechartShow = true
      // 隐藏拍照按钮
      this.showbutton = false
    },
    // 再次拍照
    takeagain() {
      this.showvideo = true;
      this.imgUrl = "",
      this.picture = "",
      // 隐藏微信区
      this.wechartShow = false
      // 显示拍照按钮
      this.showbutton = true
      // 清除定时器
      clearInterval(this.timer)
    　this.timerCount = 20;
    },
    // html2canvas
    // 页面元素转图片
    toImage() {
      html2canvas(document.getElementById("box2")).then((canvas) => {
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
#video {
  object-fit: fill;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
}
#photo {
  object-fit: fill;
  width: 700px;
  height: 1338px;
  position: absolute;
  top: 180px;
  left: 168px;
  z-index: 10;
}
#canvas {
  display: none;
}
.camera {
  position: relative;
  top: 145px;
  left: 171px;
  width: 70vw;
  height: 66vh;
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
  width: 77vw;
  height: 79vh;
  border: 1px solid red;
  position: absolute;
  left: 13vw;
  top: 3vh;
}
#box2 .jietuphoto {
 width: 70vw;
 height: 66vh;
 position: absolute;
 top: 5vh;
 left: 3vw;
}
#box {
 	width: 100vw;
	height: 100vh;
  margin: 0 auto;
  position: relative;
  background: url(~assets/img/pingce04/bg1.jpg) no-repeat center;
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
#box .score {
  position: absolute;
  bottom: 9.5vh;
  right: 33vw;
  font-size: 2em;
  font-weight: bold;
  color: #cf2e2e;
  z-index: 102;
}
#box .level {
  position: absolute;
  right: 20.5vw;
  bottom: 8vh;
  font-size: 2em;
  font-weight: bold;
  color: #cf2e2e;
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
#box .zimuA {
  position: absolute;
  top: 16vh;
  left: 2vw;
  z-index: 99;
  animation: rotate 1.5s linear infinite;
}
#box .zimuB {
  position: absolute;
  bottom: 23vh;
  left: 2vw;
  z-index: 99;
  animation: rotate 1s linear infinite;
}
#box .zimuC {
  position: absolute;
  bottom: 35vh;
  right: 4vw;
  z-index: 99;
  animation: rotate .5s linear infinite;
}
/* 微信 */
#box .weixinInfo {
  position: absolute;
  right: 18vw;
  bottom: 3vh;
}
#box .weixincode {
  width: 22vw;
  height: 12vh;
  position: absolute;
  right: 47vw;
  bottom: 3vh;
  z-index: 103;
}
#box .time{
  position: absolute;
  right: 25vw;
  bottom: 10vh;
  color: #cf2e2e;
  font-size: 6em;
}
/* 再次游戏和返回首页 */
#box .again {
  position: absolute;
  left: 10vw;
  bottom: 5vh;
  transform: scale(1.2);
}
#box .gohome {
  position: absolute;
  right: 10vw;
  bottom: 5vh;
  transform: scale(1.2);
}
/* 弹跳动画 */
  @keyframes rotate {
    0% {
      transform: translateY(0);
    }
    25% {
      transform: translateY(10px);
    }
    50% {
      transform: translateY(30px) scale(1.1, 0.9);
    }
    75% {
      ransform: translateY(10px);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>