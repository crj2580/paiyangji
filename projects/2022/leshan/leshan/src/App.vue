<script setup>
import { onMounted, reactive, ref, getCurrentInstance, computed } from "vue";
import axios from "axios";
import TweenMax from "gsap";
import SensingDevice from "./assets/js/sensing-device-sdk-quorra-1.0.js"
import PickupCodeView from "./components/PickupCodeView.vue";
import GoAnswerButtonView from "./components/GoAnswerButtonView.vue";
import RestartAnswerButtonView from "./components/RestartAnswerButtonView.vue";
import OptionBoxView from "./components/OptionBoxView.vue";

let logicType = ref(1);
let loading = ref(false);
let hasWrong = ref(false);
let realQuestionIndex = ref(0);
let qrCodeImage = ref("");
let realQuestionList = ref([]);
let totalQuestionList = ref([]);
let questionNeedLength = ref(4);
let timeCount = ref(0);
let showMsg = ref(null);
let returnTimeout = ref(null);
let actionDataByIdTimer = ref(null);
let timer = ref(null);
let codeList = ref([]);
let subKey = ref("");
let securityKey = ref("");
let keyList = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, "首页", 0, "清除"]);
let qrcode = ref("");
let wrongCode = ref(false);
const MaxWordLength = ref(8);
let actionId = ref(null);
let openId = ref("");
let errorAnswer = ref(0)

const mSensingDevice = SensingDevice.getInstance()

function kindId(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  // console.log(name, r);
  if (r != null) {
    return decodeURI(r[2]);
  } else {
    return false;
  }
}



securityKey.value = mSensingDevice.getSecurityKey() || "89e42477939341aa97834bc1e166a35c"; //troncellshow 游戏密钥
subKey.value = mSensingDevice.getSubKey() || "abea5e5a22804fa7bdcf66d09cd5d1cf";  // 设备密钥

const clickButton = () => {
  if (logicType.value == 1) {
    goAnswerQuestion();
  } else if (logicType.value == 2) {
    returnToLogicType1();
  }
};

// 去答题
const clickButton1 = () => {
  if (logicType.value == 1) {
    goAnswerQuestion();
  } else if (logicType.value == 2 || logicType.value == 3) {
    returnToLogicType1();
  }
}

// 去输入验证码
const clickButton2 = () => {
  logicType.value = 3;
}

// 返回首页
const returnHome = () => {
  errorAnswer.value = 0
  clearAndStartTimer();
  returnToLogicType1();
}

// 继续答题
const continuer = () => {
  hasWrong.value = true;
  clearAndStartTimer();
  realQuestionIndex.value++;
};

// 随机选取题目
const goAnswerQuestion = () => {
  hasWrong.value = false;
  errorAnswer.value = 0
  realQuestionIndex.value = 0;
  qrCodeImage.value = "";
  realQuestionList.value = JSON.parse(JSON.stringify(totalQuestionList.value))
    .sort(() => {
      return Math.random() - 0.5;
    })
    .slice(0, questionNeedLength.value)
    .map((item) => {
      // console.log('item', item);
      return {
        id: item.id,
        title: item.title,
        hasSelected: false,
        questionItems: item.questionItems.map((answer) => {
          return {
            content: answer.content,
            isAnswer: answer.isAnswer,
            hasSelected: false,
          };
        }),
      };
    });
  realQuestionList.value.push({
    id: 99999,
    title: "请问您对乐山市商业银行是否满意？",
    hasSelected: false,
    questionItems: [
      { content: '非常满意', isAnswer: true, hasSelected: false },
      { content: '满意', isAnswer: true, hasSelected: false },
      { content: '基本满意', isAnswer: true, hasSelected: false },
      { content: '不满意', isAnswer: true, hasSelected: false },
    ]
  })
  console.log("realQuestionList", realQuestionList.value);
  clearAndStartTimer();
  logicType.value = 2;
};

// 定时器
const clearAndStartTimer = (time) => {
  clearInterval(timer.value);
  timeCount.value = time ? time : 100000;
  showMsg.value = null;
  timer.value = setInterval(() => {
    timeCount.value--;
    if (timeCount.value <= 0) {
      clearInterval(timer.value);
      returnToLogicType1();
    }
  }, 1000);
};

