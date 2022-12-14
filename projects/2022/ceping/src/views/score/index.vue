<template>
  <div id="box">
    <span class="score">{{ score }}</span>
    <div class="level">
      <span v-if="score <= 45">入门阶段</span>
      <span v-else-if="score <= 65">进阶阶段</span>
      <span v-else>高级阶段</span>
    </div>
    <div class="photo" @click="tophoto()">
      <img src="~assets/img/pingce03/3-button.png" />
    </div>
    <div class="gohome" @click="goHome">
      <img src="~assets/img/pingce02/home.png" />
    </div>
    <div class="timer">
      {{timerCount}}S
    </div>
  </div>
</template>

<script>
export default {
  name: "score",
  data() {
    return {
      score: "",
      timerCount: 15,
    };
  },
  mounted() {
    this.getscore();
    this.setTime();
  },
  unmounted(){
    clearInterval(this.timer); 
  },
  methods: {
    getscore() {
      this.score = this.$route.params.score;
    },
    tophoto() {
      this.$router.push({ path: `/takephoto/${this.score}` });
    },
    goHome() {
      this.$router.push("/home");
    },
    setTime() {
      if (this.timer) clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.timerCount--;
        if (this.timerCount === 0) {
          clearInterval(this.timer); // 清除定时器
          this.$router.push('/home')
        }
      }, 1000);
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: "演示悠然小楷";
  src: url(../../assets/font/演示悠然小楷.ttf);
  font-family: "fangong";
  src: url(../../assets/font/fangong.ttf);
}
#box {
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  position: relative;
  background: url(~assets/img/pingce03/3.png) no-repeat center;
}
#box .score {
  position: absolute;
  font-family: "演示悠然小楷";
  left: 48vw;
  top: 22.6vh;
  font-size: 84px;
  font-weight: bold;
}
#box .level {
  position: absolute;
  font-family: "fangong";
  left: 30vw;
  top: 37vh;
  font-size: 100px;
  color: #946652;
}
#box .photo {
  position: absolute;
  right: 24.7vw;
  top: 50.5vh;
}
#box .gohome {
  position: absolute;
  right: 4vw;
  bottom: 2vh;
}
#box .timer{
  position:absolute;
  left: 25vw;
  bottom: 25vh;
  font-family:'思源黑体';
  font-size: 36px;
}
</style>