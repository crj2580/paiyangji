<template>
  <div class="dt-qrcode">
    <div class="detailGroup">
      <label>链接配置</label>
      <div class="row">
        <span>类型</span>
        <select v-model.trim="selectedItem.qrcodeType">
          <option value="normal">普通</option>
          <option value="activity" v-if="grantedActivity">活动</option>
          <!-- <option value="cloud">云码</option> -->
        </select>
      </div>
      <div class="row" v-if="selectedItem.qrcodeType == 'normal'">
        <span>地址</span>
        <input type="text" v-model.trim="selectedItem.qrcodeUrl" />
      </div>
      <div class="row" v-else-if="selectedItem.qrcodeType == 'activity'">
        <span>活动</span>
        <select
          v-model.trim="selectedItem.activityId"
          @change="$parent.getGame(selectedItem)"
        >
          <option
            v-for="(activity, index) of activityList"
            :key="index"
            :value="activity.id"
          >
            {{ activity.name }}
          </option>
        </select>
      </div>
      <div
        class="row"
        v-if="selectedItem.qrcodeType == 'activity' && selectedItem.activityId"
      >
        <span>游戏</span>
        <select v-model.trim="selectedItem.gameId">
          <option
            v-for="(game, index) of selectedItem.gameList"
            :key="index"
            :value="game.id"
          >
            {{ game.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dt-qrcode",
  props: ["value","grantedActivity"],
  data() {
    return {
      selectedItem: null,
    };
  },
  watch: {
    value(newVal) {
      this.selectedItem = newVal;
    },
  },
  created() {
    this.selectedItem = this.value;
  },
  methods: {
    handleInput(e, tag) {
      this.selectedItem[tag] = e.target.value;
      this.$emit("input", this.selectedItem);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
