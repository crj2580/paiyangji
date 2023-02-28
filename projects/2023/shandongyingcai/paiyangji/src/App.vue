<script setup>
import { onMounted, reactive, ref, getCurrentInstance, computed } from "vue";
import { configOut } from "./utils/http";
import axios from "axios";
import TweenMax from "gsap";
import SensingDevice from "./assets/js/sensing-device-sdk-quorra-1.0.js"
import jquery from "jquery";

let logicType = ref(1);
let loading = ref(false);
let hasWrong = ref(false);
let realQuestionIndex = ref(0);
let qrCodeImage = ref("");
let realQuestionList = ref([]);
let totalQuestionList = ref([]);
let questionNeedLength = ref(5);
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
let errorAnswer = ref(0);
let config = reactive(configOut);

const mSensingDevice = SensingDevice.getInstance()

axios.interceptors.response.use(
  response => {
    // console.log('response',response)
    return response
  },
  error => {
    console.log('errorAnswer', error)
    if (error.response) {
      switch (error.response.status) {
        case 500:
          console.log("服务器系统内部错误");
          break;
        case (401):
          console.log("未登录");
          break;
        case (403):
          console.log("无权限执行此操作");
          break;
        case (404):
          console.log("请求不存在");
          break;
        case (408):
          console.log("请求超时");
          break;
        default:
          break;
      }
      setTimeout(function () {
        window.location.reload();
      }, 3000)
    }
    return Promise.reject(error)
  }
)

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



