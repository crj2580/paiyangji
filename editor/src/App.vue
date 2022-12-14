<template>
  <div id="app">
    <div @mousemove="mousemove($event)" @mouseup="mouseup">
      <div id="actionContainer">
        <img
          @click="addItem(item)"
          v-for="(item, index) in componentList"
          :key="index"
          :src="newItem.type == item.type ? item.iconFocus : item.icon"
          :title="item.displayName"
        />
      </div>

      <div id="layerContainer">
        <div
          :class="{ selected: item.selected }"
          :title="item.displayName"
          v-for="(item, index) of itemList"
          :style="{ 'border-bottom': index ? 'none' : '0.1vw solid #e4e4e4' }"
          @click.capture="selectItem(item)"
          :key="index"
        >
          <div style="width: 16%; text-align: center; position: relative">
            <img
              v-if="item.type != 'canvas'"
              :src="item.icon"
              style="
                height: 50%;
                top: 25%;
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
              "
            />
          </div>
          <div
            style="
              width: 60%;
              overflow: hidden;
              text-overflow: ellipsis;
              text-indent: 0.2vw;
            "
          >
            {{ item.displayName }}
          </div>
          <div class="operationList" v-if="item.type != 'canvas'">
            <img
              @click.stop="changeEye(item)"
              v-if="item.show"
              src="@/assets/img/editor/eye-open.png"
              style="float: left"
            />
            <img
              @click.stop="changeEye(item)"
              v-if="!item.show"
              src="@/assets/img/editor/eye-close.png"
              style="float: left; display: block"
            />
            <img
              @click.stop="changeLock(item)"
              v-if="item.lock"
              src="@/assets/img/editor/locked.png"
              style="float: right; display: block"
            />
            <img
              @click.stop="changeLock(item)"
              v-if="!item.lock"
              src="@/assets/img/editor/unlocked.png"
              style="float: right"
            />
            <img
              @click.stop="actionDelete()"
              src="@/assets/img/editor/action-delete.png"
            />
          </div>
        </div>
      </div>

      <div id="mainContainer">
        <!-- <div class="item" :class="{selected:item.selected}" v-for="item of [itemList[0]]" @mousedown="itemMousedown($event,item)"
          style="z-index: 0;top:50px;" :style="{left:'calc( 50% - '+item.width/2+'px )',width:item.width+'px',height:item.height+'px'}"> -->
        <div
          :style="{ width: 'calc( ' + itemList[0].width + 'px + ' + '8vw )' }"
          style="min-width: 100%"
        >
          <div
            class="item"
            :class="{ selected: item.selected }"
            v-for="(item, index) of [itemList[0]]"
            @mousedown="itemMousedown($event, item)"
            style="z-index: 0; margin: 4vw auto; position: relative"
            :style="{ width: item.width + 'px', height: item.height + 'px' }"
            :key="index"
          >
            <div
              class="paint"
              style="width: 100%; height: 100%"
              :style="{
                backgroundColor: item.backgroundColor,
                opacity: item.backgroundOpacity,
                backgroundRepeat: item.backgroundRepeat,
                backgroundImage: 'url(' + item.backgroundImage + ')',
                backgroundSize: item.backgroundSize,
                transform: item.transformScale,
              }"
            ></div>

            <div
              v-show="newItem.type != 'pointer'"
              @click="placeNewItem($event)"
              style="
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 99999;
              "
            ></div>

            <div
              class="item"
              :class="{ selected: item.selected, locked: item.lock }"
              v-show="item.show"
              v-if="index"
              v-for="(item, index) of itemList"
              @mousedown.stop="itemMousedown($event, item)"
              draggable="true"
              @dragstart="preventDefault"
              :key="index"
              :style="{
                zIndex: item.zIndex,
                left: item.left + 'px',
                top: item.top + 'px',
                width: item.width + 'px',
                height: item.height + 'px',
                transform: 'rotate(' + item.rotate + 'deg)',
              }"
            >
              <ed-paint
                v-if="item.type == 'button' || item.type == 'image'"
                :value="item"
              ></ed-paint>

              <ed-text v-if="item.type == 'text'" :value="item"></ed-text>
              <ed-media :value="item" v-if="item.type == 'media'"></ed-media>

              <ed-html :value="item" v-if="item.type == 'html'"></ed-html>

              <ed-swiper :value="item" v-if="item.type == 'swiper'"></ed-swiper>

              <ed-qrcode v-if="item.type == 'qrcode'" :value="item"></ed-qrcode>

              <ed-product
                :value="item"
                v-if="item.type == 'product'"
              ></ed-product>

              <div
                class="point t"
                draggable="true"
                @dragstart="preventDefault"
                @mousedown.stop="pointMousedown($event, item, 't')"
              ></div>
              <div
                class="point r"
                draggable="true"
                @dragstart="preventDefault"
                @mousedown.stop="pointMousedown($event, item, 'r')"
              ></div>
              <div
                class="point b"
                draggable="true"
                @dragstart="preventDefault"
                @mousedown.stop="pointMousedown($event, item, 'b')"
              ></div>
              <div
                class="point l"
                draggable="true"
                @dragstart="preventDefault"
                @mousedown.stop="pointMousedown($event, item, 'l')"
              ></div>

              <div
                class="point tl"
                draggable="true"
                @dragstart="preventDefault"
                @mousedown.stop="pointMousedown($event, item, 'tl')"
              ></div>
              <div
                class="point tr"
                draggable="true"
                @dragstart="preventDefault"
                @mousedown.stop="pointMousedown($event, item, 'tr')"
              ></div>
              <div
                class="point br"
                draggable="true"
                @dragstart="preventDefault"
                @mousedown.stop="pointMousedown($event, item, 'br')"
              ></div>
              <div
                class="point bl"
                draggable="true"
                @dragstart="preventDefault"
                @mousedown.stop="pointMousedown($event, item, 'bl')"
              ></div>

              <div
                class="point rotate"
                draggable="true"
                @dragstart="preventDefault"
                @mousedown.stop="pointMousedown($event, item, 'rotate')"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div id="detailContainer" @keyup.stop="">
        <div class="operation" v-show="selectedItem.type != 'canvas'">
          <div title="显隐" @click.stop="changeEye(selectedItem)">
            <img
              v-show="selectedItem.show"
              src="@/assets/img/editor/eye-open.png"
            />
            <img
              v-show="!selectedItem.show"
              src="@/assets/img/editor/eye-close.png"
            />
          </div>
          <div title="锁定" @click="changeLock(selectedItem)">
            <img
              v-show="selectedItem.lock"
              src="@/assets/img/editor/locked.png"
            />
            <img
              v-show="!selectedItem.lock"
              src="@/assets/img/editor/unlocked.png"
            />
          </div>
          <div title="置顶" @click="actionTop">
            <img src="@/assets/img/editor/action-up.png" />
          </div>
          <div title="置底" @click="actionBottom">
            <img src="@/assets/img/editor/action-down.png" />
          </div>
          <div title="复制(Ctrl+C)" @click="actionCopy">
            <img src="@/assets/img/editor/action-copy.png" />
          </div>
          <div title="删除(退格键)" @click="actionDelete">
            <img src="@/assets/img/editor/action-delete.png" />
          </div>
        </div>
        <div :class="{ disabled: selectedItem.lock }">
          <dt-canvas
            :movePermit="movePermit"
            :value="selectedItem"
            @input="handleDetailInput($event)"
            v-if="selectedItem.type == 'canvas'"
          ></dt-canvas>

          <dt-text
            :value="selectedItem"
            @input="handleDetailInput($event)"
            v-if="selectedItem.type == 'text'"
          ></dt-text>

          <dt-paint
            :value="selectedItem"
            v-if="
              selectedItem.type == 'canvas' ||
              selectedItem.type == 'button' ||
              selectedItem.type == 'image'
            "
          ></dt-paint>

          <dt-media
            :value="selectedItem"
            v-if="selectedItem.type == 'media'"
          ></dt-media>

          <dt-basic :value="selectedItem" v-if="selectedItem.type != 'canvas'"></dt-basic>

          <dt-swiper :value="selectedItem" v-if="selectedItem.type == 'swiper'"></dt-swiper>

          <dt-html :value="selectedItem" v-if="selectedItem.type == 'html'"></dt-html>

          <dt-qrcode :grantedActivity="grantedActivity" :value="selectedItem" v-if="selectedItem.type == 'qrcode'"></dt-qrcode>

          <dt-product :value="selectedItem" v-if="selectedItem.type == 'product'"></dt-product>

          <div class="detailGroup">
            <label>额外信息</label>
            <textarea
              @keyup.stop
              cols="30"
              rows="3"
              v-model="selectedItem.extensionData"
            ></textarea>
          </div>
        </div>
      </div>

      <hover-coantiner
        v-if="isReady"
        @currentIndexChange="handleIndexChange"
        :historyListNowIndex="historyListNowIndex"
        :historyList="historyList"
        :itemList="itemList"
      ></hover-coantiner>
    </div>
  </div>
