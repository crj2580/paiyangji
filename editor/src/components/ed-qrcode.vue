<template>
  <div class="edQrcode">
    <img
      v-if="!item.qrcodeImg"
      :src="componentList[item.type].icon"
      style="width: 100%; height: 100%"
    />
    <img
      v-if="item.qrcodeImg"
      :src="item.qrcodeImg"
      style="width: 100%; height: 100%"
    />
  </div>
</template>

<script>
export default {
  name: "ed-qrcode",
  props: ["value"],
  data() {
    return {
      item: {},
      componentList:{}
    };
  },
  created() {
    this.item = this.value;
    this.componentList = this.$parent.componentList
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.qrcode {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
