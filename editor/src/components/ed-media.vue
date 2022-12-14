<template>
  <div class="ed-media">
    <video
      class="media"
      :src="item.resource"
      :poster="item.poster"
      :controls="item.controls"
      :loop="item.loop"
      :muted="item.muted"
      :autoplay="item.autoplay"
      style="width: 100%"
      @loadstart="videoLoadStart"
      @error="videoError($event, item)"
    ></video>
    <img
      v-show="item.loading"
      class="mdeiaLoading"
      src="@/assets/img/loading0.gif"
    />
  </div>
</template>

<script>
export default {
  name: "ed-media",
  props: ["value"],
  data() {
    return {
      item: {},
    };
  },
  created() {
    this.item = this.value;
  },
  methods: {
    videoLoadStart: function (e) {
      console.log("videoLoadStart", e);
    },
    videoError: function (e, target) {
      console.log("videoError", e, target);
      if (target.resource) {
        alert("视频格式出错或不支持预览");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.ed-media {

}
</style>