</template>

<script>
import HoverConatiner from "./components/HoverConainter";
import EdText from "./components/ed-text";
import EdPaint from "./components/ed-paint";
import EdQrcode from "./components/ed-qrcode";
import EdHtml from "./components/ed-html";
import EdProduct from "./components/ed-product";
import EdMedia from "./components/ed-media";
import EdSwiper from "./components/ed-swiper";

import DtText from "./components/dt-text";
import DtCanvas from "./components/dt-canvas";
import DtPaint from "./components/dt-paint";
import DtMedia from "./components/dt-media";
import DtBasic from "./components/dt-basic";
import DtSwiper from "./components/dt-swiper";
import DtHtml from "./components/dt-html";
import DtQrcode from "./components/dt-qrcode";
import DtProduct from "./components/dt-product";

export default {
  name: "App",
  components: {
    "hover-coantiner": HoverConatiner,
    "ed-text": EdText,
    "ed-media": EdMedia,
    "ed-paint": EdPaint,
    "ed-qrcode": EdQrcode,
    "ed-html": EdHtml,
    "ed-product": EdProduct,
    "ed-swiper": EdSwiper,
    "dt-text": DtText,
    "dt-canvas": DtCanvas,
    "dt-paint": DtPaint,
    "dt-media": DtMedia,
    "dt-basic": DtBasic,
    "dt-swiper": DtSwiper,
    "dt-html": DtHtml,
    "dt-qrcode": DtQrcode,
    "dt-product": DtProduct,
  },
  data() {
    return {
      isReady: false,
      token: "",
      tenantId: "",
      componentList: {
        pointer: {
          type: "pointer",
          displayName: "指针",
          icon: "@/assets/img/editor/pointer.png",
          iconFocus: "@/assets/img/editor/pointer_focus.png",
        },
        button: {
          type: "button",
          displayName: "热区",
          icon: "@/assets/img/editor/button.png",
          iconFocus: "@/assets/img/editor/button_focus.png",
        },
        image: {
          type: "image",
          displayName: "图片",
          icon: "@/assets/img/editor/image.png",
          iconFocus: "@/assets/img/editor/image_focus.png",
        },
        text: {
          type: "text",
          displayName: "文本",
          icon: "@/assets/img/editor/text.png",
          iconFocus: "@/assets/img/editor/text_focus.png",
        },
        media: {
          type: "media",
          displayName: "视频",
          icon: "@/assets/img/editor/media.png",
          iconFocus: "@/assets/img/editor/media_focus.png",
        },
        swiper: {
          type: "swiper",
          displayName: "轮播",
          icon: "@/assets/img/editor/swiper.png",
          iconFocus: "@/assets/img/editor/swiper_focus.png",
        },
        html: {
          type: "html",
          displayName: "网页",
          icon: "@/assets/img/editor/html.png",
          iconFocus: "@/assets/img/editor/html_focus.png",
        },
        qrcode: {
          type: "qrcode",
          displayName: "二维码",
          icon: "@/assets/img/editor/qrcode.png",
          iconFocus: "@/assets/img/editor/qrcode_focus.png",
        },
        product: {
          type: "product",
          displayName: "商品",
          icon: "@/assets/img/editor/product.png",
          iconFocus: "@/assets/img/editor/product_focus.png",
        },
      },

      itemList: [
        {
          show: true,
          lock: false,
          displayName: "画布",
          selected: true,
          type: "canvas",
          width: 1080,
          height: 1920,
          left: 100,
          top: 100,
          rotate: 0,
          backgroundColor: "#ffffff",
          backgroundImage: "",
          backgroundOpacity: 1,
          backgroundSize: "",
          backgroundRepeat: "repeat",
          canvasSize: 1,
        },
      ],
      newItem: { type: "pointer" },
      basicData: {
        name: "",
        type: "basic",
      },
      historyList: [],
      historyListNowIndex: 0,
      activityList: [],
      movePermit: false, //拉升/拖动时提供数据
      displayWidth: 0,
      displayHeight: 0,
      canvasScale: 1.0,
      localhost: true,
      serverConfig: {},
      grantedActivity: false,
      newItemStaticPosition: false,
    };
  },
  computed: {
    selectedItem: {
      get() {
        for (var i = 0; i < this.itemList.length; i++) {
          if (this.itemList[i].selected) {
            return this.itemList[i];
          }
        }
        return {};
      },
    },
  },
  methods: {
    handleDetailInput(e) {
      // this.selectedItem = e;
    },
    // flag 前进后退标识
    handleIndexChange: function (flag) {
      if (flag) {
        this.historyListNowIndex++;
      } else {
        this.historyListNowIndex--;
      }
      var data = this.historyList[this.historyListNowIndex];
      this.itemList = data.itemList;
    },

    kindId: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return decodeURI(r[2]);
      } else {
        return false;
      }
    },

    
    preventDefault: function (event) {
      event.preventDefault();
      return false;
    },

    changeEye: function (item) {
      item.show = !item.show;
      this.saveAnchorToHistory();
    },
    changeLock: function (item) {
      item.lock = !item.lock;
      this.saveAnchorToHistory();
    },
    actionTop: function () {
      this.selectedItem.zIndex = this.itemList.reduce(
        (lastValue, currentValue, currentIndex, arr) => {
          if (
            currentValue.zIndex >= 10000 &&
            lastValue <= currentValue.zIndex
          ) {
            return currentValue.zIndex + 1;
          } else {
            return lastValue;
          }
        },
        10000
      );
      this.saveAnchorToHistory();
    },
    actionBottom: function () {
      this.selectedItem.zIndex = this.itemList.reduce(
        (lastValue, currentValue, currentIndex, arr) => {
          if (currentValue.zIndex < 100 && lastValue >= currentValue.zIndex) {
            return currentValue.zIndex - 1;
          } else {
            return lastValue;
          }
        },
        99
      );
      this.saveAnchorToHistory();
    },
    actionCopy: function () {
      var newItem = Object.assign({}, this.selectedItem);
      newItem.displayName += "复制";
      newItem.left = newItem.left + newItem.width / 10;
      newItem.top = newItem.top + newItem.height / 10;

      this.itemList.push(newItem);
      this.selectedItem.selected = false;
      this.selectItem(newItem);
      this.saveAnchorToHistory();
    },
    actionDelete: function () {
      if (this.itemList.length <= 1) return;

      this.itemList.splice(this.itemList.indexOf(this.selectedItem), 1);
      this.itemList[this.itemList.length - 1] &&
        (this.itemList[this.itemList.length - 1].selected = true);
      this.saveAnchorToHistory();
    },
    mousemove: function (e) {
      var movePermit = this.movePermit;
      var item = this.selectedItem;
      if (!movePermit) return;
      var type = movePermit.type,
        originX = movePermit.originX,
        originY = movePermit.originY,
        originLeft = movePermit.originLeft,
        originTop = movePermit.originTop,
        originWidth = movePermit.originWidth,
        originHeight = movePermit.originHeight,
        originRotate = movePermit.originRotate,
        originRect = movePermit.originRect;
      if (type == "move") {
        item.left = (e.pageX - originX) / this.canvasScale + originLeft;
        item.top = (e.pageY - originY) / this.canvasScale + originTop;
      } else if (type == "rotate") {
        var xx = e.pageX - originWidth / 2 - $(".item.selected").offset().left,
          yy = e.pageY - originHeight / 2 - $(".item.selected").offset().top;
        var deg = Math.round((Math.atan(xx / -yy) * 180) / Math.PI);
        if (xx >= 0 && yy < 0) {
          item.rotate = deg;
        } else if (xx >= 0 && yy >= 0) {
          item.rotate = 180 + deg;
        } else if (xx < 0 && yy < 0) {
          item.rotate = 360 + deg;
        } else if ((xx < 0, yy >= 0)) {
          item.rotate = 180 + deg;
        }
      } else {
        if (type.length == 2) {
          //FIXME
          //此处原本通过判断鼠标相对拖拽点位置,决定以横向为准还是纵向为准
          //在临界点处会引起闪烁,因此当前统一以纵向为准
          // if (Math.abs(e.pageX - originX) / Math.abs(e.pageY - originY) >= originWidth / originHeight) {
          if (type == "br" || type == "bl") {
            $(".item.selected").height(e.pageY - originY + originHeight);
          } else {
            $(".item.selected").height(originY - e.pageY + originHeight);
          }
          $(".item.selected").width(
            ($(".item.selected").height() * originWidth) / originHeight
          );
          // } else {
          //   if (type == 'tr' || type == 'br') {
          //     $('.item.selected').width(e.pageX - originX + originHeight)
          //   } else {
          //     $('.item.selected').width(originX - e.pageX + originHeight)
          //   }
          //   $('.item.selected').height($('.item.selected').width() / originWidth * originHeight)
          // }
        } else {
          if (type == "r") {
            $(".item.selected").width(e.pageX - originX + originWidth);
          } else if (type == "b") {
            $(".item.selected").height(e.pageY - originY + originHeight);
          } else if (type == "t") {
            $(".item.selected").height(originY - e.pageY + originHeight);
          } else if (type == "l") {
            $(".item.selected").width(originX - e.pageX + originWidth);
          }
        }

        this.displayWidth = $(".item.selected").width();
        this.displayHeight = $(".item.selected").height();
        var newRect = this.transformedRect({
          left: originLeft,
          top: originTop,
          rotate: originRotate,
          width:
            type == "b" || type == "t"
              ? originWidth
              : $(".item.selected").width(),
          height:
            type == "r" || type == "l"
              ? originHeight
              : $(".item.selected").height(),
        });

        if (type == "r" || type == "b" || type == "br") {
          setTopAndLeft(0);
        } else if (type == "l" || type == "t" || type == "tl") {
          setTopAndLeft(4);
        } else if (type == "tr") {
          setTopAndLeft(6);
        } else if (type == "bl") {
          setTopAndLeft(2);
        }
        function setTopAndLeft(basePoint) {
          item.top =
            -newRect.point[basePoint].y +
            originRect.point[basePoint].y +
            originTop;
          item.left =
            -newRect.point[basePoint].x +
            originRect.point[basePoint].x +
            originLeft;
        }
      }
    },
    mouseup: function (e) {
      if (this.movePermit) {
        this.movePermit = false;
        this.selectedItem.width = $(".item.selected").width();
        this.selectedItem.height = $(".item.selected").height();
        this.saveAnchorToHistory();
      }
    },
    selectItem: function (item) {
      if (item.selected) return;
      this.itemList.forEach((item) => {
        item.selected = false;
      });
      item.selected = true;
      this.saveAnchorToHistory();
    },
    addItem: function (component) {
      if (component.type == "pointer") {
        document.body.style.cursor = "auto";
        this.newItem = { type: "pointer" };
        return;
      } else {
        document.body.style.cursor = "url(" + component.icon + "),auto";
      }
      var type = component.type,
        icon = component.icon;

      var newItem = {
        show: true,
        lock: false,
        selected: false,
        type: type,
        icon: icon,
        width: 100,
        height: 100,
        left: 68,
        top: 118,
        rotate: 0,
        extensionData: "",
        zIndex: 100,
        transformScale: "",
      };

      if (type == "button") {
        newItem = Object.assign(newItem, {
          width: 100,
          height: 50,
          backgroundColor: "#eeeeee",
          backgroundImage: "",
          backgroundOpacity: 1,
          backgroundSize: "100% 100%",
          backgroundRepeat: "repeat",
          borderRadius: 0,
        });
      } else if (type == "image") {
        newItem = Object.assign(newItem, {
          backgroundColor: "#eeeeee",
          backgroundImage: "",
          backgroundOpacity: 1,
          backgroundSize: "100% 100%",
          backgroundRepeat: "repeat",
          borderRadius: 0,
        });
      } else if (type == "text") {
        newItem = Object.assign(newItem, {
          width: 100,
          height: 14,
          color: "#000000",
          opacity: 1,
          fontSize: 14,
          fontFamily: "黑体",
          letterSpacing: 0,
          fontWeight: false,
          fontStyle: false,
          textIndent: 0,
          lineHeight: 14,
          textAlign: "left",
          whiteSpace: "normal",
          textContent: "测试文本",
        });
      } else if (type == "media") {
        newItem = Object.assign(newItem, {
          // width: '',
          // height: '',
          autoplay: true,
          loop: false,
          controls: false,
          muted: false,
          resource: "", //@/assets/img/editor/six.mp4
          poster: "", //@/assets/img/editor/arrow.png
        });
      } else if (type == "swiper") {
        newItem = Object.assign(newItem, {
          resourceListIndex: 0,
          resourceList: [
            {
              showDetail: true,
              type: "image",
            },
          ],
        });
      } else if (type == "html") {
        newItem = Object.assign(newItem, {
          resource: "",
          downloadMode: "",
        });
      } else if (type == "qrcode") {
        newItem = Object.assign(newItem, {
          qrcodeType: "normal",
          activityId: "",
          gameId: "",
          gameList: [],
        });
      } else if (type == "product") {
        newItem = Object.assign(newItem, {
          productId: "",
          optList: [],
          productName: "",
          picUrl: "",
        });
      }
      this.newItem = newItem;
    },

    placeNewItem: function (event) {
      var newItem = Object.assign({}, this.newItem);
      newItem.zIndex = this.itemList.reduce(
        (lastValue, currentValue, currentIndex, arr) => {
          if (currentValue.zIndex < 10000 && lastValue <= currentValue.zIndex) {
            return currentValue.zIndex + 1;
          } else {
            return lastValue;
          }
        },
        100
      );
      newItem.displayName = this.itemList.reduce(
        (lastValue, currentValue, currentIndex, arr) => {
          if (
            currentValue.type == newItem.type &&
            currentValue.displayName &&
            currentValue.displayName.indexOf(newItem.type) == 0 &&
            parseInt(currentValue.displayName.substr(newItem.type.length)) >=
              parseInt(lastValue.substr(newItem.type.length))
          ) {
            return (
              newItem.type +
              (parseInt(currentValue.displayName.substr(newItem.type.length)) +
                1)
            );
          } else {
            return lastValue;
          }
        },
        newItem.type + 1
      );

      if (this.newItemStaticPosition) {
        newItem.left = 0;
        newItem.top = 0;
      } else {
        newItem.left = event.offsetX; //鼠标指针位置相对于触发事件的对象的 x 坐标
        newItem.top = event.offsetY;
      }

      this.itemList.push(newItem);
      this.selectItem(newItem);
      if (newItem.type == "media") {
        this.$nextTick(() => {
          var _this = this;
          $(".item.selected video").one("loadedmetadata", function () {
            _this.selectedItem.height = $(".item.selected").height();
          });
        });
      }
    },

    itemMousedown: function (e, item) {
      this.selectItem(item);
      if (item.type == "canvas" || item.lock) return;
      // //记录鼠标刚按下时的位置，相对div而言
      // var offsetX = e.offsetX;//鼠标指针位置相对于触发事件的对象的 x 坐标
      // var offsetY = e.offsetY;
      // console.log(offsetX, offsetY)
      // console.log($(e.target).offset().top)
      this.displayWidth = item.width;
      this.displayHeight = item.height;
      this.movePermit = {
        type: "move",
        originX: e.pageX,
        originY: e.pageY,
        originLeft: item.left,
        originTop: item.top,
      };
    },
    transformedRect: function (item) {
      var x = item.left;
      var y = item.top;
      var width = item.width;
      var height = item.height;
      var angle = item.rotate;

      var r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
      // var a = Math.round(Math.atan(height / width) * 180 / Math.PI);
      var a = (Math.atan(height / width) * 180) / Math.PI;
      var tlbra = 180 - angle - a;
      var trbla = a - angle;
      var ta = 90 - angle;
      var ra = angle;

      var halfWidth = width / 2;
      var halfHeight = height / 2;

      var middleX = x + halfWidth;
      var middleY = y + halfHeight;

      var topLeft = {
        x: middleX + r * Math.cos((tlbra * Math.PI) / 180),
        y: middleY - r * Math.sin((tlbra * Math.PI) / 180),
      };
      var top = {
        x: middleX + halfHeight * Math.cos((ta * Math.PI) / 180),
        y: middleY - halfHeight * Math.sin((ta * Math.PI) / 180),
      };
      var topRight = {
        x: middleX + r * Math.cos((trbla * Math.PI) / 180),
        y: middleY - r * Math.sin((trbla * Math.PI) / 180),
      };
      var right = {
        x: middleX + halfWidth * Math.cos((ra * Math.PI) / 180),
        y: middleY + halfWidth * Math.sin((ra * Math.PI) / 180),
      };
      var bottomRight = {
        x: middleX - r * Math.cos((tlbra * Math.PI) / 180),
        y: middleY + r * Math.sin((tlbra * Math.PI) / 180),
      };
      var bottom = {
        x: middleX - halfHeight * Math.sin((ra * Math.PI) / 180),
        y: middleY + halfHeight * Math.cos((ra * Math.PI) / 180),
      };
      var bottomLeft = {
        x: middleX - r * Math.cos((trbla * Math.PI) / 180),
        y: middleY + r * Math.sin((trbla * Math.PI) / 180),
      };
      var left = {
        x: middleX - halfWidth * Math.cos((ra * Math.PI) / 180),
        y: middleY - halfWidth * Math.sin((ra * Math.PI) / 180),
      };
      var center = {
        x: middleX,
        y: middleY,
      };
      var minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
      var maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
      var minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
      var maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
      return {
        point: [
          topLeft,
          top,
          topRight,
          right,
          bottomRight,
          bottom,
          bottomLeft,
          left,
          center,
        ],
        width: maxX - minX,
        height: maxY - minY,
        left: minX,
        right: maxX,
        top: minY,
        bottom: maxY,
      };
    },
    pointMousedown: function (e, item, direction) {
      this.displayWidth = item.width;
      this.displayHeight = item.height;
      this.movePermit = {
        type: direction,
        originX: e.pageX,
        originLeft: item.left,
        originTop: item.top,
        originWidth: item.width,
        originY: e.pageY,
        originHeight: item.height,
        originRotate: item.rotate,
        originRect: this.transformedRect(this.selectedItem),
      };
    },
    getDate: function () {
      var myDate = new Date();
      var month = myDate.getMonth() + 1,
        date = myDate.getDate(),
        hour = myDate.getHours(),
        minute = myDate.getMinutes(),
        second = myDate.getSeconds();
      if (month < 10) month = "0" + month;
      return `${myDate.getFullYear()}${month}${date}${hour}${minute}${second}`;
    },
    saveAnchorToHistory: function () {
      this.$nextTick(() => {
        if (this.historyListNowIndex != this.historyList.length - 1) {
          //back后再次进行操作时,清空所有forward内容
          this.historyList.splice(this.historyListNowIndex + 1);
        }
        var data = JSON.parse(
          JSON.stringify({
            itemList: this.itemList,
            basicData: this.basicData,
          })
        );
        this.historyList.push(data);
        this.historyListNowIndex = this.historyList.length - 1;
        this.$forceUpdate();
      });
    },
    getGame: function (targetItem) {
      var _this = this;
      $.ajax({
        url:
          _this.serverConfig.g +
          "/api/services/app/Activity/GetActivityGamesByActivityId",
        type: "GET",
        headers: {
          "Abp.TenantId": _this.tenantId,
          Authorization: _this.token,
        },
        data: {
          ActivityId: targetItem.activityId,
          MaxResultCount: 999,
          SkipCount: 0,
        },
        success: function (result, status, xhr) {
          targetItem.gameList = result.result.items.map((game) => ({
            id: game.id,
            name: game.name,
          }));
        },
        error: function (xhr, status, error) {
          alert(error);
        },
      });
    },
    getData: function (data) {
      if (data.itemList) {
        this.itemList = data.itemList;
        data.itemList.forEach((item) => {
          if (item.type == "qrcode" && item.qrcodeType == "activity") {
            this.getGame(item);
          }
          if (item.type == "product" && item.productId) {
            this.getProduct(item);
          }
        });
      }
      if (data.basicData) {
        this.basicData = data.basicData;
      }

      this.saveAnchorToHistory();
    },
    maybeProduct: function (event, item) {
      var _this = this;
      var target = item.optList.find(
        (bro) => bro.productName == _this.selectedItem.productName
      );
      if (target) {
        item.productId = target.id;
        item.picUrl = target.picUrl;
        item.optList = [];
        console.log(true, item);
      }
    },
    searchProduct: function (event, item) {
      var _this = this;
      var target = item.optList.find(
        (bro) => bro.productName == _this.selectedItem.productName
      );
      if (target) {
        return;
        item.productId = target.id;
        item.picUrl = target.picUrl;
        item.optList = [];
        console.log(true, item);
      } else {
        $.ajax({
          url: _this.serverConfig.s + "/api/services/app/Product/GetProducts",
          // url: (_this.localhost ? 'https://s2.api.troncell.com' : 'https://s.api.troncell.com') + '/api/services/app/Product/GetProducts',
          type: "GET",
          headers: {
            "Abp.TenantId": _this.tenantId,
            Authorization: _this.token,
          },
          data: {
            Filter: _this.selectedItem.productName,
            MaxResultCount: 10,
            SkipCount: 0,
          },
          success: function (result, status, xhr) {
            item.optList = result.result.items.map((product) => ({
              id: product.id,
              productName: product.title,
              picUrl: product.picUrl,
            }));
          },
          error: function (xhr, status, error) {
            alert(error);
          },
        });
      }
    },
    getProduct: function (targetItem) {
      var _this = this;
      $.ajax({
        url:
          _this.serverConfig.s + "/api/services/app/Product/GetSingleProduct",
        // url: (_this.localhost ? 'https://s2.api.troncell.com' : 'https://s.api.troncell.com') + '/api/services/app/Product/GetSingleProduct',
        type: "GET",
        headers: {
          "Abp.TenantId": _this.tenantId,
          Authorization: _this.token,
        },
        data: {
          CurrentProductId: targetItem.productId,
        },
        success: function (result, status, xhr) {
          targetItem.picUrl = result.result.picUrl;
          targetItem.productName = result.result.title;
        },
        error: function (xhr, status, error) {
          alert(error);
        },
      });
    },
  },
  mounted: function () {
    var _this = this;
    this.newItemStaticPosition = this.kindId("newItemStaticPosition");
    this.basicData.name = `新建画布`;
    $("input,textarea,select").bind("change", this.saveAnchorToHistory);

    // this.saveAnchorToHistory();
    window.addEventListener("message", function (e) {
      console.log(e.origin);
      if (e.origin.indexOf("localhost") == -1) {
        _this.localhost = false;
      }
      try {
        var data = JSON.parse(e.data);
        console.log(data);
        _this.token = data.token;
        _this.tenantId = data.tenantId;
        _this.grantedActivity = data.grantedActivity;
        _this.serverConfig = data.serverConfig;
        _this.getData(data);

        _this.isReady = true;
        $.ajax({
          url: _this.serverConfig.p + "/api/services/app/ToolBox/GetToolBoxs",
          type: "GET",
          headers: {
            "Abp.TenantId": _this.tenantId,
            Authorization: _this.token,
          },
          data: {
            Enabled: true,
            Sorting: "orderNumber ASC",
            MaxResultCount: 999,
          },
          success: function (result, status, xhr) {
            // _this.componentList = result.result.items;
            var newComponentList = {};
            result.result.items.forEach((item) => {
              newComponentList[item.type] = {
                type: item.type,
                displayName: item.displayName,
                icon: item.icon,
                iconFocus: item.iconFocus,
              };
            });
            _this.componentList = newComponentList;
          },
          error: function (xhr, status, error) {
            alert(error);
          },
        });
        if (_this.grantedActivity) {
          $.ajax({
            url:
              _this.serverConfig.g + "/api/services/app/Activity/GetActivities",
            // url: (_this.localhost ? 'https://g2.api.troncell.com' : 'https://g.api.troncell.com') + '/api/services/app/Activity/GetActivities',
            type: "GET",
            headers: {
              "Abp.TenantId": _this.tenantId,
              Authorization: _this.token,
            },
            data: {
              IsTemplate: false,
              MaxResultCount: 999,
              SkipCount: 0,
            },
            success: function (result, status, xhr) {
              _this.activityList = result.result.items.map((activity) => ({
                id: activity.id,
                name: activity.name,
              }));
            },
            error: function (xhr, status, error) {
              alert(error);
            },
          });
        }
      } catch (error) {
        console.log(error);
        // alert("数据格式有误,请重新导入");
      }
    });
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
