<template>
  <div class="dt-text">
    <div class="detailGroup">
      <label>文本属性</label>
      <div class="dbRow">
        <span>字号</span>
        <input type="number" :value="selectedItem.fontSize" @input="handleInput($event, 'fontSize')" />
        <span>字体</span>
        <select :value="selectedItem.fontFamily" @input="handleInput($event, 'fontFamily')">
          <option value="黑体">黑体</option>
          <option value="宋体">宋体</option>
        </select>
      </div>
      <div class="dbRow">
        <!-- <span>颜色</span> -->
        <span>
          <img src="@/assets/img/editor/颜色.png" alt="" />
        </span>
        <input type="color" :value="selectedItem.color" @input="handleInput($event, 'color')" />
        <span>透明</span>
        <input type="text" :value="selectedItem.opacity" @input="handleInput($event, 'opacity')" />
      </div>
      <div class="dbRow">
        <!-- <span>行高</span> -->
        <span>
          <img src="@/assets/img/editor/行高.png" alt="" />
        </span>
        <input type="number" :value="selectedItem.lineHeight" @input="handleInput($event, 'lineHeight')" />
        <!-- <span>间距</span> -->
        <span>
          <img src="@/assets/img/editor/间距.png" alt="" />
        </span>
        <input type="number" :value="selectedItem.letterSpacing" @input="handleInput($event, 'letterSpacing')" />
      </div>

      <div class="dbRow">
        <!-- <span>缩进</span>
              <input type="number" v-model.trim="selectedItem.textIndent"> -->
        <span>换行</span>
        <select :value="selectedItem.whiteSpace" @input="handleInput($event, 'whiteSpace')">
          <option value="normal">正常</option>
          <option value="pre">所见即所得</option>
          <option value="nowrap">禁止换行</option>
        </select>
        <!-- <span>对齐</span>
              <select v-model.trim="selectedItem.textAlign">
                <option value="left">左对齐</option>
                <option value="center">居中</option>
                <option value="right">右对齐</option>
              </select> -->
      </div>
      <div class="dbRow">
        <!-- <span>加粗</span>
              <input id="fontWeight" type="checkbox" v-model="selectedItem.fontWeight">
              <label for="fontWeight"></label>
              <span>倾斜</span>
              <input id="fontStyle" type="checkbox" v-model.trim="selectedItem.fontStyle">
              <label for="fontStyle"></label> -->
        <div style="width: 50%; display: flex; justify-content: space-around">
          <div
            @click="selectedItem.fontWeight = !selectedItem.fontWeight"
            class="iconListContainer"
          >
            <img
              v-show="selectedItem.fontWeight"
              src="@/assets/img/editor/加粗.png"
              alt=""
            />
            <img
              v-show="!selectedItem.fontWeight"
              src="@/assets/img/editor/加粗0.png"
              alt=""
            />
          </div>
          <div
            @click="selectedItem.fontStyle = !selectedItem.fontStyle"
            class="iconListContainer"
          >
            <img
              v-show="selectedItem.fontStyle"
              src="@/assets/img/editor/倾斜.png"
              alt=""
            />
            <img
              v-show="!selectedItem.fontStyle"
              src="@/assets/img/editor/倾斜0.png"
              alt=""
            />
          </div>
        </div>

        <div style="width: 50%; display: flex; justify-content: center">
          <div
            @click="selectedItem.textAlign = 'left'"
            class="iconListContainer"
          >
            <img
              v-show="selectedItem.textAlign == 'left'"
              src="@/assets/img/editor/左对齐.png"
              alt=""
            />
            <img
              v-show="selectedItem.textAlign != 'left'"
              src="@/assets/img/editor/左对齐0.png"
              alt=""
            />
          </div>
          <div
            @click="selectedItem.textAlign = 'center'"
            class="iconListContainer"
          >
            <img
              v-show="selectedItem.textAlign == 'center'"
              src="@/assets/img/editor/居中.png"
              alt=""
            />
            <img
              v-show="selectedItem.textAlign != 'center'"
              src="@/assets/img/editor/居中0.png"
              alt=""
            />
          </div>
          <div
            @click="selectedItem.textAlign = 'right'"
            class="iconListContainer"
          >
            <img
              v-show="selectedItem.textAlign == 'right'"
              src="@/assets/img/editor/右对齐.png"
              alt=""
            />
            <img
              v-show="selectedItem.textAlign != 'right'"
              src="@/assets/img/editor/右对齐0.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <div class="detailGroup">
      <label>文本内容</label>
      <textarea
        @keyup.stop=""
        cols="30"
        rows="3"
        :value="selectedItem.textContent"
        @input="handleInput($event, 'textContent')"
      ></textarea>
      <!-- v-model="selectedItem.textContent" -->
    </div>
  </div>
</template>

<script>
export default {
  name: "dt-text",
  props: ["value"],
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
