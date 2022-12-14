<template>
  <div id="Activity">
    <div class="outer-container">
      <div v-if="showSwiper" class="swiper-container" id="swiper-container">
        <div class="swiper-wrapper">
          <div v-for="(ad, index) of adList" :key="index" class="swiper-slide">
            <img :src="transferUrl(ad.fileUrl)" />
          </div>
        </div>
      </div>
    </div>

    <div @click="prev" class="prev"></div>
    <div @click="next" class="next"></div>
  </div>
</template>

<script>
export default {
  name: "Activity",
  props: ["ads"],
  data() {
    return {
      showSwiper: false,
      adList: [],
      swiperOption: {
        direction:
          process.env.VUE_APP_THEME == "Portrait" ? "vertical" : "horizontal",
        effect: "coverflow",
        // grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: true,
        coverflowEffect: {
          rotate: 0,
          stretch: "60%",
          depth: 200,
          modifier: 1,
          slideShadows: false,
        },
      },
    };
  },
  mounted() {
    this.generateAdsList();
    this.$nextTick(() => {
      this.swiper = new window.Swiper("#swiper-container", this.swiperOption);
    });
  },
  methods: {
    generateAdsList() {
      if (this.ads.length) {
        var adListUnit = this.ads.map((ads) => {
          console.log("活动图片", this.transferUrl(ads.fileUrl));
          return {
            fileUrl: ads.fileUrl,
          };
        });
        while (this.adList.length <= 5) {
          this.adList = this.adList.concat(adListUnit);
        }
        this.showSwiper = true;
      }
    },
    prev() {
      this.swiper.slidePrev();
    },
    next() {
      this.swiper.slideNext();
    },
  },
};
</script>
<style scoped lang="scss">
#Activity {
  .outer-container {
    width: 90vw;
    margin: 0 auto;
    padding-top: 8vw;

    #swiper-container {
      width: 100%;
      .swiper-slide {
        width: 52vw;
        height: 31vw;
        opacity: 0.5;
        &.swiper-slide.swiper-slide-prev,
        &.swiper-slide.swiper-slide-next {
          opacity: 0.8;
        }
        &.swiper-slide.swiper-slide-active {
          opacity: 1;
        }
        img {
          width: 100%;
          height: 100%;
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
    left: 5%;
    top: 72%;
  }
  .next {
    background-image: url(../assets/img/btn-right.png);
    background-size: 100% 100%;
    width: 2.5vmax;
    height: 2.5vmax;
    position: absolute;
    right: 5%;
    top: 72%;
  }
}
</style>
