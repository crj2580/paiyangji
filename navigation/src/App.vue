<template>
  <div id="App" class="App">
    <div v-if="loading" class="basicLoading">
      <img src="@/assets/img/loading.gif" />
    </div>
    <div class="header">
      <div class="date-weather">
        <div class="time">
          {{ hour }} : {{ minutes }} <img v-if="imgUrl" :src="imgUrl" />
        </div>
        <div class="date">
          {{ year }}-{{ month }}-{{ (date + "").padStart(2, 0) }} &nbsp;&nbsp;
          {{ day }}
        </div>
      </div>
    </div>
    <img
      class="icon"
      v-if="$route.name"
      :src="require(`@/assets/img/App/${$route.name}-icon.png`)"
    />
    <div class="menu" v-if="$route.name != 'home'">
      <div v-for="menu of menuList" :key="menu" @touchstart="goRouter(menu)">
        <template v-if="menu">
          <img
            v-if="$route.name == menu"
            :src="require(`@/assets/img/App/${menu}-active.png`)"
          />
          <img v-else :src="require(`@/assets/img/App/${menu}.png`)" />
        </template>
      </div>
    </div>
    <router-view
      class="router-view"
      v-if="!loading"
      :device="device"
      :floors="floors"
      :brands="brands"
      :stores="stores"
      :brandCategorys="brandCategorys"
      :ads="ads"
      @show-room-detail="showRoomDetail"
    />
    <RoomDetail
      v-if="room"
      :room="room"
      @clear-room-detail="room = null"
      @go="go"
    />
    <Nav
      v-if="showNav"
      :device="device"
      :room="room"
      :floors="floors"
      :brands="brands"
      :stores="stores"
      :roomList="roomList"
      :excludeRoomIds="excludeRoomIds"
      @clear-room-detail="room = null"
      @hide-nav="hideNav"
    />
  </div>
</template>

<script>
import RoomDetail from "@/components/RoomDetail";
import Nav from "@/components/Nav";

