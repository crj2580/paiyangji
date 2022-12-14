<template>
  <div id="RoomDetail" v-if="room.roomType == 'store'">
    <div class="back" @touchstart="$emit('clear-room-detail')"></div>
    <div class="main">
      <div class="name">{{ room.store.name }}</div>
      <img :src="transferUrl(room.brandLogo)" class="logo" />
      <div class="addressAndTel">
        <div>
          <img src="@/assets/img/RoomDetail/add.png" />
          <!-- {{ room.floorName }}- -->
          {{ room.no }}
        </div>
        <div>
          <img src="@/assets/img/RoomDetail/tel.png" />
          {{ room.store.contact }}
        </div>
      </div>
      <img
        v-if="room.brand.imageUrl"
        :src="transferUrl(room.brand.imageUrl)"
        class="imageUrl"
      />
      <img v-else src="@/assets/img/RoomDetail/default.png" class="imageUrl" />
      <div class="description">
        {{ room.brand.description }}
      </div>
      <div class="time">
        <div class="label">营业时间</div>
        <template v-if="room.store.openingTime && room.store.closedTime">
          {{ room.store.openingTime.slice(11, 16) }}
          -
          {{ room.store.closedTime.slice(11, 16) }}
        </template>
      </div>
      <div class="goRoom" @touchstart="goRoom"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RoomDetail",
  props: ["room"],
  data() {
    return {};
  },
  created() {
    console.log("detail",this.room);
    if (this.room.roomType != "store") {
      this.$emit("go");
    }
  },
  methods: {
    goRoom() {
      this.$emit("go");
    },
  },
};
</script>

<style scoped lang="scss">
#RoomDetail {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  left: 0;
  top: 0;
  .back {
    position: absolute;
    right: 2vmax;
    bottom: 2vmax;
    width: 6vmax;
    height: 6vmax;
    background-image: url(../assets/img/back.png);
    background-size: 100% 100%;
  }
  .main {
    background-image: url(../assets/img/RoomDetail/bg.png);
    background-size: 100% 100%;
    width: 60%;
    height: 60%;
    position: absolute;
    left: 20%;
    top: 20%;
    .name {
      position: absolute;
      font-size: 2vmax;
      left: 1vmax;
      top: 1vmax;
    }
    .logo {
      position: absolute;
      right: 0.25vmax;
      top: 0.25vmax;
      max-width: 6.5vmax;
      max-height: 6.5vmax;
    }
    .imageUrl {
      position: absolute;
      left: 0;
      top: 22%;
      width: 76%;
      height: 69%;
    }
    .description {
      position: absolute;
      width: 20%;
      right: 1.5%;
      top: 22%;
      font-size: 0.8vmax;

      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 18;
      -webkit-box-orient: vertical;
    }
    .goRoom {
      position: absolute;
      right: 4%;
      bottom: 5%;
      width: 9vmax;
      height: 5vmin;
      background-image: url(../assets/img/RoomDetail/goRoom.png);
      background-size: 100% 100%;
    }
    .addressAndTel {
      position: absolute;
      left: 2%;
      top: 14%;
      width: 55%;
      display: flex;
      justify-content: space-between;
      font-size: 1.4vmax;
      img {
        height: 1.8vmax;
        vertical-align: middle;
        margin-right: 1vmax;
      }
    }
    .time {
      position: absolute;
      left: 2%;
      bottom: 2%;
      font-size: 1.4vmax;
      .label {
        display: inline-block;
        margin-right: 1vmax;
        color: #a25837;
      }
    }
  }
}
</style>
