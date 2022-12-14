<template>
  <div id="QueueDetail">
    <div class="back" @touchstart="$emit('clear-room-detail')"></div>
    <div class="main">
      <img
        v-if="room.brand.imageUrl"
        class="logo"
        :src="transferUrl(room.brand.imageUrl)"
      />
      <img v-else class="logo" src="@/assets/img/Queue/default.png" />
      <div class="name">{{ room.brandName }}</div>
      <div class="slogan">{{ room.brand.slogan }}</div>
      <div class="addressAndTime">
        <div>
          <img src="@/assets/img/Queue/address.png" />
          {{ room.no }}
        </div>
        <div>
          <img src="@/assets/img/Queue/time.png" />
          <template v-if="room.store.openingTime && room.store.closedTime">
            {{ room.store.openingTime.slice(11, 16) }}
            -
            {{ room.store.closedTime.slice(11, 16) }}
          </template>
        </div>
      </div>
      <div class="qrcodeContainer">
        <img :src="transferUrl(room.store.qrCodeUrl)" />
      </div>
      <div class="tip">
        <div>微信扫码</div>
        <div>立即线上排队吧</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "QueueDetail",
  props: ["room"],
  data() {
    return {};
  },
  mounted() {
    console.log("QueueDetail", this.room);
  },
  methods: {},
};
</script>

<style scoped lang="scss">
#QueueDetail {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  left: 0;
  top: 0;
  .back {
    position: absolute;
    right: 2vw;
    bottom: 2vw;
    width: 6vmax;
    height: 6vmax;
    background-image: url(../assets/img/back.png);
    background-size: 100% 100%;
  }
  .main {
    position: absolute;
    height: 80%;
    width: 80%;
    left: 10%;
    top: 10%;
    background-color: #fff;
    border-radius: 2vmax;

    .logo {
      width: 45%;
      height: 100%;
      object-fit: contain;
      position: absolute;
      top: 50%;
      left: 25%;
      transform: translate(-50%, -50%);
      border-radius: 2.5vmax;
    }

    .name {
      position: absolute;
      left: 50%;
      top: 12%;
      font-size: 4vmax;
    }
    .slogan {
      position: absolute;
      left: 50%;
      max-width: 35%;
      top: 27%;
      font-size: 1.8vmax;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-bottom: 2vmax;
      border-bottom: 0.1vmax solid #aaa;
      text-indent: 0.5vmax;
      padding-right: 0.5vmax;
      color: #555;
    }
    .addressAndTime {
      position: absolute;
      left: 50%;
      top: 42%;
      width: 34%;
      display: flex;
      justify-content: space-between;
      font-size: 1.8vmax;
      img {
        height: 1.8vmax;
        vertical-align: middle;
        margin-right: 0.3vmax;
      }
    }
    .qrcodeContainer {
      background: #d9a4c9;
      position: absolute;
      width: 12vmax;
      height: 12vmax;
      border-radius: 8%;
      right: 35%;
      bottom: 16%;
      img {
        position: absolute;
        width: 84%;
        height: 84%;
        left: 8%;
        top: 8%;
        object-fit: contain;
      }
    }
    .tip {
      font-size: 1.5vmax;
      font-weight: bold;
      position: absolute;
      left: 68%;
      bottom: 16%;
    }
  }
}
</style>
