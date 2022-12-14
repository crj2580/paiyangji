<template>
  <div id="box" @click="personHere()">
    <!-- 纸张 -->

    <div v-if="totalQuestionList.length > 0">
      <QAItemPanel
        ref="qaItem"
        :title="'选择题'"
        :data="totalQuestionList[curentIndex]"
        :index="curentIndex"
        :total="totalQuestionList.length"
        :questionIndex="questionIndex"
        :timerCount ="timerCount"
        @answered="answered"
      >
      </QAItemPanel>
    </div>
    <div class="gohome" @click="goHome">
      <img src="~assets/img/pingce02/home.png" />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  inject,
  onUnmounted,
  defineComponent,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import QAItemPanel from "../../components/QAItemPanel.vue";
const qaItem = ref(null);
const $axios = inject("axios");
const $router = useRouter();
var GetPapersByTagsUrl =
  "https://activity.api.troncell.com/api/services/app/SengsingDevice/GetPapersByTags";
var subKey = "644e6a5b4df54a4d8fa29fd342c5b711";
var securityKey = "cace045bc83746fd8580767adc966023";
// 试卷
var totalQuestionList = ref([]);
var curentIndex = ref(-1);
var questionIndex = ref("");
// 点击变色
var activeIndex = ref(0);
// 分数
var score = 0;
// 问答计时器
let timerCount = ref(30);
let totalSeconds = 30;
let timer;
onMounted(() => {
  // 调用试卷方法
  GetPapersByTags();
  // 调用定时器
  setTime();
});
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
// 选择答案
function answered(itemScore, index) {
  score += itemScore;
  console.log("Parent got event", itemScore, index);
  if (curentIndex.value < totalQuestionList.value.length - 1) {
    curentIndex.value++;
    changeChina(curentIndex);
  } else {
    $router.push({ path: `/score/${score}` });
  }
}
const goHome = () => {
  $router.push("/home");
};
function personHere() {
  timerCount.value = totalSeconds;
}
// 计时器
function setTime() {
  timer = setInterval(() => {
    timerCount.value--;
    console.log(timerCount.value);
    if (timerCount.value === 0) {
      //curentIndex.value++
      timerCount.value = totalSeconds
      goHome()
    }
  }, 1000);
}
// 获取试卷问题
async function GetPapersByTags() {
  $axios
    .get(GetPapersByTagsUrl, {
      params: {
        Tags: "测评",
        Subkey: subKey,
      },
    })
    .then((res) => {
      // console.log(res.data.result.items[0]);
      // console.log(res.data.result.items[0].questions);
      totalQuestionList.value = res.data.result.items[0].questions;
      curentIndex.value = 1;
      changeChina(curentIndex);
    });
}
// 将数字转为汉字
function changeChina(curentIndex) {
  switch (curentIndex.value) {
    case 1:
      questionIndex.value = "一";
      break;
    case 2:
      questionIndex.value = "二";
      break;
    case 3:
      questionIndex.value = "三";
      break;
    case 4:
      questionIndex.value = "四";
      break;
    case 5:
      questionIndex.value = "五";
      break;
    case 6:
      questionIndex.value = "六";
      break;
    case 7:
      questionIndex.value = "七";
      break;
    case 8:
      questionIndex.value = "八";
      break;
    case 9:
      questionIndex.value = "九";
      break;
    case 10:
      questionIndex.value = "十";
      break;
    default:
      console.log(curentIndex.value);
      break;
  }
}
</script>

<style scoped>
#box {
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  background: url(~assets/img/pingce02/2.png) no-repeat center;
}
.gohome {
  position: absolute;
  right: 10vw;
  bottom: 3vh;
}
</style>