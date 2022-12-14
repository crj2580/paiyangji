<template>
  <div id="Home">
    <div class="container">
      <div v-for="menu of menuList" :key="menu" @click="goRouter(menu)">
        <img :src="require(`@/assets/img/Home/${menu}.png`)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      menuList: [
        "environment",
        "activity",
        "navigation",
        "recommend",
        "search",
        "queue",
      ],
    };
  },
  methods: {
    goRouter(router) {
      this.$router.push({ name: router });
    },
  },
};
</script>
<style scoped lang="scss">
#Home {
  background-image: url(../assets/img/Home/bg.png);
  background-size: 100% 100%;
  .container {
    position: absolute;
    bottom: 2vmax;
    height: 56%;
    width: 44%;
    left: 3%;
    background-image: url(../assets/img/Home/container.png);
    background-size: 100% 100%;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    justify-content: space-around;
    padding: 3vmax 5vmax;
    div {
      width: 33%;
      height: 6vmax;
      text-align: center;
      margin: 1vmax;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