export default {
  name: "App",
  components: { RoomDetail, Nav },
  data() {
    return {
      year: 0,
      month: 0,
      date: 0,
      hour: 0,
      minutes: 0,
      day: null,
      days: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
      imgUrl: null,
      menuList: [
        "environment",
        "activity",
        "navigation",
        "",
        "recommend",
        "search",
        "queue",
      ],
      loading: true,
      device: null,
      brands: null,
      floors: null,
      stores: null,
      roomList: null,
      room: null,
      ads: null,
      showNav: false,
      excludeRoomIds: null,
    };
  },
  beforeCreate() {
    if (process.env.VUE_APP_THEME == "Portrait") {
      require("./Portrait.scss");
    }
  },
  created: function () {
    $.ajaxSetup({
      timeout: 60000,
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("jqXHR", jqXHR);
        console.log("textStatus", textStatus);
        console.log("errorThrown", errorThrown);
        switch (jqXHR.status) {
          case 500:
            console.log("服务器系统内部错误");
            break;
          case 401:
            console.log("未登录");
            break;
          case 403:
            console.log("无权限执行此操作");
            break;
          case 408:
            console.log("请求超时");
            break;
          default:
            console.log("未知错误");
        }
      },
    });
    this.getTime();
    this.getWeather();

    Promise.all([
      this.GetDeviceInfo(),
      this.GetBrands(),
      this.GetFloorsDetail(),
      this.GetStores(),
      this.GetBrandCategorys(),
      this.GetAds(),
    ]).then(([device, brands, floors, stores, brandCategorys, ads]) => {
      this.loading = false;
      this.device = device;
      this.brands = brands;
      this.floors = floors;
      this.ads = ads.filter(
        (ads) =>
          ads.fileUrl.indexOf(".png") > -1 || ads.fileUrl.indexOf(".jpg") > -1
      );
      this.brandCategorys = brandCategorys;
      this.stores = stores
        .map((store) => {
          return Object.assign(store, {
            id: store.storeId,
            name: store.displayName,
            brand: this.brands.find((brand) => brand.id == store.brandId),
            roomIds: JSON.parse(store.roomIds),
          });
        })
        .filter((store) => store.brand && store.roomIds); //筛去没有品牌或room的store

      var roomList = [];
      this.floors.forEach((floor) => {
        var roomInFloor = floor.rooms.map((item) => {
          return Object.assign(item, {
            floorNo: floor.no,
            floorName: floor.name,
          });
        });
        roomList.push(...roomInFloor);
      });
      this.roomList = roomList.map((item) => {
        return Object.assign(item, {
          brand: this.brands.find((brand) => brand.name == item.brandName),
          store: this.stores.find((store) => store.id == item.storeId),
        });
      });

      // this.stores = this.stores.filter(
      //   (store) => store.roomIds.length && store.brand
      // ); //防止有店没有配房间或品牌
      this.stores.forEach((store) => {
        store.rooms = store.roomIds.map((roomId) => {
          return this.roomList.find((room) => {
            return room.id == roomId;
          });
        });
      });
      console.log("roomList", this.roomList);
      console.log("brands", this.brands);
      console.log("floors", this.floors);
      console.log("stores", this.stores);
      console.log("brandCategorys", this.brandCategorys);
      console.log("ads", this.ads);
      //活动图 品牌logo 品牌详情图1 品牌详情图2 排队二维码 楼层地图

      var picListToDownload = [];
      this.ads.forEach((ads) => {
        picListToDownload.push(ads.fileUrl);
      });
      this.brandCategorys.forEach((cate) => {
        picListToDownload.push(cate.iconUrl);
        picListToDownload.push(cate.imageUrl);
      });
      this.brands.forEach((brand) => {
        picListToDownload.push(brand.imageUrl);
        picListToDownload.push(brand.logoUrl);
      });

      this.floors.forEach((floor) => {
        floor.floorResources.forEach((angle) => {
          picListToDownload.push(angle.imageUrl);
        });
      });

      this.stores.forEach((store) => {
        picListToDownload.push(store.qrCodeUrl);
      });

      picListToDownload = picListToDownload.filter((pic) => pic);

      if (window.AndroidWebView && window.AndroidWebView.downloadLinks) {
        window.AndroidWebView.downloadLinks(picListToDownload);
        // window.app = this;
        // window.app.loading = true;
      }

      // console.log("picListToDownload", picListToDownload);
    });
  },
  methods: {
    hideNav(e) {
      this.showNav = false;
      if (e) {
        this.go(e.brandName, e.excludeRoomIds);
      }
    },
    go(brandName, excludeRoomIds) {
      if (brandName && excludeRoomIds) {
        this.$nextTick(() => {
          console.log("go after hideNav");
          this.excludeRoomIds = excludeRoomIds;
          this.room = this.roomList.find(
            (room) =>
              room.brandName == brandName &&
              excludeRoomIds.indexOf(room.id) == -1
          );
          this.showNav = true;
        });
      } else {
        this.excludeRoomIds = [];
        this.showNav = true;
      }
    },
    showRoomDetail(e) {
      console.log(e);
      if (e.brandId) {
        var storeId = this.stores.find((store) => store.brandId == e.brandId)
          .id;
        this.room = this.roomList.find((room) => room.storeId == storeId);
        console.log(
          "带有storeId的room",
          this.roomList.filter((room) => room.storeId)
        );
        console.log("storeId", storeId, "room", this.room);
      } else if (e.roomId) {
        this.room = this.roomList.find((room) => room.id == e.roomId);
        console.log("room", this.room);
        //TODO 暂时不考虑一个品牌下多个店铺/一个店铺下多个room的情况
        //一个品牌多个店铺时采用多个同名品牌分别对应店铺
        //此时一个店铺找不到路径 可以用该品牌下的其他店铺进行导航 直到能找到
        // console.log(this.room.brandName);
      }
    },
    goRouter(router) {
      router = router || "home";
      if (router != this.$route.name) this.$router.push({ name: router });
    },
    getTime() {
      var time = new Date();
      this.year = time.getFullYear();
      this.month = time.getMonth() + 1;
      this.date = (time.getDate() + "").padStart(2, 0);
      this.day = this.days[time.getDay()];
      this.hour = (time.getHours() + "").padStart(2, 0);
      this.minutes = (time.getMinutes() + "").padStart(2, 0);
      setTimeout(() => {
        this.getTime();
      }, 1000);
    },
    getWeather() {
      // if (this.getStorage("weather")) {
      //   resolve(this.getStorage("weather"));
      // } else {
      $.ajax({
        url:
          "https://floor.api.troncell.com/api/services/app/Weather/GetWeatherByDate",
        type: "GET",
        data: {
          cityId: 1061,
        },
        success: (result) => {
          this.setStorage("weather", result.result.icon);
        },
        complete: () => {
          this.imgUrl = require(`@/assets/img/App/weather/${this.getStorage(
            "weather"
          )}.png`);
        },
      });
      // }
    },
    getStorage(key) {
      // return false; //禁用本地缓存
      var value;
      if (window.AndroidWebView && window.AndroidWebView.getAndroidStorage) {
        value = window.AndroidWebView.getAndroidStorage(`Navigation-${key}`);
        console.log(`get ${key} from Android`, value.length);
      } else {
        value = localStorage[`Navigation-${key}`];
        console.log(`get ${key} from localStorage`, value.length);
      }
      if (value) {
        return JSON.parse(value);
      } else {
        alert(`网络异常且 ${key} 无缓存,请联系管理员`);
        return false;
      }
    },
    setStorage(key, value) {
      if (window.AndroidWebView && window.AndroidWebView.setAndroidStorage) {
        window.AndroidWebView.setAndroidStorage(
          `Navigation-${key}`,
          JSON.stringify(value)
        );
      } else {
        localStorage[`Navigation-${key}`] = JSON.stringify(value);
      }
    },
    GetDeviceInfo() {
      return new Promise((resolve) => {
        // if (this.getStorage("device")) {
        //   resolve(this.getStorage("device"));
        // } else {
        $.ajax({
          url:
            "https://s.api.troncell.com/api/services/app/SensingDevice/GetDeviceInfo?subKey=" +
            this.subkey,
          type: "GET",
          success: (result) => {
            // result.result.address = "0994a78f-a6d9-4e56-99a4-08d89cbab2c9"; //TODO redis缓存问
            this.setStorage("device", result.result);
            // resolve(result.result);
          },
          complete: () => {
            resolve(this.getStorage("device"));
          },
        });
        // }
      });
    },
    GetStores() {
      return new Promise((resolve) => {
        // if (this.getStorage("stores")) {
        //   resolve(this.getStorage("stores"));
        // } else {
        $.ajax({
          url:
            "https://vips.api.troncell.com/api/services/app/SensingDevice/GetStoresList?subKey=" +
            this.subkey,
          type: "POST",
          success: (result) => {
            this.setStorage("stores", result.result.items);
            // resolve(result.result.items);
          },
          complete: () => {
            resolve(this.getStorage("stores"));
          },
        });
        // }
      });
    },
    GetBrands() {
      return new Promise((resolve) => {
        // if (this.getStorage("brands")) {
        //   resolve(this.getStorage("brands"));
        // } else {
        $.ajax({
          url:
            "https://vips.api.troncell.com/api/services/app/SensingDevice/GetBrands",
          type: "GET",
          data: {
            Subkey: this.subkey,
            MaxResultCount: 999,
            SkipCount: 0,
          },
          success: (result) => {
            this.setStorage("brands", result.result.items);
            // resolve(result.result.items);
          },
          complete: () => {
            resolve(this.getStorage("brands"));
          },
        });
        // }
      });
    },
    GetFloorsDetail() {
      return new Promise((resolve) => {
        // if (this.getStorage("floors")) {
        //   resolve(this.getStorage("floors"));
        // } else {
        $.ajax({
          url:
            // "https://floor.api.troncell.com/api/services/app/SensingDevice/GetFloorsDetails",
            "http://vips.api.troncell.com/api/services/app/SensingDevice/GetFloorsDetailsNew",

          type: "GET",
          data: {
            Subkey: this.subkey,
            buildingId: this.buildingId,
            MaxResultCount: 999,
          },
          success: (result) => {
            // console.log("GetFloorsDetails", result.result.items);
            result.result.sort((a, b) => {
              return a.no - b.no;
            });
            this.setStorage("floors", result.result);
            // resolve(result.result);
          },
          complete: () => {
            resolve(this.getStorage("floors"));
          },
        });
        // }
      });
    },
    GetBrandCategorys() {
      return new Promise((resolve) => {
        // if (this.getStorage("brandCategorys")) {
        //   resolve(this.getStorage("brandCategorys"));
        // } else {
        $.ajax({
          url:
            "https://s.api.troncell.com/api/services/app/Brand/GetTreesBySubKey?subKey=" +
            this.subkey,
          type: "GET",
          success: (result) => {
            this.setStorage("brandCategorys", result.result);
            // resolve(result.result);
          },
          complete: () => {
            resolve(this.getStorage("brandCategorys"));
          },
        });
        // }
      });
    },
    GetAds() {
      return new Promise((resolve) => {
        // if (this.getStorage("ads")) {
        //   resolve(this.getStorage("ads"));
        // } else {
        $.ajax({
          url:
            "https://s.api.troncell.com/api/services/app/SensingDevice/GetAds??MaxResultCount=999&subKey=" +
            this.subkey, //this.subkey "b2a2182d6e9e44b899482346cbc70b18"
          type: "GET",
          success: (result) => {
            this.setStorage("ads", result.result.items);
            // resolve(result.result.items);
          },
          complete: () => {
            resolve(this.getStorage("ads"));
          },
        });
        // }
      });
    },
    //
  },
};
</script>