// 返回首页
const returnToLogicType1 = () => {
  clearTimeout(returnTimeout.value);
  clearTimeout(actionDataByIdTimer.value);
  clearInterval(timer.value);
  codeList.value = [];
  logicType.value = 1;
  showMsg.value = null;
  GetCargoRoads();
  // console.log("codeListaaaaaaa", codeList.value);
};

// 获取货道
const GetCargoRoads = () => {
  axios.get(
    "https://smartdevice.api.troncell.com/api/services/app/SensingDevice/GetCargoRoads",
    {
      params: {
        Subkey: subKey.value,
        MaxResultCount: 999,
        SkipCount: 0,
      },
    }
  )
    .then((result, status) => {
      console.log("result", result);
      if (result) {
        var cargoList = result.data.result.items;
        console.log("货道列表", cargoList);
        if (
          result.data.result.items.every((item) => {
            return item.cargoThings[0].stock == 0;
          })
        ) {
          showMsg.value = "缺货中,请联系工作人员补货";
        }
      }
    });
};

// 点击键盘按钮
const clickKey = (item) => {
  if (loading.value) return;
  if (typeof item === "number") {
    codeList.value.push(item);
    if (codeList.value.length == 6) {
      checkCode();
      setTimeout(() => {
        returnToLogicType1()
      }, 2000)
    }
  } else if (item == "首页") {
    returnToLogicType1()
  } else if ((item = "清除")) {
    codeList.value.pop();
  }
};

// 检查兑换码 
const checkCode = (code) => {
  loading.value = true;
  axios.get(
    "https://order.api.troncell.com/api/services/app/SensingTicket/UseTicketByTicketNo",
    {
      params: {
        ticketNo: code ? code : codeList.value.join(""),
        securityKey: securityKey.value,
        subKey: subKey.value,
      },
    }
  )
    .then((result, status) => {
      loading.value = false;
      if (result) {
        if (result.data.result.success) {
          console.log('result.data.result', result.data.result.outerId)
          // playAudio("surprise");
          // doDropCargo(result.data.result.outerId);
          mSensingDevice.doDropCargo(result.data.result.outerId)
          // showMsg.value = result.data.result.outerId;
        } else {
          wrongCode.value = true;
          setTimeout(() => {
            wrongCode.value = false;
          }, 2000);
          codeList.value = [];
        }
      }
    });
};

//首页二维码
const PostPlayerData4ActionQrcode = () => {
  loading.value = true;
  axios({
    method: 'post',
    url: 'https://activity.api.troncell.com/api/UserAction/PostPlayerData4ActionQrcode',
    params: {
      QrType: "BeforeGame",
      SecurityKey: securityKey.value,
      IsSendWeChatMsg: false,
      SnsType: "WeChat",
      FromType: "mobile",
    }
  }).then((result) => {
    // console.log(result.data.result.qrCodeImage);
    loading.value = false;
    qrcode.value = result.data.result.qrCodeImage;
  })
};

// 答题情况
const selectAnswer = (answer) => {
  if (realQuestionList.value[realQuestionIndex.value].hasSelected) {
    return;
  }
  realQuestionList.value[realQuestionIndex.value].hasSelected = true;
  answer.hasSelected = true;
  // console.log(answer);
  if (answer.isAnswer) {
    if (realQuestionIndex.value < 4) {
      clearInterval(timer.value);
      setTimeout(() => {
        continuer();
      }, 1000);
    } else {
      // console.log("全部答对");
      if (errorAnswer.value < 3) {
        clearInterval(timer.value);
        setTimeout(() => {
          allRightShowQrcode();
        }, 1000)
      }
    }
  } else {
    // console.log("答错了");
    errorAnswer.value++;
    hasWrong.value = true;
    if (realQuestionIndex.value == 5) {//是最后一个
      if (errorAnswer.value >= 3) {
        showMsg.value = "您已经答错" + errorAnswer.value + "道题了，请重新答题";
        setTimeout(function () {
          showMsg.value = "";
        }, 2000)
      } else {
        clearInterval(timer.value);
        setTimeout(function () {
          allRightShowQrcode();
        }, 1000)
      }
    } else {
      if (errorAnswer.value >= 3) {
        showMsg.value = "您已经答错" + errorAnswer.value + "道题了，继续答题将不会获得奖品，是否继续?";
        setTimeout(function () {
          showMsg.value = "";
        }, 2000)
      } else {
        return
      }
    }
  }
};



