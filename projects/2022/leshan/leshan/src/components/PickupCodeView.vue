<script setup>
import { ref } from "vue";
const props = defineProps(["data", "clickKey"]);
</script>

<template>
  <div v-if="data.logicType == 3" class="logic">
    <div id="inputContainer">
      <!-- 无兑换码时输入框显示内容 -->
      <img v-show="!data.codeList.length" style="width: 40vw; height: 2.5vh" src="../assets/imgs/input.png" />

      <!-- 输入的兑换码 -->
      <div v-for="(input, index) of [0, 1, 2, 3, 4, 5]" :key="index" class="inputBox">
        <div class="inputItem">{{ data.codeList[index] }}</div>
      </div>
    </div>

    <!-- 键盘 -->
    <div id="keyboardContainer">
      <div v-for="(item, index) of data.keyList" class="keyboardItemWrapper">
        <div class="keyboardItem" @click="clickKey(item)"
          :style="{ 'font-size': (item == '首页' || item == '清除') ? '4vw' : '6vw' }">
          <div class="keyBoardTitle">{{ item }}</div>
        </div>
      </div>
    </div>

    <div v-show="data.wrongCode" class="wrongCode">
      券码不存在或已被使用,<br />
      请重新输入
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logic {
  position: absolute;
  width: 90%;
  left: 5%;
  top: 30%;
  height: 47vh;

  #inputContainer {
    position: absolute;
    top: 2.5vh;
    left: 25vw;
    height: 10.19vh;
    width: 50vw;
    box-sizing: border-box;
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;

    .inputBox {
      position: relative;
      width: 16%;
      flex-grow: 0;
      left: -1vw;

      .inputItem {
        position: absolute;
        color: #fff;
        font-size: 7vw;
        width: 100%;
        height: 100%;
        top: -3vh;
      }
    }
  }

  #keyboardContainer {
    box-sizing: border-box;
    position: absolute;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 0 5.3vw;
    top: 14vh;
    left: 0.3vw;
    font-size: 2vw;
    text-align: center;

    .keyboardItemWrapper {
      position: relative;
      width: 25.84vw;
      height: 7.766vh;
      // margin: 0 3vw 3vw 0.7vw;
      flex-grow: 0;
      color: #fff;

      &:nth-child(4n) {
        margin-right: initial;
      }

      .keyboardItem {
        position: absolute;
        width: 100%;
        height: 100%;
        background-image: url(../assets/imgs/code.png);
        background-size: contain;
        background-repeat: no-repeat;
        box-sizing: border-box;
        color: #fff;

        .keyBoardTitle {
          position: absolute;
          width: 100%;
          height: 100%;
          text-align: center;
          left: 0;
          top: 0;
          line-height: 13vw;
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
</style>
