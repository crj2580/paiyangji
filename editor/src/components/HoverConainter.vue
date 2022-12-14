<template>
  <div id="hoverContainer">
    <div style="display: inline-block; position: relative; top: -0.25vw">
      <input type="text" v-model="basicData.name" style="width: 8vw" />
    </div>
    <img
      title="后退(Ctrl+Z)"
      @click="historyBack"
      :class="{ disabled: !historyList[historyListNowIndex - 1] }"
      src="@/assets/img/editor/back-forward.png"
    />
    <img
      title="前进(Ctrl+Y)"
      @click="historyForward"
      :class="{ disabled: !historyList[historyListNowIndex + 1] }"
      src="@/assets/img/editor/back-forward.png"
      style="transform: scaleX(-1)"
    />
    <label for="leadingIn">
      <img title="导入模板" src="@/assets/img/editor/leadingIn.png" />
    </label>
    <input
      style="display: none"
      id="leadingIn"
      type="file"
      @change="leadingIn($event)"
    />
    <img
      @click="saveToLocal"
      title="保存到本地"
      src="@/assets/img/editor/saveAs.png"
    />
    <img
      @click="saveBack"
      title="保存(Ctrl+S)"
      src="@/assets/img/editor/save.png"
    />
    <img
      @click="cancelBack"
      title="退出(Esc)"
      src="@/assets/img/editor/close.png"
    />
    <!-- <img title="上传到云端" src="@/assets/img/editor/upload.png"> -->
  </div>
</template>

<script>
export default {
  name: "hoverCoantiner",
  props: ["historyList", "historyListNowIndex", "itemList"],
  data() {
    return {
      basicData: {
        type: "",
        name: "",
      },
    };
  },
  watch: {
    historyListNowIndex(newVal) {
      if (this.historyList[newVal]) {
        var data = this.historyList[this.historyListNowIndex];
        this.basicData = data.basicData;
      }
    },
  },
  created() {
    this.basicData.name = '新建画布'
  },
  methods: {
    historyBack: function () {
      console.log(this.historyListNowIndex);
      if (this.historyList[this.historyListNowIndex - 1]) {
        this.$emit("currentIndexChange", false);
      } else {
        console.log("到头了");
      }
    },
    historyForward: function () {
      console.log(this.historyListNowIndex);
      if (this.historyList[this.historyListNowIndex + 1]) {
        this.$emit("currentIndexChange", true);
      } else {
        console.log("到头了");
      }
    },

    leadingIn: function (e) {
      var reader = new FileReader();
      reader.readAsText(e.currentTarget.files[0]);
      reader.onload = () => {
        try {
          var data = JSON.parse(reader.result);
          console.log(data);
          this.$parent.getData(data);
        } catch (error) {
          alert("数据格式有误,请重新导入");
        }
      };
    },
    saveToLocal: function () {
      var data = {
        basicData: this.basicData,
        itemList: this.itemList,
      };

      exportRaw(
        `${this.basicData.name}${this.$parent.getDate()}.json`,
        JSON.stringify(data)
      );

      function fakeClick(obj) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        obj.dispatchEvent(ev);
      }

      function exportRaw(name, data) {
        var urlObject = window.URL || window.webkitURL || window;
        var export_blob = new Blob([data]);
        var save_link = document.createElement("a");
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = name;
        fakeClick(save_link);
      }
    },
    saveBack: function () {
      var data = JSON.stringify({
        basicData: this.basicData,
        itemList: this.itemList.map((item) => {
          if (item.type == "qrcode" && item.qrcodeType == "activity") {
            if (item.activityId && item.gameId) {
              item.gameList = [];
            } else {
              //"存在未配置游戏的二维码"
              item.qrcodeType = "normal";
            }
          }
          if (item.type == "product") {
            item.optList = [];
            item.productName = "";
            item.picUrl = "";
          }
          return item;
        }),
      });
      console.log(data);
      window.parent.postMessage(data, "*");
    },
    cancelBack: function () {
      window.parent.postMessage("", "*");
    },
  },
};
</script>

<style lang="less" scoped>
</style>