// 生成二维码
const allRightShowQrcode = () => {
  loading.value = true;

  axios({
    method: 'post',
    url: 'https://activity.api.troncell.com/api/UserAction/PostPlayerData4ActionQrcode',
    params: {
      QrType: "AfterGame",
      SecurityKey: securityKey.value,
      IsSendWeChatMsg: false,
      SnsType: "WeChat",
      FromType: "mobile",
    }
  }).then((result) => {
    if (result) {
      // console.log("生成二维码信息", result.data.result);
      loading.value = false;
      actionId.value = result.data.result.actionId;
      qrCodeImage.value = result.data.result.qrCodeImage;
      // console.log('actionId.value', actionId.value)
      clearAndStartTimer(30);
      ActionDataById();
    }
  })
};

// 判断二维码是否被扫描
const ActionDataById = () => {
  axios({
    method: "post",
    url: "https://activity.api.troncell.com/api/UserAction/ActionDataById",
    params: {
      actionId: actionId.value,
    }
  }).then((result) => {
    // console.log("resultaaaaaaaaaaaaaaaaaaaaaaa", result);
    clearTimeout(actionDataByIdTimer.value);
    if (!result.data.result.snsUserInfo) {
      actionDataByIdTimer.value = setTimeout(() => {
        ActionDataById()
      }, 1000);
      console.log("未扫描");
    } else {
      console.log("已扫描");
      openId.value = result.data.result.snsUserInfo.openid;
      axios.get(
        "https://activity.api.troncell.com/api/services/app/SensingDeviceActivity/GetAwardsByUserAndAction",
        {
          params: {
            OpenId: openId.value,
            ActionId: actionId.value,
            QrType: "AfterGame",
            // SnsType: SnsType,
            SecurityKey: securityKey.value,
          },
        }
      )
        .then((result) => {
          // console.log("resultxxxxxxxxxxxxxxxxxxxxxxxx", result);
          if (result.data.result.canNextAward) {
            DoLotteryAwardByAction();
          } else {
            // alert("每天仅可参与一次，请把机会留给其他人");
            showMsg.value = "每天仅可参与一次，请把机会留给其他人";
            setTimeout(function () {
              returnToLogicType1();
            }, 3000);
          }
        });
    }
  });
};

const DoLotteryAwardByAction = () => {
  axios({
    method: "post",
    url: "https://activity.api.troncell.com/api/services/app/SensingDeviceActivity/DoLotteryAwardByAction",
    responseType: "json",
    responseEncoding: "utf8",
    data: {
      isNeedSendNotify: false,
      score: 0,
      actionId: actionId.value,
      securityKey: securityKey.value,
    },
  }).then((result) => {
    console.log('result', result)
    ConfirmUserAwardById(result.data.result.id);
    var ticketId = result.data.result.award.couponUrl.split("ticketId=")[1];
    console.log(ticketId);

    axios({
      method: "post",
      url: "https://order.api.troncell.com/api/services/app/SensingTicket/TakeTicketForActivity",
      responseType: "json",
      responseEncoding: "utf8",
      data: {
        ticket: ticketId,
        actionId: actionId.value,
        securityKey: securityKey.value,
        sendMessage: false,
      }
    }).then((result) => {
      console.log('resultresult', result)
      var code = result.data.result.ticketNo;
      checkCode(code);
    })
  })
};

const ConfirmUserAwardById = (userAwardId) => {
  axios({
    method: "post",
    url: "https://activity.api.troncell.com/api/services/app/SensingDeviceActivity/ConfirmUserAwardById",
    responseType: "json",
    responseEncoding: "utf8",
    data: {
      userAwardId: userAwardId,
      SecurityKey: securityKey.value,
    },
  }).then((message) => {
    console.log("message", message);
  });
};

