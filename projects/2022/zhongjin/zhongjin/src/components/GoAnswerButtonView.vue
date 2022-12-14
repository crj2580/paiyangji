<script setup>
import { ref } from "vue";
const props = defineProps(['logicType', 'clickButton1', 'clickButton2'])
</script>

<template>
  <!-- 去答题按钮 -->
  <div v-show="logicType==1" @click="clickButton1()" class="buttonContainer" style="width: 44vw; top: 58%; left: 49vw">
    <img src="../assets/imgs/startBtn.png" style="width: 100%" />
  </div>

  <!-- 去输入验证码按钮 -->
  <div v-show="logicType==1" @click="clickButton2()" class="buttonContainer" style="width: 44vw; top: 68.2%; left: 49vw;">
    <img src="../assets/imgs/goIndex.png" style="width: 100%" />
  </div>
</template>

<style scoped lang="scss">
.buttonContainer {
  position: absolute;
  left: 10.7%;
  top: 21.5%;
  width: 14vw;
  height: 14vw;
  perspective: 1000px;
  -webkit-perspective: 1000px;
  z-index: 5;
}
</style>
