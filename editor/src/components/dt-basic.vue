<template>
    <div class="dt-baisc">
      <div class="detailGroup">
        <label>基础属性</label>
        <div class="row">
          <span>名称</span>
          <input
            type="text"
            :value="selectedItem.displayName"
            @input="handleInput($event, 'displayName')"
          />
        </div>
        <div class="dbRow">
          <span>类型</span>
          <!-- <span>{{selectedItem.type}}</span> -->
          <input
            type="text"
            readonly
            :value="selectedItem.type"
            @input="handleInput($event, 'type')"
          />
          <span>层级</span>
          <input
            type="number"
            :value="selectedItem.zIndex"
            @input="handleInput($event, 'zIndex')"
          />
        </div>
        <div class="dbRow">
          <span>X</span>
          <input
            type="number"
            :value="selectedItem.left"
            @input="handleInput($event, 'left')"
          />
          <span>Y</span>
          <input
            type="number"
            :value="selectedItem.top"
            @input="handleInput($event, 'top')"
          />
        </div>
        <div class="dbRow">
          <span>W</span>
          <input
            type="number"
            :value="movePermit ? displayWidth : selectedItem.width"
            @input="handleInput($event, 'width')"
          />
          <span>H</span>
          <input
            type="number"
            :value="movePermit ? displayWidth : selectedItem.height"
            @input="handleInput($event, 'height')"
          />
        </div>
        <div class="dbRow">
          <!-- <span>旋转</span> -->
          <span>
            <img src="@/assets/img/editor/旋转.png" alt="" />
          </span>
          <input
            type="number"
            :value="selectedItem.rotate"
            @input="handleInput($event, 'rotate')"
          />
          <!-- <span>翻转</span> -->
          <span>
            <img src="@/assets/img/editor/翻转.png" alt="" />
          </span>
          <select
            :value="selectedItem.transformScale"
            @input="handleInput($event, 'transformScale')"
          >
            <option value="">无</option>
            <option value="scaleX(-1)">水平</option>
            <option value="scaleY(-1)">垂直</option>
            <option value="scale(-1)">完全翻转</option>
          </select>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: "dt-basic",
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
  },
};
</script>

<style lang="less" scoped>
</style>