const chooseRight = computed(() => {
  if (realQuestionList.value[realQuestionIndex.value]) {
    return realQuestionList.value[realQuestionIndex.value].questionItems.filter((item) => {
      return item.isAnswer
    })[0].hasSelected
  }
});


onMounted(() => {
  // clickButton();
  PostPlayerData4ActionQrcode();
  // TweenMax.to(".btn", 0.4, {
  //   scale: 0.9,
  //   yoyo: true,
  //   repeat: -1,
  //   ease: Power0.easeNone,
  // });

  loading.value = true;
  axios.get(
    "https://activity.api.troncell.com/api/services/app/SengsingDevice/GetPapersByTags",
    {
      params: {
        Tags: "答题",
        Subkey: subKey.value,
      },
    }
  )
    .then((result) => {
      returnToLogicType1();
      loading.value = false;
      console.log('resultxxxxxxxxx', result)
      totalQuestionList.value = result.data.result.items[0].questions.filter(
        (question) => {
          return question.questionItems.every((answer) => {
            return answer.content.length <= MaxWordLength.value;
          });
        });
    });
});
</script>

<template>
  <div id="app">
    <div class="basicLoading" v-show="loading">
      <!-- <img src="./assets/img/loading.gif" /> -->
    </div>

    <!-- 信息提示 -->
    <div v-show="showMsg" class="basicMsg">
      <div class="msg">{{ showMsg }}</div>
    </div>

    <!-- 首页背景视频 -->
    <video autoplay loop muted class="video">
      <source src="./assets/imgs/bg.mp4" type="video/mp4">
    </video>

    <!-- 首页文字标题 -->
    <img src="./assets/imgs/title.png" class="logotitle" alt="logoTitle">

    <!-- 首页二维码背景 -->
    <img v-show="logicType == 1" src="./assets/imgs/qrcodeBg.png" class="qrcodeBg" alt="qrcodeBg">

    <!-- 首页二维码图片 -->
    <img v-show="logicType == 1" :src="qrcode" class="qrcode" />

    <!-- 答题背景 -->
    <img v-show="logicType == 2 && !qrCodeImage || logicType == 3" src="./assets/imgs/bg-above4.png" class="answerBg"
      alt="答题背景" />

    <!-- 游戏说明 -->
    <img src="./assets/imgs/gameExplain.png" class="gameExplain" alt="">

    <!-- 验证码页面背景图 -->
    <!-- <img v-show="logicType == 3" src="./assets/imgs/bg-above.png" alt=""> -->

    <!-- 返回按钮 -->
    <div v-show="logicType == 2 && !qrCodeImage && !hasWrong" @click="returnHome" class="gohome">
      <img src="./assets/imgs/returnHome.png" alt="">
    </div>

    <!-- 答题&返回按钮 -->
    <GoAnswerButtonView :logicType="logicType" :clickButton1="clickButton1" :clickButton2="clickButton2" />

    <!-- 键盘 -->
    <PickupCodeView :data="{ logicType, loading, securityKey, subKey, codeList, keyList, wrongCode }"
      :clickKey='clickKey' />

    <!-- 题目 -->
    <div v-if="logicType == 2" class="logic_2">
      <!-- 答题成功后返回的二维码 -->
      <template v-if="qrCodeImage">

        <!-- 倒计时 -->
        <div class="logicCount">{{ timeCount }}s</div>

        <!-- 答题成功后背景 -->
        <img src="./assets/imgs/bg-above3.png" class="successBg" alt="successBg" />

        <!-- 答题成功后返回的二维码 -->
        <img class="qrCodeImg_2" :src="qrCodeImage" alt="qrCodeImage" />

        <!-- 返回首页按钮 -->
        <div @click="returnHome" class="returnHome">
          <img src="./assets/imgs/returnHome.png" alt="">
        </div>
      </template>

      <!-- 题目信息 -->
      <template v-else>
        <!-- 题号&题目 -->
        <div class="questionClass">
          <div>{{ realQuestionIndex + 1 }}.{{ realQuestionList[realQuestionIndex].title }}</div>
        </div>

        <!-- 选项 -->
        <div class="questionAnswer">
          <div v-for="(answer, answerindex) of realQuestionList[realQuestionIndex]
          .questionItems" :key="answerindex" class="questionOption" @click="selectAnswer(answer)">

            <!-- 选项内容 -->
            <OptionBoxView :answerListData="{ answer, realQuestionList, realQuestionIndex }"
              :answerindex="answerindex" />
          </div>
        </div>
      </template>
    </div>

    <!-- 继续答题&重新答题按钮 -->
    <RestartAnswerButtonView
      :restartAnswerData="{ logicType, realQuestionList, realQuestionIndex, qrCodeImage, hasWrong, questionNeedLength,errorAnswer }"
      :continuer="continuer" :goAnswerQuestion="goAnswerQuestion" :chooseRight="chooseRight" />
  </div>
