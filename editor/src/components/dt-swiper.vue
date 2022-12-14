<template>
  <div class="dt-swiper">
    <div class="detailGroup">
      <label>轮播列表</label>

      <div style="text-align: center; position: absolute; right: 1vw; top: 1vw">
        <div
          @click="addSwiper"
          style="
            border: 0.05vw solid #000;
            padding: 0.1vw 0.5vw;
            display: inline-block;
            cursor: pointer;
            border-radius: 0.2vw;
          "
        >
          + 添加
        </div>
      </div>
      <div
        v-for="(item, index) of selectedItem.resourceList"
        style="margin: 0.35vw 0"
        :key="index"
      >
        <div id="swiperDetailItem">
          <div style="width: 20%; text-align: center">
            <img
              @click="item.showDetail = !item.showDetail"
              src="@/assets/img/editor/arrow.png"
              style="width: 0.75vw; margin-top: 0.2vw"
              :style="{
                transform: item.showDetail ? '' : 'rotate(-90deg)',
              }"
            />
          </div>

          <select v-model="item.type" style="width: 25%">
            <option value="image">图片</option>
            <option value="media">视频</option>
          </select>
          <div class="action" v-show="selectedItem.resourceList.length > 1">
            <img
              @click="swiperUp(index)"
              src="@/assets/img/editor/action-up.png"
            />
            <img
              @click="swiperDown(index)"
              src="@/assets/img/editor/action-down.png"
            />
            <img
              @click="swiperDelete(index)"
              src="@/assets/img/editor/action-delete.png"
            />
            <img
              @click="selectedItem.resourceListIndex = index"
              src="@/assets/img/editor/open-eye.png"
              :style="{
                opacity: selectedItem.resourceListIndex == index ? 1 : 0.35,
              }"
            />
          </div>
        </div>

        <div v-show="item.showDetail && item.type == 'image'">
          <div class="row">
            <span class="uploadButton">
              <b>链接</b>
            </span>
            <input
              @change="fileupload($event, 'resource', 'Image', item)"
              type="file"
            />
            <input type="text" v-model.trim="item.resource" />
          </div>
          <div class="dbRow">
            <!-- <span>圆角</span> -->
            <span>
              <img src="@/assets/img/editor/圆角.png" alt="" />
            </span>
            <input type="number" v-model.trim="item.borderRadius" />
            <span>透明</span>
            <input type="text" v-model.trim="item.backgroundOpacity" />
          </div>
          <div class="dbRow">
            <span>拉伸</span>
            <select v-model.trim="item.backgroundSize">
              <option value="">无</option>
              <option value="cover">覆盖</option>
              <option value="contain">填充</option>
              <option value="100% 100%">撑满</option>
            </select>
            <span>平铺</span>
            <select v-model.trim="item.backgroundRepeat">
              <option value="repeat">平铺</option>
              <option value="no-repeat">无</option>
              <option value="repeat-x">水平平铺</option>
              <option value="repeat-Y">垂直平铺</option>
            </select>
          </div>
          <div class="row">
            <span>配置</span>
            <input type="text" v-model.trim="item.extensionData" />
          </div>
        </div>

        <div v-show="item.showDetail && item.type == 'media'">
          <div class="row">
            <span class="uploadButton">
              <b>资源</b>
            </span>
            <input
              @change="fileupload($event, 'resource', 'Video', item)"
              type="file"
            />
            <input type="text" v-model.trim="item.resource" />
          </div>
          <div class="row">
            <span class="uploadButton">
              <b>资源</b>
            </span>
            <input
              @change="fileupload($event, 'poster', 'Image', item)"
              type="file"
            />
            <input type="text" v-model.trim="item.poster" />
          </div>
          <div class="dbRow">
            <span>自动</span>
            <input
              :id="`swiperAutoplay${index}`"
              type="checkbox"
              v-model="item.autoplay"
            />
            <label :for="`swiperAutoplay${index}`"></label>
            <span>循环</span>
            <input
              id="`swiperLoop${index}`"
              type="checkbox"
              v-model.trim="item.loop"
            />
            <label for="`swiperLoop${index}`"></label>
          </div>
          <div class="dbRow">
            <span>控制</span>
            <input
              id="`swiperControl${index}`"
              type="checkbox"
              v-model="item.controls"
            />
            <label for="`swiperControl${index}`"></label>
            <span>静音</span>
            <input
              id="`swiperMuted${index}`"
              type="checkbox"
              v-model="item.muted"
            />
            <label for="`swiperMuted${index}"></label>
          </div>
          <div class="row">
            <span>配置</span>
            <input type="text" v-model.trim="item.extensionData" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dt-swiper",
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
    addSwiper: function () {
      this.selectedItem.resourceList.push({
        type: "image",
        resource: "",
        showDetail: true,
      });
      this.selectedItem.resourceListIndex =
        this.selectedItem.resourceList.length - 1;
    },
    swiperUp: function (index) {
      var target = this.selectedItem.resourceList.splice(index, 1);
      if (index == 0) {
        this.selectedItem.resourceList.push(target[0]);
      } else {
        this.selectedItem.resourceList.splice(index - 1, 0, target[0]);
      }
      this.selectedItem.resourceListIndex = 0;
    },
    swiperDown: function (index) {
      var target = this.selectedItem.resourceList.splice(index, 1);
      if (index == this.selectedItem.resourceList.length) {
        this.selectedItem.resourceList.unshift(target[0]);
      } else {
        this.selectedItem.resourceList.splice(index + 1, 0, target[0]);
      }
      this.selectedItem.resourceListIndex = 0;
    },
    swiperDelete: function (index) {
      this.selectedItem.resourceList.splice(index, 1);
      this.selectedItem.resourceListIndex = 0;
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
