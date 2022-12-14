<template>
  <div id="app">
    <div class="basicLoading" v-show="loading">
      <img src="~@/assets/img/loading.gif" />
    </div>
    <div v-show="showMsg" class="basicMsg">
      <div style="padding: 6vw; font-size: 3.5vw">
        {{ showMsg }}
      </div>
    </div>

    <template v-if="status == 0">
      <div
        @click="goStatus1"
        style="position: fixed; left: 0; top: 0; width: 100%; height: 100%"
      >
        <img src="~@/assets/img/bg1.jpg" />

        <!-- <img
          id="startButton"
          src="~@/assets/img/goNow.png"
          style="position: absolute; left: 58%; top: 13%; width: 19%"
          alt=""
        /> -->
      </div>
    </template>

    <template v-if="status == 1">
      <img
        src="~@/assets/img/bg2.jpg"
        style="width: 100%; height: 100%"
        alt=""
      />
      <img
        src="~@/assets/img/hint.png"
        style="position: absolute; width: 100%; height: 100%; left: 0; top: 0"
        alt=""
      />
      <div
        class="canvasContainer"
        ref="canvasContainer"
        style="
          position: absolute;
          width: 70vw;
          height: 38vw;
          left: 20vw;
          top: 11vw;
          box-sizing: border-box;
        "
      ></div>
      <img
        src="~@/assets/img/bird.png"
        style="position: absolute; width: 100%; height: 100%; left: 0; top: 0"
        alt=""
      />

      <div
        @click="reset"
        style="
          position: absolute;
          width: 4vw;
          top: 18vh;
          height: 20vh;
          left: 91vw;
          opacity: 0;
        "
      >
        <img src="~@/assets/img/clear.png" style="width: 100%" />
      </div>
      <div
        id="submit"
        @click="submit"
        style="
          position: absolute;
          width: 4vw;
          top: 40vh;
          height: 20vh;
          left: 91vw;
          opacity: 0;
        "
      >
        <img src="~@/assets/img/submit1.png" style="width: 100%" />
      </div>

      <div
        @click="status = 0"
        style="
          position: absolute;
          width: 4.7vw;
          left: 90.4vw;
          top: 5vh;
          opacity: 0;
        "
      >
        <img src="~@/assets/img/go_index.png" style="width: 100%" />
      </div>
    </template>
  </div>
</template>

<script>
$.ajaxSetup({
  timeout: 10000,
  error: function (jqXHR, textStatus, errorThrown) {
    switch (jqXHR.status) {
      case 500:
        console.log("服务器系统内部错误");
        break;
      case 401:
        console.log("未登录");
        break;
      case 403:
        console.log("无权限执行此操作");
        break;
      case 408:
        console.log("请求超时");
        break;
      default:
        console.log("未知错误");
    }
    setTimeout(function () {
      // window.location.reload();
    }, 3000);
  },
  success: function (data) {
    console.log("操作成功");
  },
});

if (typeof global != "undefined") {
  //electron环境
  var dgram = require("dgram");
  var udp_client = dgram.createSocket("udp4");

  udp_client.on("close", function () {
    console.log("udp client closed.");
  });
  //错误处理
  udp_client.on("error", function () {
    console.log("some error on udp client.");
  });
}
import { Signature } from "./lsignature";
const log = require('electron-log');
const path = require("path");
const fs = require("fs");
var app = require("electron").remote.app;
var configDir = `${path.dirname(app.getPath("exe"))}\\config`;
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir);
}
const config = require("electron-json-config").factory(
  `${configDir}\\config.json`,
  "config.json"
);
console.log(config.file);
if (!config.has("ip")) {
  config.setBulk({
    ip: "127.0.0.1",
    port: 5678,
  });
}
log.info('Hello, log');
export default {
  name: "a2",
  data: function () {
    return {
      loading: false,
      showMsg: null,
      actionId: null,
      mySignature: null,
      status: 0, //0准备 1写字板
      ip: config.get("ip", "127.0.0.1"),
      port: config.get("port", 5678),
    };
  },
  mounted() {},
  methods: {
    goStatus1() {
      this.status = 1;
      this.sendUDP("0");
      var _this = this;
      this.$nextTick(function () {
        _this.initCanvas();
      });
    },
    initCanvas() {
      this.mySignature = new Signature(this.$refs.canvasContainer, {
        strokeStyle: "black",
      });
    },
    reset() {
      this.mySignature.reset();
    },
    submit() {
      var bgImg = new Image(),
        signatureImg = new Image();
      //bgImg.src = this.bgBase64;
      bgImg.src = `${require("./assets/img/base64bg.png")}`;

      bgImg.onload = () => {
        signatureImg.src = this.mySignature.getImage();
      };
      signatureImg.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = 535;
        canvas.height = 477;
        var context = canvas.getContext("2d");
        context.drawImage(bgImg, 0, 0, 535, 477);
        console.log(
          `signatureImg ${signatureImg.width} ${signatureImg.height}`
        );
        context.drawImage(signatureImg, 49, 130, 444, 196);
        var outputBase64 = canvas.toDataURL("image/png");
        //console.log("outputBase64", outputBase64);

        this.PostPlayerData4ActionQrcode(outputBase64);
      };
    },

    PostPlayerData4ActionQrcode(outputBase64) {
      var _this = this;
      this.loading = true;
      var fd = new FormData();
      fd.append("PlayerImage", this.dataURItoBlob(outputBase64), "image.png");

      $.ajax({
        url: `http://${config.get('ip','127.0.0.1')}:5000/UserAction`,
        method: "POST",
        processData: false, // 必须
        contentType: false, // 必须
        dataType: "json",
        data: fd,
        success(data) {
          _this.loading = false;
          _this.actionId = data.result.actionId;
          _this.sendUDP(_this.actionId + "");
          _this.showMsg = "提交成功";
          setTimeout(function () {
            _this.showMsg = null;
            _this.status = 0;
          }, 2000);
        },
      });
    },
    dataURItoBlob(base64Data) {
      var byteString;
      if (base64Data.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(base64Data.split(",")[1]);
      else byteString = unescape(base64Data.split(",")[1]);
      var mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0];
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeString });
    },
    sendUDP(msg) {
      if (typeof global != "undefined") {
        //electron环境
        var SendBuff = msg;
        var SendLen = SendBuff.length;
        udp_client.send(SendBuff, 0, SendLen, this.port, this.ip);
      }
    },
  },
};
</script>

<style>
img {
  pointer-events: none;
}
/* loading Gif */
.basicLoading {
  z-index: 9999;
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  top: 0;
  left: 0;
}
.basicLoading > img {
  width: 12%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.basicLoading > img + div {
  position: absolute;
  top: 50%;
  margin-top: 9vw;
  width: 100%;
  text-align: center;
  color: #eee;
}
.basicMsg {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
}
.basicMsg > div {
  position: absolute;
  width: 60vw;
  background: rgba(0, 0, 0, 0.7);
  text-align: center;
  box-sizing: border-box;
  border-radius: 5vw;
  color: #fff;
  padding: 20px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

#app {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  font-family: "黑体";
  color: #fff;

  user-select: none;
  -ms-user-select: none;
}

#startButton,
#submit {
  animation: scaleButton 2s linear infinite;
}

@keyframes scaleButton {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }

  100% {
    transform: scale(1);
  }
}

.canvasContainer {
  /* clip-path: polygon(
    8% 0,
    93% 0,
    100% 15%,
    100% 80%,
    85% 100%,
    15% 100%,
    0 80%,
    0 15%
  ); */
}
</style>
