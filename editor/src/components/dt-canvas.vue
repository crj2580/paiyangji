<template>
  <div class="dt-text">
    <div class="detailGroup">
      <label>画布设置</label>
      <div class="row">
        <span>名称</span>
        <input type="text" :value="selectedItem.displayName" @input="handleInput($event, 'displayName')" />
      </div>
      <div class="row">
        <span>类型</span>
        <input type="text" :value="selectedItem.type" @input="handleInput($event, 'type')" readonly />
      </div>
      <div class="row">
        <span>尺寸</span>
        <select @change="changeCanvasSize($event,'canvasSize')" :value="selectedItem.canvasSize" >
          <option value="">自定义</option>
          <option
            v-for="(item, index) of canvasSizeList"
            :key="index"
            :value="index"
          >
            {{ item.width }}*{{ item.height }}
          </option>
        </select>
      </div>
      <div v-show="selectedItem.canvasSize === ''" class="dbRow">
        <span>宽</span>
        <input
          type="number"
          :value="movePermit ? displayWidth : selectedItem.width" @input="handleInput($event, 'width')"
        />
          <!-- v-model.number.trim="movePermit ? displayWidth : selectedItem.width" -->

        <span>高</span>
        <input
          type="number"
          :value="movePermit ? displayWidth : selectedItem.height" @input="handleInput($event, 'height')"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dt-canvas",
  props: ["value", "movePermit"],
  data() {
    return {
      canvasSizeList: [
        { width: 1920, height: 1080 },
        { width: 1080, height: 1920 },
        { width: 375, height: 600 },
      ],
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
    changeCanvasSize: function (e, tag) {
      this.handleInput(e, tag);
      var target = this.canvasSizeList[this.selectedItem.canvasSize];
      if (target) {
        this.$parent.itemList[0].width = target.width;
        this.$parent.itemList[0].height = target.height;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