<style lang="scss">
@font-face {
  font-family: "siyuanheiti";
  src: url(./assets/font/SourceHanSansCN-Normal.ttf);
}
</style>
<style scoped lang="scss">
#App {
  width: 100vw;
  height: 100vh;
  background: url(./assets/img/App/bg.png);
  font-family: "siyuanheiti";
  .header {
    position: absolute;
    z-index: 2;
    .date-weather {
      padding-left: 0.5vmax;
      .time {
        font-size: 3vmax;
        img {
          vertical-align: middle;
          width: 3.4vmax;
          margin-left: 0.3vmax;
          position: relative;
          top: -0.5vmax;
          // filter: grayscale(50%);
        }
      }
      .date {
        font-size: 1.7vmax;
      }
    }
  }
  .icon {
    position: absolute;
    right: 1.5vmax;
    top: 1.2vmax;
    width: 9vmax;
    z-index: 1;
  }
  .menu {
    position: absolute;
    bottom: 2vmax;
    height: 6.6vmax;
    width: 80%;
    left: 10%;
    background-image: url("./assets/img/App/menu-home.png");
    background-size: 100% 100%;
    z-index: 2;
    div {
      position: absolute;
      top: 15%;
      width: 4.5vmax;
      height: 6.2vmax;
      img {
        width: 100%;
        height: 100%;
      }
      &:nth-child(1) {
        left: 15%;
      }
      &:nth-child(2) {
        left: 25.5%;
      }
      &:nth-child(3) {
        left: 36%;
      }
      &:nth-child(4) {
        left: 47%;
        width: 6vmax;
      }
      &:nth-child(5) {
        right: 34.5%;
      }
      &:nth-child(6) {
        right: 24%;
      }
      &:nth-child(7) {
        right: 13.5%;
      }
    }
  }
  .router-view {
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
