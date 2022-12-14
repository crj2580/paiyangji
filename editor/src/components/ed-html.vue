<template>
  <div class="ed-html">
    <div v-if="item.type == 'html'" style="width: 100%;height: 100%;position: absolute;"></div>
    <iframe
      v-if="item.type == 'html' && item.resource"
      :src="item.resource"
      style="height: 100%; width: 100%"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "ed-html",
  props: ["value"],
  data() {
    return {
      item: {},
    };
  },
  created() {
    this.item = this.value;
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.ed-html {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
