<template>
  <div id="Nav">
    <!-- 实际用于导航的地图弹窗 -->
    <div id="showFindWay" v-if="showFindWay">
      <div ref="mapContainer4FindWay" id="mapContainer4FindWay">
        <div class="floorName" style="bottom:100%;">
          <template v-if="startFloorIndex >= nowFloorIndex">{{
            floorList[startFloorIndex].name
          }}</template>
          <template v-else>{{ floorList[nowFloorIndex].name }}</template>
        </div>
        <img
          class="floorImg"
          v-if="startFloorIndex > nowFloorIndex"
          :src="transferUrl(floorList[startFloorIndex].img)"
        />
        <img
          class="floorImg"
          :src="transferUrl(floorList[nowFloorIndex].img)"
        />
        <img
          class="floorImg"
          v-if="startFloorIndex < nowFloorIndex"
          :src="transferUrl(floorList[startFloorIndex].img)"
        />
        <div class="floorName" style="top:100%;">
          <template v-if="startFloorIndex < nowFloorIndex">{{
            floorList[startFloorIndex].name
          }}</template>
          <template v-if="startFloorIndex > nowFloorIndex">{{
            floorList[nowFloorIndex].name
          }}</template>
        </div>

        <canvas ref="canvas"></canvas>
        <div
          v-for="point of pointList"
          :key="point.id"
          class="point"
          :class="{
            startPoint: point.id == startPointId,
            endPoint: point.id == endPointId,
            open: point.listType == 'open',
            close: point.listType == 'close',
          }"
          :style="{ left: point.left + 'px', top: point.top + 'px' }"
        >
          <img
            v-if="point.type == 'elevator'"
            src="../assets/img/Navigation/icons/elevator.png"
          />
          <img
            v-if="point.type == 'toilet'"
            src="../assets/img/Navigation/icons/toilet.png"
          />
          <img
            v-if="point.type == 'disabled'"
            src="../assets/img/Navigation/icons/disabled.png"
          />
          <img
            v-if="point.type == 'escalator'"
            src="../assets/img/Navigation/icons/escalator.png"
          />
          <img
            v-if="point.type == 'maternal'"
            src="../assets/img/Navigation/icons/maternal.png"
          />
          <img
            v-if="point.type == 'reception'"
            src="../assets/img/Navigation/icons/reception.png"
          />
          <img
            v-if="point.type == 'staircase'"
            src="../assets/img/Navigation/icons/staircase.png"
          />

          <!-- <img v-if="point.type == 'store'" :src="point.logoUrl" /> -->
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
    <div v-if="showBack" class="showBack" @touchstart="$emit('hide-nav')"></div>
  </div>
</template>

<script>
import panzoom from "panzoom";
var arrow = new Image();
// arrow.src = require("@/assets/img/Nav/arrow.png");
arrow.src =
  "data:image/png;base64,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";
