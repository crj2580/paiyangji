<script setup>
import { ref } from "vue";
const props = defineProps(['restartAnswerData', 'chooseRight', 'continuer', 'goAnswerQuestion'])
</script>
    
<template>
    <div class="footerBtn">
        <!-- 继续答题按钮 -->
        <div v-show="
            restartAnswerData.logicType == 2 &&
            restartAnswerData.realQuestionList.length &&
            restartAnswerData.realQuestionList[restartAnswerData.realQuestionIndex].hasSelected &&
            !chooseRight &&
            restartAnswerData.realQuestionIndex != 4 &&
            !restartAnswerData.qrCodeImage &&
            restartAnswerData.realQuestionIndex != restartAnswerData.questionNeedLength
        " class="continuerBtn" @click="continuer()">
            <img src="../assets/imgs/continue.png" style="width: 100%" />
        </div>
        <!-- 重新答题按钮 -->
        <div v-show="
            restartAnswerData.logicType == 2 &&
            restartAnswerData.realQuestionList.length &&
            restartAnswerData.realQuestionList[restartAnswerData.realQuestionIndex].hasSelected &&
            !restartAnswerData.qrCodeImage &&
            restartAnswerData.realQuestionIndex != 4 &&
            (!chooseRight ||
                (restartAnswerData.errorAnswer && restartAnswerData.realQuestionIndex == restartAnswerData.questionNeedLength))
        " class="restartBtn" @click="goAnswerQuestion()">
            <img src="../assets/imgs/restart.png" style="width: 100%" />
        </div>
    </div>
</template>
    
<style scoped lang="scss">
.footerBtn {
    position: fixed;
    z-index: 10000;
    bottom: 21.4%;
    left: 9%;
    width: 100%;
    display: flex;
    justify-content: center;

    .continuerBtn {
        width: 30%;
    }

    .restartBtn {
        width: 30%;
    }
}
</style>
    