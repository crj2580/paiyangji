<template>
  <div id="Navigation">
    <div id="leftBtnList">
      <div @click="jumpIcon('elevator')" class="btn elevator"></div>
      <div @click="jumpIcon('toilet')" class="btn toilet"></div>
      <div @click="jumpIcon('startPoint')" class="btn startPoint"></div>
    </div>
    <div id="topBtnList">
      <div @click="jumpIcon('reception')" class="btn reception"></div>
      <div @click="jumpIcon('disabled')" class="btn disabled"></div>
      <!-- <div @click="jumpIcon('children')" class="btn children"></div> -->
      <div @click="jumpIcon('maternal')" class="btn maternal"></div>
      <!-- <div @click="jumpIcon('smoking')" class="btn smoking"></div> -->
    </div>
    <!-- 用于展示当前楼层的地图 -->
    <div id="mapContainer">
      <div ref="mapContainer4Show" id="mapContainer4Show">
        <img :src="transferUrl(floorList[nowFloorIndex].img)" />
        <div
          v-for="point of pointList4Show"
          :key="point.id"
          class="point"
          :style="{ left: point.left + '%', top: point.top + '%' }"
          @touchstart="beforeClickPointOnMap"
          @touchend="clickPointOnMap($event, point)"
        >
          <img
            v-if="point.id == startPointId"
            :class="{ iconJump: jumpIconType == 'startPoint' }"
            src="../assets/img/Navigation/startPoint.png"
          />
          <img
            v-if="point.type == 'elevator'"
            :class="{ iconJump: jumpIconType == 'elevator' }"
            src="../assets/img/Navigation/icons/elevator.png"
          />
          <img
            v-if="point.type == 'toilet'"
            :class="{ iconJump: jumpIconType == 'toilet' }"
            src="../assets/img/Navigation/icons/toilet.png"
          />
          <img
            v-if="point.type == 'disabled'"
            :class="{ iconJump: jumpIconType == 'disabled' }"
            src="../assets/img/Navigation/icons/disabled.png"
          />
          <img
            v-if="point.type == 'escalator'"
            :class="{ iconJump: jumpIconType == 'escalator' }"
            src="../assets/img/Navigation/icons/escalator.png"
          />
          <img
            v-if="point.type == 'maternal'"
            :class="{ iconJump: jumpIconType == 'maternal' }"
            src="../assets/img/Navigation/icons/maternal.png"
          />
          <img
            v-if="point.type == 'reception'"
            :class="{ iconJump: jumpIconType == 'reception' }"
            src="../assets/img/Navigation/icons/reception.png"
          />
          <img
            v-if="point.type == 'staircase'"
            :class="{ iconJump: jumpIconType == 'staircase' }"
            src="../assets/img/Navigation/icons/staircase.png"
          />
          <template v-if="point.type == 'store'">
            <img v-if="point.logoUrl" :src="transferUrl(point.logoUrl)" />
            <div v-else class="storeInfo">
              <!-- <div>{{ point.name }}</div> -->
              <div>{{ point.brandName }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 品牌列表 -->
    <div id="brandList">
      <div class="title">{{ floorList[nowFloorIndex].name }}品牌</div>
      <swiper
        v-if="showBrandSwiper"
        ref="swiperBrand"
        :options="swiperOption4BrandList"
        :auto-update="false"
      >
        <template v-for="(brandList, index) of computedBrandList">
          <swiper-slide :key="index">
            <div class="logoListContainer">
              <div
                class="logoContainer"
                v-for="brand of brandList"
                :key="brand.pointId"
                @click="tapBrand(brand.id)"
              >
                <img v-if="brand.img" :src="transferUrl(brand.img)" />
                <img v-else src="@/assets/img/noLogo.png" />
                <p>{{ brand.brandName }}</p>
              </div>
            </div>
          </swiper-slide>
        </template>
      </swiper>
      <div class="btn-up" @click="lastBrand"></div>
      <div class="btn-down" @click="nextBrand"></div>
    </div>

    <!-- 楼层列表 -->
    <div id="floorList">
      <swiper ref="swiperFloor" :options="swiperOption4FloorList">
        <template v-for="(floor, index) of floorList">
          <swiper-slide :key="floor.id" :data-floorindex="index">
            <div
              class="floorContainer"
              :class="{ selected: nowFloorIndex == index }"
            >
              <div class="floorItem">
                <img
                  v-if="!Portrait && nowFloorIndex == index"
                  src="@/assets/img/Navigation/arrow-left.png"
                />
                {{ floor.name }}
                <img
                  v-if="Portrait && nowFloorIndex == index"
                  src="@/assets/img/Navigation/arrow-bottom.png"
                />
              </div>
              <div class="line" v-if="index != floorList.length - 1"></div>
            </div>
          </swiper-slide>
        </template>
      </swiper>
      <div class="arrow-up" @click="arrowUp"></div>
      <div class="arrow-down" @click="arrowDown"></div>
    </div>
  </div>
</template>

<script>
import panzoom from "panzoom";

export default {
  name: "Navigation",
  props: ["device", "floors", "brands"],
  data() {
    return {
      // startPointId: "b1ca0283-bac4-4f67-0c83-08d881617e34",
      angle: 0,
      flagList: [],
      floorList: [], //经过整理的带有brand等信息的数组
      nowFloorIndex: 0,
      panzoomInstance: null,
      showBrandSwiper: false,
      Portrait: process.env.VUE_APP_THEME == "Portrait",
      jumpIconType: null,
      lastTouchStartTime: null,
    };
  },
  created() {
    this.floorList = Object.freeze(
      this.floors.map((floor) => {
        var brandList = [];
        floor.rooms
          .filter((room) => room.roomType == "store")
          .forEach((room) => {
            var storeBrand = this.brands.find(
              (brand) => brand.name == room.brandName
            );
            if (storeBrand) {
              brandList.push({
                id: storeBrand.id,
                brandName: storeBrand.name,
                img: storeBrand.logoUrl,
                pointId: room.id,
              });
            }
          });
        return {
          name: floor.name,
          no: floor.no,
          img: floor.floorResources.find(
            (resource) => resource.angle == this.angle
          ).imageUrl,
          brandList: brandList,
        };
      })
    );

    console.log("floorList", this.nowFloorIndex, this.floorList);

    this.preload().then(() => {
      this.reloadPanZoom();
      this.generateFlagList();
      this.showBrandSwiper = true;
    });
  },

  beforeDestroy() {
    if (this.panzoomInstance) {
      this.panzoomInstance.dispose();
    }
  },
  computed: {
    computedBrandList() {
      var computedBrandList = [],
        brandList = this.floorList[this.nowFloorIndex].brandList,
        countPerSlide = process.env.VUE_APP_THEME == "Portrait" ? 15 : 12;
      for (let i = 0; i < Math.ceil(brandList.length / countPerSlide); i++) {
        computedBrandList.push(
          brandList.slice(i * countPerSlide, (i + 1) * countPerSlide)
        );
      }
      console.log(computedBrandList);
      return computedBrandList;
    },
    startPointId() {
      return this.device.address;
    },
    swiperOption4BrandList() {
      return {
        direction:
          process.env.VUE_APP_THEME == "Portrait" ? "horizontal" : "vertical",
      };
    },
    swiperOption4FloorList() {
      var _this = this;
      return {
        direction:
          process.env.VUE_APP_THEME == "Portrait" ? "horizontal" : "vertical",
        slidesPerView: process.env.VUE_APP_THEME == "Portrait" ? 5 : 4.5,
        initialSlide: this.startFloorIndex,
        on: {
          tap() {
            if (this.clickedSlide) {
              _this.showBrandSwiper = false;
              _this.nowFloorIndex = this.clickedSlide.dataset.floorindex;
              _this.reloadPanZoom();
              _this.$nextTick(() => {
                _this.showBrandSwiper = true;
              });
            }
          },
        },
      };
    },
    startFloorIndex() {
      var startFloor = this.floors.find((floor) =>
        floor.rooms.some(
          (room) => room.id == this.startPointId
        )
      );
      console.log(this.startPointId,"startFloor",startFloor)
      if (startFloor) {
        return this.floors.indexOf(startFloor);
      } else {
        alert("起始点配置出错");
        return null;
      }
    },
    swiperFloor() {
      return this.$refs.swiperFloor.$swiper;
    },
    pointList4Show() {
      //用于展示当前楼层的点位
      return this.flagList.filter(
        (flag) => flag.no == this.floorList[this.nowFloorIndex].no
      );
    },
  },
  mounted() {
    this.nowFloorIndex = this.startFloorIndex;
  },

  methods: {
    jumpIcon(iconType) {
      this.jumpIconType = iconType;
    },
    lastBrand() {
      this.$refs.swiperBrand.$swiper.slidePrev();
    },
    nextBrand() {
      this.$refs.swiperBrand.$swiper.slideNext();
    },
    arrowUp() {
      this.swiperFloor.slidePrev();
    },
    arrowDown() {
      this.swiperFloor.slideNext();
    },
    //预加载所有当前角度的floor图片
    preload() {
      return new Promise((resolve) => {
        var queue = new window.createjs.LoadQueue(false);
        queue.on("complete", () => {
          resolve();
        });
        queue.loadManifest(
          this.floorList.filter((item) => item.img).map((item) => item.img)
        );
      });
    },
    generateFlagList() {
      var allFlagList = [];
      this.floors.forEach((floorDetail) => {
        var flagList = floorDetail.rooms
          .filter((room) =>
            room.pathLocations.some(
              (pathLocations) => pathLocations.angle == this.angle
            )
          )
          .map((room) => {
            var pathLocation = room.pathLocations.find(
              (pathLocations) => pathLocations.angle == this.angle
            );
            return {
              id: room.id,
              left: pathLocation.pathLocationX,
              top: pathLocation.pathLocationY,
              logoUrl: room.brandLogo,
              brandName: room.brandName,
              type: room.roomType,
              name: room.name,
              no: floorDetail.no,
            };
          });
        allFlagList = allFlagList.concat(flagList);
      });
      this.flagList = allFlagList;
    },
    beforeClickPointOnMap() {
      this.lastTouchStartTime = new Date().getTime();
    },
    tapBrand(brandId) {
      this.$emit("show-room-detail", {
        brandId,
      });
    },
    clickPointOnMap(e, point) {
      // console.log(new Date().getTime() - this.lastTouchStartTime);
      if (e.touches.length) {
        return;
      } else if (new Date().getTime() - this.lastTouchStartTime < 200) {
        console.log("Click Point", point);
        if (
          point.type != "path" &&
          point.type != "staircase" &&
          point.type != "elevator" &&
          point.type != "escalator"
        ) {
          this.$emit("show-room-detail", {
            roomId: point.id,
          });
        }
        return;
      }
    },
    reloadPanZoom() {
      if (this.panzoomInstance) {
        this.panzoomInstance.dispose();
      }
      this.$refs.mapContainer4Show.style.opacity = 0;
      this.panzoomInstance = panzoom(this.$refs.mapContainer4Show, {
        pinchSpeed: 1,
        maxZoom: 5,
        minZoom: 0.5,
        bounds: true,
        boundsPadding: 0.05,
        autocenter: true,
        zoomDoubleClickSpeed: 1, //禁止双击放大
      });
      this.$refs.mapContainer4Show.style.opacity = 1;
    },
  },
};
</script>
<style scoped lang="scss">
#Navigation {
  #leftBtnList {
    position: absolute;
    left: 2vw;
    bottom: 20vh;
    z-index: 2;
    .btn {
      width: 3.5vmax;
      height: 3.5vmax;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      margin-top: 1.5vmax;
    }
    .elevator {
      background-image: url(../assets/img/Navigation/elevator.png);
    }
    .startPoint {
      background-image: url(../assets/img/Navigation/startPoint.png);
    }
    .toilet {
      background-image: url(../assets/img/Navigation/toilet.png);
    }
  }
  #topBtnList {
    position: absolute;
    left: 70vw;
    top: 7.6vh;
    z-index: 2;
    .btn {
      display: inline-block;
      width: 1.75vmax;
      height: 1.75vmax;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
      margin-right: 1vmax;
    }
    .children {
      background-image: url(../assets/img/Navigation/children.png);
    }
    .disabled {
      background-image: url(../assets/img/Navigation/disabled.png);
    }
    .maternal {
      background-image: url(../assets/img/Navigation/maternal.png);
    }
    .reception {
      background-image: url(../assets/img/Navigation/reception.png);
    }
    .smoking {
      background-image: url(../assets/img/Navigation/smoking.png);
    }
  }
  #brandList {
    position: absolute;
    width: 30vw;
    height: 70vh;
    top: 12vh;
    right: 1.5vw;
    background: #fff;
    border-radius: 1.5vmax;
    box-shadow: 0 0 1vmax rgba(0, 0, 0, 0.2);
    .title {
      width: 100%;
      text-align: center;
      font-size: 1.5vmax;
      font-weight: bold;
      line-height: 4vmax;
    }
    .swiper-container {
      position: absolute;
      width: 80%;
      height: 78%;
      top: 10%;
      left: 10%;
      .swiper-slide {
        text-align: center;
        position: relative;
        width: 100%;
        height: 100%;
        .logoListContainer {
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          width: 100%;
          height: 100%;
          .logoContainer {
            margin: 0.2vmax;
            color: #301b86;
            box-sizing: border-box;
            border: 0.1vmax solid #999;
            font-size: 1.2vmax;
            width: 31%;
            height: 23%;
            position: relative;
            box-sizing: border-box;

            img {
              // max-width: 70%;
              // max-height: 70%;
              width: 100%;
              height: 70%;
              object-fit: contain;
            }

            p {
              position: absolute;
              bottom: 0%;
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              border-top: 0.1vmax solid #888;
            }
          }
        }
      }
    }
    .btn-up {
      display: none;
      background-image: url(../assets/img/btn-up.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 2.8vmax;
      height: 2.8vmax;
      position: absolute;
      transform: translateX(-50%);
    }
    .btn-down {
      background-image: url(../assets/img/btn-down.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 2.8vmax;
      height: 2.8vmax;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 2%;
    }
  }

  #mapContainer {
    width: 46vmax;
    height: 75vmin;
    left: 9%;
    top: 6vw;
    overflow: hidden;
    position: absolute;
    // background: red;
    #mapContainer4Show {
      position: absolute;
      opacity: 0;

      & > img {
        width: 100%;
        display: block;
      }

      .point {
        position: absolute;
        border-radius: 50%;
        width: 1.6vmax;
        height: 1.6vmax;
        // background-color: red;
        margin-left: -0.8vmax;
        margin-top: -0.8vmax;
        box-sizing: border-box;

        @keyframes iconJump {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-0.6vmax);
          }
        }
        img {
          width: 100%;
          height: 100%;
          position: absolute;
          object-fit: contain;
          &.iconJump {
            animation: iconJump 0.6s infinite;
          }
        }

        .storeInfo {
          font-size: 0.4vw;
          // white-space: nowrap;
          width: 120%;
          text-align: center;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(0.9);
        }

        // &.startPoint {
        //   &:after {
        //     content: "";
        //     position: absolute;
        //     left: 0;
        //     top: 0;
        //     width: 3vmax;
        //     height: 3vmax;
        //     background-image: url(../assets/img/Navigation/startPoint.png);
        //     background-size: contain;
        //     background-repeat: no-repeat;
        //   }
        // }
      }
    }
  }

  #floorList {
    position: absolute;
    height: 60vh;
    top: 15%;
    left: 58%;
    color: #949494;
    font-size: 2.5vmax;
    .swiper-container {
      width: 100%;
      height: 100%;
      .floorContainer {
        text-align: center;
        position: relative;
        width: 8vw;
        height: 5.5vw;
        .floorItem {
          width: 100%;
          height: 65%;
          background: #d7d7d7;
          border-radius: 3vmax;
          img {
            width: 1vmax;
          }
        }
        .line {
          position: absolute;
          bottom: 0;
          width: 20%;
          left: 40%;
          height: 0.15vmax;
          background: #ccc;
        }
        &.selected {
          .floorItem {
            color: #fff;
            background: #e3007e;
          }
        }
      }
    }
    .arrow-up {
      position: absolute;
      width: 2.5vmax;
      height: 2vmax;
      left: 50%;
      top: -3vmax;
      transform: translateX(-50%);
      background-image: url(../assets/img/Navigation/arrow-up.png);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
    }
    .arrow-down {
      position: absolute;
      width: 2.5vmax;
      height: 2vmax;
      left: 50%;
      bottom: -3vmax;
      transform: translateX(-50%);
      background-image: url(../assets/img/Navigation/arrow-down.png);
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
}
</style>