</template>

<style scoped lang="scss">
@font-face {
  font-family: "medium";
  src: url(./assets/fonts/HarmonyOS_Sans_SC_Medium.ttf);
}

@font-face {
  font-family: "regular";
  src: url(./assets/fonts/HarmonyOS_Sans_SC_Regular.ttf);
}

#app {
  // background: url(./assets/imgs/bg.png);
  background-size: cover;
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  font-family: "regular";

  .msg {
    padding: 6vw;
    font-size: 3.5vw;
  }

  .video {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
  }

  .logotitle {
    position: absolute;
    top: 5vh;
    left: 12.4vw;
  }

  .qrcodeBg {
    position: absolute;
    top: 30.8vh;
    // z-index: 1;
  }

  .qrcode {
    position: absolute;
    width: 42vw;
    height: 42vw;
    left: 30.4%;
    top: 34.8%;
  }

  .answerBg {
    position: absolute;
    top: 27vh;
    left: 2vw;
  }

  .gohome {
    position: absolute;
    z-index: 2;
    top: 86%;
    left: 76%;
  }

  .gameExplain {
    position: absolute;
    top: 93.4%;
    left: 6%;
    z-index: 2;
  }

  .logic_2 {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;

    .questionClass {
      display: flex;
      flex-direction: row;
      width: 68%;
      font-size: 3.8vw;
      font-family: "medium";
      line-height: 3vh;
      letter-spacing: 0.5vw;
      color: #fff;
      margin-left: 18vw;
      margin-top: 33.6vh;
    }

    .logicCount {
      position: absolute;
      font-size: 5.6vw;
      color: #fff;
      width: 7vw;
      height: 7vw;
      left: 44.5%;
      top: 35%;
      z-index: 3;
    }

    .successBg {
      position: absolute;
      top: 27vh;
      left: 2vw;
    }

    .qrCodeImg {
      position: absolute;
      width: 45vw;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .qrCodeImg_2 {
      width: 42vw;
      height: 42vw;
      position: absolute;
      left: 50.6%;
      top: 52.3%;
      z-index: 2;
      transform: translate(-50%, -50%);
    }

    .returnHome {
      width: 40vw;
      position: absolute;
      top: 86.3%;
      left: 76%;
      z-index: 2;
    }

    .questionNum {
      color: #fff;
      font-size: 4vw;
      width: 100%;
      text-align: center;
      position: absolute;
      top: 12%;
      text-align: center;
    }

    .questionTitle {
      width: 90%;
      position: absolute;
      left: 5%;
      top: 22%;
      font-size: 4vw;
      color: #fff;
    }

    .questionAnswer {
      color: #3a3a3a;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      position: absolute;
      width: 80vw;
      top: 44.5vh;
      left: 10vw;

      .questionOption {
        // width: 50.46vw;
        height: 10vw;
        line-height: 10vw;
        margin-bottom: 2.6vh;
        position: relative;

        .answerSelected {
          width: 20%;
          position: absolute;
          right: -2%;
          top: 0%;
        }

        .answerContent {
          position: absolute;
          width: 100%;
          height: 100%;
          text-align: center;
          left: 0;
          top: 0;
        }
      }
    }
  }
}

img {
  pointer-events: none;
}
</style>
