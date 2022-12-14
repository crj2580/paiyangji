<script setup>
import { ref } from "vue";
import wrongRed from "../assets/imgs/wrong_red.gif"
import rightRed from "../assets/imgs/right_red.gif"
const props = defineProps(['answerListData', 'answerindex'])
</script>
        
<template>
  <!-- 选中状态的框 -->
  <!-- <img v-if="answerListData.answer.hasSelected" src="../assets/img/answer_red.png" style="width: 100%" /> -->

  <!-- 选项的框 -->
  <img src="../assets/imgs/answer_white.png" style="width: 100%" />

  <img v-if="answerListData.answer.hasSelected && !answerListData.answer.isAnswer"
    :src="!(answerListData.answer.hasSelected&&!answerListData.answer.isAnswer)|| wrongRed" class="answerSelected">

  <img v-if=" answerListData.realQuestionIndex != 4 &&
  answerListData.realQuestionList[answerListData.realQuestionIndex].hasSelected && answerListData.answer.isAnswer"
    :src="!(answerListData.realQuestionList[answerListData.realQuestionIndex].hasSelected && answerListData.answer.isAnswer) || rightRed"
    class="answerSelected" />


  <img v-if="answerListData.realQuestionIndex == 4 && answerListData.answer.hasSelected"
    src="../assets/imgs/right_red.gif" class="answerSelected" />

  <div class="answer">
    <div class="answer-option">
      <div v-show="answerindex == 0">A.</div>
      <div v-show="answerindex == 1">B.</div>
      <div v-show="answerindex == 2">C.</div>
      <div v-show="answerindex == 3">D.</div>
    </div>

    <!-- 选项内容 -->
    <div class="answer-content">{{ answerListData.answer.content }}</div>
  </div>
</template>
        
<style scoped lang="scss">
.answerSelected {
  width: 20%;
  position: absolute;
  right: -2%;
  top: 0%;
}

.answer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 2;
  top: 0.6vh;
  letter-spacing: 0.6vw;

  .answer-option {
    font-size: 4vw;
    color: #fff;
    text-align: center;
  }

  .answer-content {
    font-size: 4vw;
    text-align: center;
    color: #fff;
    // margin-left: 2vw;
  }
}
</style>