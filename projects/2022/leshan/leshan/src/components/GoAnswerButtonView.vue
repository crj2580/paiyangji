<script setup>
import { ref } from "vue";
const props = defineProps(['logicType', 'clickButton1', 'clickButton2'])
</script>

<template>
  <!-- 去答题按钮 -->
  <div v-show="logicType==1" @click="clickButton1()" class="goAnswer">
    <img src="../assets/imgs/startBtn.png" style="width: 100%" />
  </div>

  <!-- 去输入验证码按钮 -->
  <div v-show="logicType==1" @click="clickButton2()" class="goInputCode">
    <img src="../assets/imgs/goIndex.png" style="width: 100%" />
  </div>
</template>

<style scoped lang="scss">
.goAnswer {
  position: absolute;
  width: 40vw;
  top: 68vh;
  left: 8vw;
}

.goInputCode {
  position: absolute;
  width: 40vw;
  top: 68vh;
  left: 54vw;
}
</style>
