<template>
  <div
    id="EdText textContent"
    v-html="item.textContent"
    :class="{
      fontBold: item.fontWeight,
      fontItalic: item.fontStyle,
    }"
    :style="{
      color: item.color,
      whiteSpace: item.whiteSpace,
      lineHeight: `${item.lineHeight}px`,
      textAlign: item.textAlign,
      fontSize: `${item.fontSize}px`,
      fontFamily: `${item.fontFamily}`,
      textIndent: `${item.textIndent}px`,
      opacity: item.backgroundOpacity,
      transform: item.transformScale,
      letterSpacing: `${item.letterSpacing}px`,
    }"
  ></div>
</template>

<script>
export default {
  name: "ed-text",
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
</style>
