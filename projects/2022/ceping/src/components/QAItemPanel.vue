
<template>
  <div id="box" v-show="data">
    <div class="top">
      <div class="topInfo">
        <div class="number">第{{ questionIndex }}题</div>
      </div>
    </div>
    <div class="content">
      <span
        :class="[data.title.length < 30 ? 'content-text' : 'content-text2']"
        >{{ data.title }}</span
      >
    </div>
    <div class="time">{{ timerCount }} S</div>
    <div class="bottom">
      <TransitionGroup name="list" tag="div" :css="true" class="bottom-flex">
        <div
          class="answer"
          :class="answerclass(item.prefix)"
          v-for="item in data.questionItems"
          :key="item.id"
          :data-index="index"
          @click="chooseAnswer(item, index)"
        >
          <span style="font-size: 36px;font-family:'思源黑体';font-weight:bold">{{
            item.content
          }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
export default {
  name: "QAItemPanel",
};
</script>

<script setup>
import { ref, reactive, onMounted, inject, onUnmounted } from "vue";
import gsap from "gsap";
const $emit = defineEmits();
const props = defineProps({
  title: String,
  data: Object,
  index: Number,
  total: Number,
  questionIndex: String,
  timerCount: Number,
});
function chooseAnswer(answerItem, answerIndex) {
  let score = parseInt(answerItem.score * 25);
  props.data.questionItems.forEach((item) => {
    item.chosen = false;
  });
  answerItem.chosen = true;
  console.log("answerItem in QAItemPanel", answerItem, score, props.index);
  $emit("answered", score, props.index);
}
function onItemEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    delay: el.dataset.index * 0.05,
    onComplete: done,
  });
}
function onBeforeEnter(el) {
  el.style.opacity = 0;
  //el.style.transform.translateX = 50
  //el.style.height = 0
}
function onItemLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    delay: el.dataset.index * 0,
    onComplete: done,
    duration: 0,
    x: 50,
  });
}
const answerclass = function (prefix) {
  switch (prefix) {
    case "A":
      return "answer-1";
    case "B":
      return "answer-2";
    case "C":
      return "answer-3";
    case "D":
      return "answer-4";
    case "E":
      return "answer-5";
    default:
      console.log("nothing happened");
      break;
  }
};
</script>

<style scoped>
@font-face {
  font-family: "演示悠然小楷";
  src: url(../assets/font/演示悠然小楷.ttf);
}
.top {
  position: absolute;
  width: 565px;
  height: 60px;
  left: 255px;
  top: 565px;
  text-align: center;
  font-size: 60px;
  color: #946652;
  line-height: 50px;
  font-family: "演示悠然小楷";
}
.content {
  position: absolute;
  top: 690px;
  left: 260px;
  width: 560px;
  height: 113px;
}
.content-text {
  font-family: "思源黑体";
  font-size: 42px;
  line-height: 72px;
  font-weight:bold
}
.content-text2 {
  font-family: "思源黑体";
  font-size: 30px;
  line-height: 40px;
}
.time {
  position: absolute;
  top: 865px;
  left: 515px;
  width: 560px;
  height: 113px;
  font-family: "思源黑体";
  color: #946652;
  font-size: 30px;
  line-height: 72px;
}
.bottom {
  position: relative;
  top: 1014px;
  left: 85px;
  width: 915px;
}
.bottom-flex {
  height: 680px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.answer {
  position: relative;
  line-height: 89px;
  height: 89px;
  text-align: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.answer-1 {
  background-image: url(../assets/img/pingce02/2-a.png);
  width: 687px;
}
.answer-2 {
  background-image: url(../assets/img/pingce02/2-b.png);
  width: 743px;
}
.answer-3 {
  background-image: url(../assets/img/pingce02/2-c.png);
  width: 799px;
}
.answer-4 {
  background-image: url(../assets/img/pingce02/2-d.png);
  width: 855px;
}
.answer-5 {
  background-image: url(../assets/img/pingce02/2-e.png);
  width: 911px;
}
</style>
