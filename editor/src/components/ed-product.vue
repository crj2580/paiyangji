<template>
  <div class="edProduct">
    <img
      v-show="item.picUrl"
      :src="item.picUrl"
      style="max-width: 100%; max-height: 100%"
    />
  </div>
</template>

<script>
export default {
  name: "ed-product",
  props: ["value"],
  data() {
    return {
      item: {},
    };
  },
  created() {
    this.item = this.value;
    console.log(this.item);
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.edProduct {
  width: 100%;
  height: 100%;
  position: absolute;
  text-align: center;
}
</style>
