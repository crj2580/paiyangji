<template>
  <div
    class="edPaint paint"
    :style="{
      backgroundColor: item.backgroundColor,
      opacity: item.backgroundOpacity,
      backgroundRepeat: item.backgroundRepeat,
      backgroundImage: 'url(' + item.backgroundImage + ')',
      backgroundSize: item.backgroundSize,
      borderRadius: item.borderRadius + 'px',
      transform: item.transformScale,
    }"
  ></div>
</template>

<script>
export default {
  name: "el-paint",
  props: ["value"],
  data() {
    return {
      item: {},
    };
  },
  created() {
    this.item = this.value;
    console.log(JSON.stringify(this.value));
  },
  methods: {},
};
</script>

<style lang="less" scoped>
</style>
