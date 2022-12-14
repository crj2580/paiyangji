<template>
  <div class="dt-paint">
    <div class="detailGroup">
      <label>背景属性</label>
      <div class="dbRow">
        <!-- <span>颜色</span> -->
        <span>
          <img src="@/assets/img/editor/颜色.png" alt="" />
        </span>
        <input
          type="color"
          :value="selectedItem.backgroundColor"
          @input="handleInput($event, 'backgroundColor')"
        />
        <span>透明</span>
        <input
          type="text"
          :value="selectedItem.backgroundOpacity"
          @input="handleInput($event, 'backgroundOpacity')"
        />
      </div>
      <div class="dbRow" v-if="selectedItem.type != 'canvas'">
        <!-- <span style="width:19%;">圆角</span> -->
        <span>
          <img src="@/assets/img/editor/圆角.png" alt="" />
        </span>
        <input
          type="number"
          :value="selectedItem.borderRadius"
          @input="handleInput($event, 'borderRadius')"
        />
      </div>
      <div class="row">
        <span class="uploadButton">
          <b>图片</b>
        </span>
        <input
          @change="fileupload($event, 'backgroundImage', 'Image')"
          type="file"
        />
        <input
          type="text"
          v-model.trim="selectedItem.backgroundImage"
          @input="backgroundImageChange(selectedItem)"
        />
      </div>
      <div class="dbRow">
        <span>拉伸</span>
        <select
          :value="selectedItem.backgroundSize"
          @input="handleInput($event, 'backgroundSize')"
        >
          <option value="">无</option>
          <option value="cover">覆盖</option>
          <option value="contain">填充</option>
          <option value="100% 100%">撑满</option>
        </select>
        <span>平铺</span>
        <select
          :value="selectedItem.backgroundRepeat"
          @input="handleInput($event, 'backgroundRepeat')"
        >
          <option value="repeat">平铺</option>
          <option value="no-repeat">无</option>
          <option value="repeat-x">水平平铺</option>
          <option value="repeat-Y">垂直平铺</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dt-paint",
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

    fileupload: function (e, attr, type, target) {
      var _this = this;

      if (!target) {
        target = _this.selectedItem;
      }
      target[attr] = "";
      target.loading = true;

      var formData = new FormData();
      formData.append("Prefix", undefined);
      formData.append("ToResource", true);
      formData.append("WebUrl", undefined);
      formData.append("CreateThumbnail", true);
      formData.append("IsLocal", true);
      formData.append("FileType", type);
      formData.append("file", e.target.files[0]);
      $.ajax({
        url:
          _this.$parent.serverConfig.s +
          "/api/File/UploadSingleBigFile?fileArea=Ads",
        type: "POST",
        headers: {
          "Abp.TenantId": this.tenantId,
          Authorization: this.token,
        },
        processData: false,
        contentType: false,
        data: formData,
        dataType: "json",
        success: function (result, status, xhr) {
          target[attr] = result.result.fileUri;
          target.loading = false;
          if (target.type == "image" || target.type == "button") {
            _this.backgroundImageChange(target);
          }
        },
        error: function (xhr, status, error) {
          alert(error);
        },
      });
      e.target.value = ""; //清除该input框的值,防止下个组件提交相同图片时无法触发change事件(因为共用了input)
    },

    backgroundImageChange: function (selectedItem) {
      if (selectedItem.type == "image" || selectedItem.type == "button") {
        var url = selectedItem.backgroundImage;
        var img = new Image();
        img.src = url;
        var _this = this;
        img.addEventListener("load", function (e) {
          console.log("load");
          _this.selectedItem.width = img.width;
          _this.selectedItem.height = img.height;
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>
