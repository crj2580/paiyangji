<template>
  <div class="dt-html">
    <div class="detailGroup" v-show="selectedItem.type == 'html'">
      <label>网页属性</label>
      <div class="row">
        <span class="uploadButton">
          <b>资源</b>
        </span>
        <input @change="fileupload($event, 'resource', 'Other')" type="file" />
        <input type="text" v-model.trim="selectedItem.resource" />
      </div>
      <div class="row">
        <span>下载</span>
        <select v-model.trim="selectedItem.downloadMode">
          <option value="">不下载</option>
          <option value="self">仅下载html</option>
          <option value="all">完全下载</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dt-html",
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