export default {
  name: "Nav",
  props: ["device", "room", "floors", "roomList", "excludeRoomIds"],
  data() {
    return {
      canvas: null,
      context: null,
      // startPointId: "b1ca0283-bac4-4f67-0c83-08d881617e34",
      angle: 0,
      map: {
        width: 0,
        height: 0,
      },
      distanceToSeparatePoint: 20,
      moveInterval: 50,
      endPointId: null,
      pointList: [], //实际用于导航的点位
      floorList: [], //经过整理的带有brand等信息的数组
      nowFloorIndex: 0,
      nowRoomBrandName: null,

      showFindWay: false,
      showBack: false,
      lastRoute: [],
      panzoomInstance: null,
    };
  },
  created() {
    this.floorList = this.floors.map((floor) => {
      return {
        name: floor.name,
        no: floor.no,
        img: floor.floorResources.find(
          (resource) => resource.angle == this.angle
        ).imageUrl,
      };
    });
    this.preload().then(() => {
      this.go();
    });
  },
  beforeDestroy() {
    if (this.panzoomInstance) {
      this.panzoomInstance.dispose();
    }
  },
  computed: {
    startPointId() {
      return this.device.address;
    },
    startFloorIndex() {
      var startFloor = this.floors.find((floor) =>
        floor.rooms.some((room) => room.id == this.startPointId)
      );
      if (startFloor) {
        return this.floors.indexOf(startFloor);
      } else {
        return null;
      }
    },
  },
  methods: {
    //预加载所有当前角度的floor图片
    preload() {
      return new Promise((resolve) => {
        var queue = new window.createjs.LoadQueue(false);
        queue.on("complete", () => {
          this.loading = false;
          resolve();
        });
        queue.loadManifest(
          this.floorList.filter((item) => item.img).map((item) => item.img)
        );
      });
    },

    go() {
      this.nowFloorIndex = this.floorList.findIndex(
        (floor) => floor.no == this.room.floorNo
      );
      this.endPointId = this.room.id;
      this.nowRoomBrandName = this.room.brandName;
      this.$emit("clear-room-detail");
      this.showFindWay = true;
      this.$nextTick(() => {
        this.map.width = $("#mapContainer4FindWay").width();
        this.map.height = $("#mapContainer4FindWay").height();
        this.initCanvas();
        this.initPointList4FindWay();
        this.next();
      });
    },
    initPointList4FindWay() {
      var allFloorFlagList = [];
      this.floors //只考虑当前楼层和目标楼层
        .filter(
          (floorDetail) =>
            floorDetail.no == this.floorList[this.nowFloorIndex].no ||
            floorDetail.no == this.floorList[this.startFloorIndex].no
        )
        .forEach((floorDetail) => {
          var flagListInFloor = floorDetail.rooms
            .filter((room) =>
              room.pathLocations.some(
                (pathLocations) => pathLocations.angle == this.angle
              )
            )
            .map((room) => {
              var pathLocation = room.pathLocations.find(
                (pathLocations) => pathLocations.angle == this.angle
              );
              var flag = {
                id: room.id,
                left: (pathLocation.pathLocationX / 100) * this.map.width,
                top: pathLocation.pathLocationY,
                logoUrl: room.brandLogo,
                brandName: room.brandName,
                clingPointList: [],
                type: room.roomType,
                name: room.name,
                no: floorDetail.no,
                F: 0,
                listType: null,
                parentPointId: null,
              };
              floorDetail.navigations.forEach((navigation) => {
                if (flag.id == navigation.lastRoomId) {
                  flag.clingPointList.push({ id: navigation.nextRoomId });
                } else if (flag.id == navigation.nextRoomId) {
                  flag.clingPointList.push({ id: navigation.lastRoomId });
                }
              });
              let top;
              if (this.nowFloorIndex == this.startFloorIndex) {
                top = (flag.top / 100) * this.map.height;
              } else {
                if (
                  flag.no ==
                  Math.min(
                    this.floorList[this.nowFloorIndex].no,
                    this.floorList[this.startFloorIndex].no
                  )
                ) {
                  top =
                    ((flag.top / 100) * this.map.height) / 2 +
                    this.map.height / 2;
                } else {
                  top = ((flag.top / 100) * this.map.height) / 2;
                }
              }
              flag.top = top;

              return flag;
            });
          allFloorFlagList = allFloorFlagList.concat(flagListInFloor);
        });

      this.pointList = allFloorFlagList;

      this.pointList.forEach((point) => {
        point.clingPointList.forEach((clingPoint) => {
          const targetClingPoint = this.getPointById(clingPoint.id);
          if (targetClingPoint) {
            clingPoint.cost = Math.sqrt(
              Math.pow(targetClingPoint.left - point.left, 2) +
                Math.pow(targetClingPoint.top - point.top, 2)
            );
            //不是终点的商店 行动消耗变成5倍 以此防止从商店穿过
            if (
              targetClingPoint.id != this.endPointId &&
              targetClingPoint.type == "store"
            ) {
              clingPoint.cost = clingPoint.cost * 5;
            }
          } else {
            //avoid clingPoint not exist in canvas
            clingPoint.cost = 9999999999999;
          }
        });
      });
      this.getPointById(this.startPointId).listType = "open";
    },
    next() {
      var odList = this.pointList.filter((point) => point.listType == "open");
      var nextPoint = odList.sort((a, b) => a.F - b.F)[0];
      if (nextPoint) {
        this.checkPoint(nextPoint);
        if (this.getPointById(this.endPointId).listType == "open") {
          console.log("找到路径");
          this.panzoomInstance = panzoom(this.$refs.mapContainer4FindWay, {
            pinchSpeed: 1,
            maxZoom: 5,
            minZoom: 0.5,
            bounds: true,
            boundsPadding: 0.05,
            autocenter: true,
            zoomDoubleClickSpeed: 1, //禁止双击放大
          });
          this.makeLastRoute(this.getPointById(this.endPointId));
        } else {
          this.next();
        }
      } else {
        console.log("没有路径", this.nowRoomBrandName);
        //找到同品牌下不同id的房间
        var excludeRoomIds = this.excludeRoomIds.concat([this.endPointId]);
        if (
          this.roomList.some(
            (room) =>
              room.brandName == this.nowRoomBrandName &&
              excludeRoomIds.indexOf(room.id) == -1
          )
        ) {
          console.log(`品牌${this.nowRoomBrandName},排除房间${excludeRoomIds}`);
          this.$emit("hide-nav", {
            brandName: this.nowRoomBrandName,
            excludeRoomIds: excludeRoomIds,
          });
        } else {
          this.$emit("hide-nav");
          alert("没有路径");
        }
      }
    },
    checkPoint(point) {
      point.clingPointList
        .map((clingPoint) => this.getPointById(clingPoint.id))
        .filter((clingPoint) => {
          //avoid clingPoint not exist in canvas
          return (
            clingPoint &&
            clingPoint.listType != "close" &&
            (point.no == clingPoint.no ||
              (point.type == "elevator" && clingPoint.type == "elevator") ||
              (point.type == "escalator" && clingPoint.type == "escalator"))
          );
        })
        .forEach((clingPoint) => {
          this.addToOpenList(clingPoint, point);
          // clingPoint.F = clingPoint.F;
        });
      this.addToCloseList(point);
    },
    addToOpenList(point, nowCheckedPoint) {
      var newF =
        nowCheckedPoint.F +
        nowCheckedPoint.clingPointList.find(
          (clingPoint) => clingPoint.id == point.id
        ).cost;
      if (!point.listType || (point.listType == "open" && newF < point.F)) {
        point.F = newF;
        point.listType = "open";
        point.parentPointId = nowCheckedPoint.id;
      }
    },
    addToCloseList(...param) {
      param.forEach((point) => (point.listType = "close"));
    },
    async makeLastRoute(point) {
      this.lastRoute.unshift(point);
      if (point.parentPointId) {
        var parentPoint = this.getPointById(point.parentPointId);
        var maxI = Math.round(
          Math.sqrt(
            Math.pow(parentPoint.left - point.left, 2) +
              Math.pow(parentPoint.top - point.top, 2)
          ) / this.distanceToSeparatePoint
        );
        for (let i = 1; i < maxI; i++) {
          let newPoint = {
            left: ((parentPoint.left - point.left) / maxI) * i + point.left,
            top: ((parentPoint.top - point.top) / maxI) * i + point.top,
          };
          this.lastRoute.unshift(newPoint);
        }
        this.makeLastRoute(parentPoint);
      } else {
        for (let index = 0; index < this.lastRoute.length - 1; index++) {
          await this.drawLastRoute(index);
        }

        this.showBack = true;
      }
    },
    drawLastRoute(index) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let e0 = {
              left:
                index == 0
                  ? this.lastRoute[index].left
                  : (this.lastRoute[index - 1].left +
                      this.lastRoute[index].left) /
                    2,
              top:
                index == 0
                  ? this.lastRoute[index].top
                  : (this.lastRoute[index - 1].top +
                      this.lastRoute[index].top) /
                    2,
            },
            e1 = {
              left:
                (this.lastRoute[index].left + this.lastRoute[index + 1].left) /
                2,
              top:
                (this.lastRoute[index].top + this.lastRoute[index + 1].top) / 2,
            };
          // this.context.beginPath();
          this.context.lineCap = "round";
          this.context.strokeStyle = "#027C4B";
          this.context.lineJoin = "round";

          this.context.lineWidth = 8;
          this.context.moveTo(e0.left, e0.top);

          this.context.quadraticCurveTo(
            this.lastRoute[index].left,
            this.lastRoute[index].top,
            e1.left,
            e1.top
          );

          this.context.stroke();

          // this.context.beginPath();
          this.context.lineCap = "round";
          this.context.strokeStyle = "#01C47A";
          this.context.lineJoin = "round";

          this.context.lineWidth = 6;
          this.context.moveTo(e0.left, e0.top);

          this.context.quadraticCurveTo(
            this.lastRoute[index].left,
            this.lastRoute[index].top,
            e1.left,
            e1.top
          );
          this.context.stroke();

          this.drawArrow(index);

          resolve();
        }, this.moveInterval);
      });
    },
    drawArrow(index) {
      for (let i = 0; i < index; i++) {
        if (i % 2 == 0) continue;
        let x1 =
            i == 0
              ? this.lastRoute[i].left
              : (this.lastRoute[i - 1].left + this.lastRoute[i].left) / 2,
          y1 =
            i == 0
              ? this.lastRoute[i].top
              : (this.lastRoute[i - 1].top + this.lastRoute[i].top) / 2,
          x2 = (this.lastRoute[i].left + this.lastRoute[i + 1].left) / 2,
          y2 = (this.lastRoute[i].top + this.lastRoute[i + 1].top) / 2,
          deg = Math.atan((x2 - x1) / (y1 - y2));
        if (y2 > y1) {
          deg = Math.PI + deg;
        }
        this.context.translate(x1, y1);
        this.context.rotate(deg);
        this.context.drawImage(arrow, -3, -3, 6, 6);
        this.context.rotate(-deg);
        this.context.translate(-x1, -y1);
      }
    },

    initCanvas() {
      var canvas = this.$refs.canvas;
      canvas.width = this.map.width;
      canvas.height = this.map.height;
      this.canvas = canvas;
      this.context = this.canvas.getContext("2d");

      if (window.devicePixelRatio) {
        //缓解canvas锯齿问题
        this.canvas.style.width = this.canvas.width + "px";
        this.canvas.style.height = this.canvas.height + "px";
        this.canvas.height = this.canvas.height * window.devicePixelRatio;
        this.canvas.width = this.canvas.width * window.devicePixelRatio;
        this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    },
    getPointById(id) {
      return this.pointList.find((point) => point.id == id);
    },
  },
};
</script>
<style scoped lang="scss">
@mixin mapContainer {
  position: absolute;

  & > img {
    width: 100%;
    display: block;
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
  }

  .point {
    position: absolute;
    border-radius: 50%;
    width: 2vmax;
    height: 2vmax;
    // background-color: red;
    margin-left: -1vmax;
    margin-top: -1vmax;
    box-sizing: border-box;

    img {
      width: 100%;
      height: 100%;
      position: absolute;
      object-fit: contain;
    }

    .storeInfo {
      font-size: 0.4vw;
      // white-space: nowrap;
      width: 140%;
      text-align: center;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0.9);
    }
    &.startPoint {
      &:after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-image: url(../assets/img/Navigation/startPoint.png);
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
      }
    }

    // &.endPoint {
    //   background-color: yellow;
    // }

    // &.open {
    //   outline: 3px solid green;
    // }

    // &.close {
    //   outline: 3px solid brown;
    // }
  }
}
#Nav {
  position: fixed;
  z-index: 20;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6);

  #showFindWay {
    position: fixed;
    width: 80vw; //为了让楼层编号能显示
    height: 80%;
    left: 10vw;
    top: 10%;

    #mapContainer4FindWay {
      @include mapContainer;
      // todo 为了让图像显示在正中间
      .floorImg {
        width: 80vw;
        height: 35.5vw;
      }
      .floorName {
        position: absolute;
        width: 100%;
        left: 0;
        font-size: 5vmax;
        line-height: 8vmax;
        text-align: center;
        color: #fff;
      }
    }
  }
  .showBack {
    position: absolute;
    right: 5%;
    top: 5%;
    width: 5vmax;
    height: 5vmax;
    background-image: url("../assets/img/back.png");
    background-size: 100% 100%;
    z-index: 2;
  }
}
</style>
