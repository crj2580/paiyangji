<template>
  <div class="ed-swiper">
    <div style="height: 100%">
      <div
        class="paint"
        v-show="item.resourceList[item.resourceListIndex].type == 'image'"
        :style="{
          opacity: item.resourceList[item.resourceListIndex].backgroundOpacity,
          backgroundRepeat:
            item.resourceList[item.resourceListIndex].backgroundRepeat,
          backgroundImage:
            'url(' + item.resourceList[item.resourceListIndex].resource + ')',
          backgroundSize:
            item.resourceList[item.resourceListIndex].backgroundSize,
          borderRadius:
            item.resourceList[item.resourceListIndex].borderRadius + 'px',
          transform: item.transformScale,
        }"
      ></div>
      <video
        class="media"
        v-show="item.resourceList[item.resourceListIndex].type == 'media'"
        :src="item.resourceList[item.resourceListIndex].resource"
        :poster="item.resourceList[item.resourceListIndex].poster"
        :controls="item.resourceList[item.resourceListIndex].controls"
        :loop="item.resourceList[item.resourceListIndex].loop"
        :muted="item.resourceList[item.resourceListIndex].muted"
        :autoplay="item.resourceList[item.resourceListIndex].autoplay"
        style="width: 100%"
      ></video>
      <img
        v-show="item.type == 'media' && item.loading"
        class="mdeiaLoading"
        src="@/assets/img/loading0.gif"
      />
    </div>
    <div
      class="point last"
      @mousedown.stop="swiperLast(item)"
    >
      <img
        src="@/assets/img/editor/arrow.png"
        style="width: 100%; margin-left: 0.2vw"
      />
    </div>
    <div
      class="point next"
      @mousedown.stop="swiperNext(item)"
    >
      <img src="@/assets/img/editor/arrow.png" style="width: 100%" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ed-swiper",
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
    swiperLast: function (item) {
      console.log(item);
      if (item.resourceListIndex == 0) {
        item.resourceListIndex = item.resourceList.length - 1;
      } else {
        item.resourceListIndex--;
      }
    },
    swiperNext: function (item) {
      if (item.resourceListIndex < item.resourceList.length - 1) {
        item.resourceListIndex++;
      } else {
        item.resourceListIndex = 0;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.ed-swiper {
  height: 100%;
  .point {
    display: block !important;
  }
}
</style>
