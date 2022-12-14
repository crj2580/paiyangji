<template>
  <div id="Queue">
    <QueueDetail v-if="room" :room="room" @clear-room-detail="room = null" />
    <div class="queueContainer">
      <swiper
        v-if="showSwiper"
        ref="swiper"
        :options="swiperOption"
        :auto-update="false"
        @slideChangeTransitionEnd="swiperCallback"
      >
        <template v-for="storeList of computedStores">
          <swiper-slide :key="storeList[0].id">
            <div class="storeListContainer">
              <div
                class="itemContainer"
                v-for="store of storeList"
                :key="store.id"
                @click="tap(store.id)"
              >
                <img
                  v-if="store.brand.logoUrl"
                  class="logo"
                  :src="transferUrl(store.brand.logoUrl)"
                />
                <img v-else class="logo" src="@/assets/img/noLogo.png" />

                <div class="name">{{ store.name }}</div>
                <div class="slogan">{{ store.brand.slogan }}</div>
                <div class="addressAndTime">
                  <div>
                    <img src="@/assets/img/Queue/address.png" />
                    {{ store.rooms[0].no }}
                  </div>
                  <div>
                    <img src="@/assets/img/Queue/time.png" />
                    <template v-if="store.openingTime && store.closedTime">
                      {{ store.openingTime.slice(11, 16) }}
                      -
                      {{ store.closedTime.slice(11, 16) }}
                    </template>
                  </div>
                </div>
                <div class="tip">自助排队</div>
              </div>
            </div>
          </swiper-slide>
        </template>
      </swiper>
    </div>
    <div @click="prev" class="prev"></div>
    <div @click="next" class="next"></div>
  </div>
</template>

<script>
import QueueDetail from "@/components/QueueDetail";

export default {
  name: "Queue",
  props: ["stores"],
  components: { QueueDetail },
  data() {
    return {
      room: null,
      computedStores: null,
      allComputedStores: null,
      showSwiper: false,
    };
  },
  computed: {
    swiper() {
      return this.$refs.swiper.$swiper;
    },
    swiperOption() {
      return {
        direction:
          process.env.VUE_APP_THEME == "Portrait" ? "vertical" : "horizontal",
        // virtual:true,
        // virtual: {
        //   slides: (function() {
        //     var slides = [];
        //     for (var i = 0; i < 600; i += 1) {
        //       slides.push("Slide " + (i + 1));
        //     }
        //     return slides;
        //   })(),
        // },
        // lazy: {
        //   loadPrevNext: true,
        // },
      };
    },
  },
  created() {
    var computedStores = [];
    for (let i = 0; i < Math.ceil(this.stores.length / 4); i++) {
      computedStores.push(this.stores.slice(i * 4, (i + 1) * 4));
    }
    this.computedStores = computedStores.slice(0, 2);
    this.allComputedStores = computedStores;
    this.showSwiper = true;
  },
  mounted() {},
  methods: {
    swiperCallback() {
      if (this.computedStores.length == this.allComputedStores.length) return;
      var activeIndex = this.$refs.swiper.$swiper.activeIndex;
      this.showSwiper = false;
      this.computedStores.push(
        this.allComputedStores[this.computedStores.length]
      );
      this.$nextTick(() => {
        this.showSwiper = true;
        this.$nextTick(() => {
          console.log(activeIndex);
          this.$refs.swiper.$swiper.slideTo(activeIndex, 0, false);
        });
      });
      console.log(this.computedStores);
    },
    prev() {
      // this.swiper.slidePrev();
      this.$refs.swiper.$swiper.slidePrev();
    },
    next() {
      // this.swiper.slideNext();
      this.$refs.swiper.$swiper.slideNext();
    },
    tap(storeId) {
      this.room = this.stores.find((store) => store.id == storeId).rooms[0];
    },
  },
};
</script>
<style scoped lang="scss">
#Queue {
  .queueContainer {
    padding-top: 15vmin;
    margin-left: 2vmax;
    width: 96vw;
    position: relative;
    .swiper-container {
      height: 60vmin;
      .swiper-slide {
        height: 100%;
        .storeListContainer {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          height: 100%;
          .itemContainer {
            position: relative;
            height: 50%;
            width: 50%;
            background-image: url(../assets/img/Queue/bg.png);
            background-size: 100% 100%;
            div {
              transform: translateZ(0); //安卓抗锯齿
            }

            .logo {
              width: 48%;
              height: 80%;
              object-fit: contain;
              position: absolute;
              top: 50%;
              left: 27%;
              transform: translate(-50%, -50%);
            }

            .name {
              position: absolute;
              left: 52%;
              top: 16%;
              width: 36%;
              overflow: hidden;
              font-size: 2.2vmax;
            }
            .slogan {
              position: absolute;
              left: 52%;
              max-width: 35%;
              top: 36%;
              font-size: 1.2vmax;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              padding-bottom: 0.8vmax;
              border-bottom: 0.1vmax solid #aaa;
              text-indent: 0.25vmax;
              padding-right: 0.5vmax;
              color: #555;
            }
            .addressAndTime {
              position: absolute;
              left: 52%;
              top: 58%;
              width: 30%;
              display: flex;
              justify-content: space-between;
              font-size: 1vmax;
              img {
                height: 1vmax;
                vertical-align: middle;
                margin-right: 0.3vmax;
              }
            }
            .tip {
              position: absolute;
              width: 3.4vmax;
              height: 3.4vmax;
              right: 2vmax;
              top: 1.8vmax;
              background: #e3007e;
              color: #fff;
              font-size: 1.2vmax;
              text-align: center;
              border-radius: 15%;
              padding: 0.2vmax;
            }
          }
        }
      }
    }
  }
  .prev {
    background-image: url(../assets/img/btn-left.png);
    background-size: 100% 100%;
    width: 2.5vmax;
    height: 2.5vmax;
    position: absolute;
    left: 2%;
    top: 78%;
  }
  .next {
    background-image: url(../assets/img/btn-right.png);
    background-size: 100% 100%;
    width: 2.5vmax;
    height: 2.5vmax;
    position: absolute;
    right: 2%;
    top: 78%;
  }
}
</style>