securityKey.value = mSensingDevice.getSecurityKey() || config.securityKey; //troncellshow 游戏密钥
subKey.value = mSensingDevice.getSubKey() || config.subKey;     // 设备密钥


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
  // realQuestionList.value.push({
  //   id: 99999,
  //   title: "请问您对上饶市投资者教育基地是否满意？",
  //   hasSelected: false,
  //   questionItems: [
  //     { content: '非常满意', isAnswer: true, hasSelected: false },
  //     { content: '满意', isAnswer: true, hasSelected: false },
  //     { content: '基本满意', isAnswer: true, hasSelected: false },
  //     { content: '不满意', isAnswer: true, hasSelected: false },
  //   ]
  // })
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
          showMsg.value = result.data.result.outerId;
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
  }).catch((error) => {
    console.log('error', error.message)
    // window.location.reload();
    // console.log(1111111111);
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
      if (errorAnswer.value < 1) {
        clearInterval(timer.value);
        setTimeout(() => {
          allRightShowQrcode();
        }, 1000)
      }
      else if (errorAnswer.value >= 1 && realQuestionIndex.value == 4) {
        showMsg.value = "您已经答错" + errorAnswer.value + "道题了，请重新答题";
        setTimeout(function () {
          showMsg.value = "";
        }, 2000)
      }
    }
  } else {
    console.log("答错了");
    errorAnswer.value++;
    // if (realQuestionIndex.value != questionNeedLength.value - 1) {
    //   showMsg.value = "您已经答错了，继续答题将不会获得奖品，是否继续?";
    // }
    console.log('realQuestionIndex.value', realQuestionIndex.value)
    if (realQuestionIndex.value == 4) {//是最后一个
      if (errorAnswer.value >= 1) {
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
      if (errorAnswer.value >= 1) {
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
      clearAndStartTimer(config.logicCount.time);
      ActionDataById();
    }
  }).catch((error) => {
    console.log('AfterGameerror', error)
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




onMounted(async () => {
  // clickButton();

  PostPlayerData4ActionQrcode();

  console.log('config.value', config)

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
        Tags: config.tags,
        Subkey: subKey.value,
      },
    }
  )
    .then((result) => {
      returnToLogicType1();
      loading.value = false;
      // console.log('resultxxxxxxxxx', result)
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

    <!-- 首页背景 -->
    <img v-show="logicType == 1" :src="config.homeBgImg.src"
      :style="{ width: `${config.homeBgImg.w}%`, height: `${config.homeBgImg.h}%`, top: `${config.homeBgImg.y}%`, left: `${config.homeBgImg.x}%` }"
      class="title_2" />

    <!-- 首页二维码图片 -->
    <img v-show="logicType == 1" :src="qrcode"
      :style="{ width: `${config.homeQrCode.w}vw`, height: `${config.homeQrCode.h}vh`, top: `${config.homeQrCode.y}%`, left: `${config.homeQrCode.x}%` }"
      class="qrcode" />

    <!-- 答题背景 -->
    <img v-show="logicType == 2 && !qrCodeImage" :src="config.answerBgImg.src"
      :style="{ width: `${config.answerBgImg.w}%`, height: `${config.answerBgImg.h}%`, top: `${config.answerBgImg.y}%`, left: `${config.answerBgImg.x}%` }"
      class="answerBgImg" alt="答题背景" />

    <!-- 答题小人图 -->
    <!-- <img v-show="logicType == 2 && !qrCodeImage" src="./assets/imgs/chara.png" class="chara" alt=""> -->

    <!-- 验证码页面背景图 -->
    <img v-show="logicType == 3" :src="config.verificationCodeBgImg.src"
      :style="{ width: `${config.verificationCodeBgImg.w}%`, height: `${config.verificationCodeBgImg.h}%`, top: `${config.verificationCodeBgImg.y}%`, left: `${config.verificationCodeBgImg.x}%` }"
      class="verificationCodeBgImg" alt="验证码背景">

    <!-- 返回按钮 -->
    <div v-show="logicType == 2 && !qrCodeImage && !hasWrong" @click="returnHome"
      :style="{ width: `${config.returnHomeBtn.w}vw`, height: `${config.returnHomeBtn.h}vh`, top: `${config.returnHomeBtn.y}%`, left: `${config.returnHomeBtn.x}%` }"
      class="gohome">
      <img :src="config.returnHomeBtn.src" style="width:100%" alt="返回首页按钮">
    </div>

    <!-- 答题&返回按钮 -->
    <!-- <GoAnswerButtonView :logicType="logicType" :clickButton1="clickButton1" :clickButton2="clickButton2" /> -->

    <!-- 去答题按钮 -->
    <div v-show="logicType == 1" @click="clickButton1" class="buttonContainer"
      :style="{ width: `${config.goAnswerBtn.w}vw`, height: `${config.goAnswerBtn.h}vh`, top: `${config.goAnswerBtn.y}%`, left: `${config.goAnswerBtn.x}%` }">
      <img :src="config.goAnswerBtn.src" style="width: 100%" alt="去答题按钮" />
    </div>

    <!-- 去输入验证码按钮 -->
    <div v-show="logicType == 1" @click="clickButton2" class="buttonContainer"
      :style="{ width: `${config.goVerificationCodeBgImgBtn.w}vw`, height: `${config.goVerificationCodeBgImgBtn.h}vh`, top: `${config.goVerificationCodeBgImgBtn.y}%`, left: `${config.goVerificationCodeBgImgBtn.x}%` }">
      <img :src="config.goVerificationCodeBgImgBtn.src" style="width: 100%" alt="去输入验证码按钮" />
    </div>

    <!-- 键盘 -->
    <!-- <PickupCodeView :data="{ logicType, loading, securityKey, subKey, codeList, keyList, wrongCode }"
      :clickKey='clickKey' /> -->

    <div v-if="logicType == 3"
      :style="{ width: `${config.inputBox.w}vw`, heigth: `${config.inputBox.h}vh`, top: `${config.inputBox.y}%`, left: `${config.inputBox.x}%` }"
      class="logic">

      <div
        :style="{ width: `${config.inputContainer.w}vw`, height: `${config.inputContainer.h}vh`, top: `${config.inputContainer.y}%`, left: `${config.inputContainer.x}%` }"
        id="inputContainer">
        <!-- 无兑换码时输入框显示内容 -->
        <img v-show="!codeList.length" :src="config.inputContainerBgImg.src"
          :style="{ width: `${config.inputContainerBgImg.w}vw`, height: `${config.inputContainerBgImg.h}vh` }" />

        <!-- 输入的兑换码 -->
        <div v-for="(input, index) of [0, 1, 2, 3, 4, 5]" :key="index"
          :style="{ width: `${config.inputCodeList.w}vw`, height: `${config.inputCodeList.h}vh`, top: `${config.inputCodeList.y}%`, left: `${config.inputCodeList.x}%` }"
          class="inputBox">
          <div
            :style="{ fontSize: `${config.inputCodeItem.fontSize}vw`, top: `${config.inputCodeItem.y}vh`, left: `${config.inputCodeItem.x}%`, color: `${config.inputCodeItem.color}` }"
            class="inputItem">{{ codeList[index] }}</div>
        </div>
      </div>

      <!-- 键盘 -->
      <div id="keyboardContainer"
        :style="{ width: `${config.keyboardContainer.w}vw`, height: `${config.keyboardContainer.h}vh`, top: `${config.keyboardContainer.y}vh`, left: `${config.keyboardContainer.x}%`, padding: `${config.keyboardContainer.padding.top}vh ${config.keyboardContainer.padding.right}vw` }">
        <div v-for="(item, index) of keyList"
          :style="{ width: `${config.keyboardItemWrapper.w}vw`, height: `${config.keyboardItemWrapper.h}vh` }"
          class="keyboardItemWrapper">
          <div class="keyboardItem" @click="clickKey(item)"
            :style="{ fontSize: ((item == '首页' || item == '清除') ? `${config.keyboardItem.fontSize.str}vw` : `${config.keyboardItem.fontSize.num}vw`), color: `${config.keyboardItem.color}` }">
            <img :src="config.keyboardItem.src"
              :style="{ width: `${config.keyboardItem.w}vw`, height: `${config.keyboardItem.h}vh` }" alt="code">
            <div
              :style="{ width: `${config.keyBoardTitle.w}%`, height: `${config.keyBoardTitle.h}%`, top: `${config.keyBoardTitle.y}%`, left: `${config.keyBoardTitle.x}%`, lineHeight: `${config.keyBoardTitle.lineHeight}vw` }"
              class="keyBoardTitle">{{ item }}</div>
          </div>
        </div>
      </div>

      <div v-show="wrongCode" class="wrongCode">
        券码不存在或已被使用,<br />
        请重新输入
      </div>
    </div>

    <!-- 题目 -->
    <div v-if="logicType == 2" class="logic_2">
      <!-- 答题成功后返回的二维码 -->
      <template v-if="qrCodeImage">

        <!-- 倒计时 -->
        <div :style="{
          width: `${config.logicCount.w}vw`, height: `${config.logicCount.h}vw`,
          fontSize: `${config.logicCount.fontSize}vw`, color: `${config.logicCount.color}`,
          left: `${config.logicCount.x}%`, top: `${config.logicCount.y}%`
        }" class="logicCount">{{ timeCount }}s</div>

        <!-- 答题成功后背景 -->
        <img :src="config.successBg.src" alt="successBg" />

        <!-- 答题成功后返回的二维码 -->
        <img :style="{
          width: `${config.qrCodeImg_2.w}vw`, height: `${config.qrCodeImg_2.h}vw`,
          left: `${config.qrCodeImg_2.x}%`, top: `${config.qrCodeImg_2.y}%`
        }" class="qrCodeImg_2" :src="qrCodeImage" alt="qrCodeImage" />

        <!-- 返回首页按钮 -->
        <div @click="returnHome" :style="{
          width: `${config.returnHome.w}vw`, height: `${config.returnHome.h}vh`,
          top: `${config.returnHome.y}%`, left: `${config.returnHome.x}%`
        }" class="returnHome">
          <img :src="config.returnHome.src" alt="">
        </div>
      </template>

      <!-- 题目信息 -->
      <template v-else>
        <!-- 题号&题目 -->
        <div
          :style="{ width: `${config.questionClass.w}vw`, height: `${config.questionClass.h}vh`, top: `${config.questionClass.y}%`, left: `${config.questionClass.x}%`, fontSize: `${config.questionClass.fontSize}vw`, color: `${config.questionClass.color}`, lineHeight: `${config.questionClass.lineHeight}vh`, letterSpacing: `${config.questionClass.letterSpace}vw`, margin: (`${config.questionClass.margin.top}vh ${config.questionClass.margin.right}vw ${config.questionClass.margin.bottom}vh ${config.questionClass.margin.left}vw`) }"
          class="questionClass">
          <div>{{ realQuestionIndex + 1 }}.{{ realQuestionList[realQuestionIndex].title }}</div>
        </div>

        <!-- 选项 -->
        <div
          :style="{ width: `${config.questionAnswer.w}vw`, height: `${config.questionAnswer.h}vh`, top: `${config.questionAnswer.y}vh`, left: `${config.questionAnswer.x}vw` }"
          class="questionAnswer">
          <div v-for="(answer, answerindex) of realQuestionList[realQuestionIndex].questionItems" :key="answerindex"
            :style="{ width: `${config.questionOption.w}vw`, height: `${config.questionOption.h}vh`, marginBottom: `${config.questionOption.margin.bottom}vh` }"
            class="questionOption" @click="selectAnswer(answer)">

            <!-- 选项内容 -->
            <img :src="config.questionOption.src" style="width: 100%" />

            <img v-if="answer.hasSelected && !answer.isAnswer"
              :src="!(answer.hasSelected && !answer.isAnswer) || config.questionOption.wrongRedImg"
              class="answerSelected">

            <img v-if="realQuestionList[realQuestionIndex].hasSelected && answer.isAnswer && realQuestionIndex != 4"
              :src="!(realQuestionList[realQuestionIndex].hasSelected && answer.isAnswer) || config.questionOption.rightRedImg"
              class="answerSelected" />

            <img v-if="realQuestionIndex == 4 && answer.hasSelected" :src="config.questionOption.rightRedImg"
              class="answerSelected" />

            <div
              :style="{ width: `${config.answer.w}%`, height: `${config.answer.h}%`, top: `${config.answer.y}vh`, fontSize: `${config.answer.fontSize}vw`, color: `${config.answer.color}`, letterSpacing: `${config.answer.letterSpace}vw` }"
              class="answer">
              <div class="answer-option">
                <div v-show="answerindex == 0">A.</div>
                <div v-show="answerindex == 1">B.</div>
                <div v-show="answerindex == 2">C.</div>
                <div v-show="answerindex == 3">D.</div>
              </div>

              <!-- 选项内容 -->
              <div class="answer-content">{{ answer.content }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 继续答题&重新答题按钮 -->
    <div
      :style="{ width: `${config.footerBtn.w}%`, height: `${config.footerBtn.h}%`, bottom: `${config.footerBtn.y}%`, left: `${config.footerBtn.x}%` }"
      class="footerBtn">
      <!-- 继续答题按钮 -->
      <div v-show="
        logicType == 2 &&
        realQuestionList.length &&
        realQuestionList[realQuestionIndex].hasSelected &&
        !chooseRight &&
        realQuestionIndex != 4 &&
        !qrCodeImage &&
        realQuestionIndex != 5
      " :style="{ width: `${config.continuerBtn.w}%`, height: `${config.continuerBtn.h}%`, top: `${config.continuerBtn.y}vh`, left: `${config.continuerBtn.x}vw`, marginLeft: `${config.continuerBtn.margin.left}vw` }"
        class="continuerBtn" @click="continuer()">
        <img :src="config.continuerBtn.src" style="width: 100%" />
      </div>
      <!-- 重新答题按钮 -->
      <div v-show="
      logicType == 2 &&
      realQuestionList.length &&
      realQuestionList[realQuestionIndex].hasSelected &&
      !qrCodeImage &&
      !chooseRight && errorAnswer >= 1"
        :style="{ width: `${config.restartBtn.w}%`, height: `${config.restartBtn.h}%`, top: `${config.restartBtn.y}vh`, right: `${config.restartBtn.x}vw` }"
        class="restartBtn" @click="goAnswerQuestion()">
        <img :src="config.restartBtn.src" style="width: 100%" />
      </div>
    </div>
  </div>
</template>
  
<style scoped lang="scss">
@font-face {
  font-family: "bold";
  src: url(./assets/font/font.otf);
}

#app {
  background-size: cover;
  // position: fixed;
  width: 100vw;
  height: 100vh;
  // left: 0;
  // top: 0;
  font-family: "bold";
  font-weight: 700;

  .basicMsg {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.9);
    width: 60vw;
    line-height: 3vh;
    border-radius: 3vw;
    top: 50%;
    left: 20%;
    z-index: 10;
  }

  .msg {
    padding: 6vw;
    font-size: 3.5vw;
    color: #fff;
  }

  .title_2 {
    // width: 100%;
    // height: 100%;
    position: absolute;
    z-index: -1;
    // top: 0;
    // left: 0;
  }

  .qrcode {
    position: absolute;
    width: 33vw;
    height: 34vw;
    right: 33.5%;
    top: 35%;
  }

  .answerBgImg {
    position: absolute;
  }

  .verificationCodeBgImg {
    position: absolute;
  }

  .gohome {
    position: absolute;
    z-index: 2;
    // top: 80%;
    // left: 42%;
  }

  .buttonContainer {
    position: absolute;
    // left: 10.7%;
    // top: 21.5%;
    // width: 14vw;
    // height: 14vw;
    perspective: 1000px;
    -webkit-perspective: 1000px;
    z-index: 5;
  }

  .logic {
    position: absolute;
    // width: 90vw;
    // left: 4%;
    // top: 30%;
    // height: 47vh;

    #inputContainer {
      position: absolute;
      // top: -2.5vh;
      // left: 25vw;
      // height: 10.19vh;
      // width: 46vw;
      box-sizing: border-box;
      background-size: contain;
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      justify-content: center;

      .inputBox {
        position: relative;
        // width: 16%;
        flex-grow: 0;
        // left: -1vw;

        .inputItem {
          position: absolute;
          // font-size: 7vw;
          // width: 100%;
          // height: 100%;
          // top: 0vh;
          // color: #92d6ff;
        }
      }
    }

    #keyboardContainer {
      box-sizing: border-box;
      position: absolute;
      // width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      // top: 25vw;
      // left: -1.8%;
      // font-size: 2vw;
      text-align: center;

      .keyboardItemWrapper {
        position: relative;
        // width: 13vw;
        // height: 8.4vh;
        // margin: 0 3vw 3vw 0.7vw;
        flex-grow: 0;
        // color: rgb(16, 27, 121);

        &:nth-child(4n) {
          margin-right: initial;
        }

        .keyboardItem {
          position: absolute;
          // width: 100%;
          // height: 100%;
          // background-image: url(./assets/imgs/code.png);
          background-size: contain;
          background-repeat: no-repeat;
          box-sizing: border-box;
          // color: #fff;

          .keyBoardTitle {
            position: absolute;
            // width: 100%;
            // height: 100%;
            text-align: center;
            // left: 1vw;
            // top: 8%;
            // line-height: 13vw;
          }
        }
      }
    }

    .wrongCode {
      font-size: 4vw;
      line-height: 5vh;
      padding: 3vh 0;
      color: #fff;
      font-weight: bold;
      text-align: center;
      position: fixed;
      width: 50%;
      left: 25%;
      background: rgba(0, 0, 0, 0.75);
      top: 40%;
      border-radius: 3vw;
    }
  }

  .chara {
    position: absolute;
    top: 58%;
    left: 4%;
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
      // width: 54vw;
      // font-size: 3.8vw;
      font-family: "bold";
      // line-height: 2.4vh;
      // letter-spacing: 0.5vw;
      // color: #fff;
      // margin-left: 23vw;
      // margin-top: 31vh;
    }

    .logicCount {
      position: absolute;
      font-size: 5.6vw;
      color: #1e72c6;
      letter-spacing: 0.8vw;
      width: 7vw;
      height: 7vw;
      left: 50%;
      transform: translateX(-76%);
      top: 28.5%;
    }

    .qrCodeImg {
      position: absolute;
      width: 45vw;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .qrCodeImg_2 {
      width: 34vw;
      height: 34vw;
      position: absolute;
      left: 50%;
      top: 44.6%;
      z-index: 2;
      transform: translate(-50%, -50%);
    }

    .returnHome {
      width: 40vw;
      position: absolute;
      top: 80%;
      left: 30%;
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
      // width: 80vw;
      // top: 47vh;
      // left: 10vw;

      .questionOption {
        // width: 50.46vw;
        // height: 10vw;
        // line-height: 10vw;
        // margin-bottom: 2.8vh;
        position: relative;

        .answerSelected {
          width: 20%;
          position: absolute;
          right: -2%;
          top: 0%;
        }

        .answer {
          // width: 100%;
          // height: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          position: absolute;
          z-index: 2;
          text-align: center;
          // font-size: 4vw;
          // color: #034d8b;
          // top: 1vh;
          // letter-spacing: 0.6vw;
        }
      }
    }
  }

  .footerBtn {
    position: fixed;
    z-index: 10000;
    // bottom: 10%;
    // left: 0.4%;
    // width: 100%;
    // display: flex;
    // justify-content: center;

    .continuerBtn {
      position: absolute;
      // width: 34%;
      // margin-left: 4vw;
      // top: -8vh;
    }

    .restartBtn {
      // width: 34%;
      position: absolute;
      // top: -8vh;
      // right: 3.3vw;
    }
  }
}

img {
  pointer-events: none;
}
</style>
  
