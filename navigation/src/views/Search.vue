<template>
  <div id="Search">
    <div class="brand-container">
      <div class="brand-header">
        品 牌 搜 索
        <span v-if="filterText">({{ filterText }})</span>
      </div>
      <div class="brand-main">
        <template v-if="filterData.length != 0 && showSwiper">
          <swiper ref="swiper" :options="swiperOption" v-if="!useVirtual">
            <template v-for="brandList in computedFilterData">
              <swiper-slide :key="brandList.id">
                <div class="brandWrapper">
                  <div
                    class="brand-item"
                    v-for="brand in brandList"
                    :key="brand.id"
                    @click="handleClick(brand.id)"
                  >
                    <div class="brand-logo">
                      <img
                        v-if="brand.logoUrl"
                        :src="transferUrl(brand.logoUrl)"
                      />
                      <img v-else src="@/assets/img/noLogo.png" />
                    </div>
                    <p class="brand-name">{{ brand.name }}</p>
                  </div>
                </div>
              </swiper-slide>
            </template>
          </swiper>

          <div
            v-if="useVirtual"
            class="swiper-container"
            ref="swiper"
            id="swiper-container"
          >
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(brandList, index) in realData.slides"
                :key="index"
                :style="{ top: `${realData.offset}px` }"
              >
                <div class="brandWrapper">
                  <div
                    class="brand-item"
                    v-for="brand in brandList"
                    :key="brand.id"
                    @click="handleClick(brand.id)"
                  >
                    <div class="brand-logo">
                      <img
                        v-if="brand.logoUrl"
                        :src="transferUrl(brand.logoUrl)"
                      />
                      <img v-else src="@/assets/img/noLogo.png" />
                    </div>
                    <p class="brand-name">{{ brand.name }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="brand-btns">
            <div @click="prev" class="btn1 btn">
              <img src="@/assets/img/btn-up.png" />
            </div>
            <div @click="next" class="btn2 btn">
              <img src="@/assets/img/btn-down.png" />
            </div>
          </div>
        </template>
        <div class="tip" v-else>没有搜索到相关内容，请换个关键字试试</div>
      </div>
    </div>
    <div class="keybord-container">
      <div class="form-control">
        <div class="input">
          {{ filterText ? filterText : "请输入您想找的店铺名" }}
        </div>
        <button class="button" @click="filter">搜索</button>
      </div>
      <div class="keybord-wrapper">
        <div class="number-keybord">
          <div @click="keyClick(i)" class="key" v-for="i in 9" :key="i">
            {{ i }}
          </div>
          <div @click="keyClick(0)" class="key">0</div>
        </div>
        <div class="en-keybord">
          <div @click="keyClick('Q')" class="key">Q</div>
          <div @click="keyClick('W')" class="key">W</div>
          <div @click="keyClick('E')" class="key">E</div>
          <div @click="keyClick('R')" class="key">R</div>
          <div @click="keyClick('T')" class="key">T</div>
          <div @click="keyClick('Y')" class="key">Y</div>
          <div @click="keyClick('U')" class="key">U</div>
          <div @click="keyClick('I')" class="key">I</div>
          <div @click="keyClick('O')" class="key">O</div>
          <div @click="keyClick('P')" class="key">P</div>
        </div>
        <div class="en-keybord">
          <div @click="keyClick('A')" class="key">A</div>
          <div @click="keyClick('S')" class="key">S</div>
          <div @click="keyClick('D')" class="key">D</div>
          <div @click="keyClick('F')" class="key">F</div>
          <div @click="keyClick('G')" class="key">G</div>
          <div @click="keyClick('H')" class="key">H</div>
          <div @click="keyClick('J')" class="key">J</div>
          <div @click="keyClick('K')" class="key">K</div>
          <div @click="keyClick('L')" class="key">L</div>
        </div>
        <div class="en-keybord">
          <div @click="keyClick('Z')" class="key">Z</div>
          <div @click="keyClick('X')" class="key">X</div>
          <div @click="keyClick('C')" class="key">C</div>
          <div @click="keyClick('V')" class="key">V</div>
          <div @click="keyClick('B')" class="key">B</div>
          <div @click="keyClick('N')" class="key">N</div>
          <div @click="keyClick('M')" class="key">M</div>
          <div @click="keyDelete" class="backspace">
            <img src="@/assets/img/Search/Backspace.png" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import zpinyin from "zpinyin";
import lpinyin from "lpinyin";



export default {
  name: "Search",
  components: {},
  props: ["brands"],
  data() {
    return {
      filterText: "",
      filterData: [],
      showSwiper: true,
      count: process.env.VUE_APP_THEME == "Portrait" ? 9 : 12,
      computedFilterData: [],
      useVirtual: false,//是否启用虚拟dom
      swiper: null,
      realData: {
        slides: [],
      },
    };
  },
  computed: {
    swiperOption() {
      var _this = this;
      return {
        direction: "vertical",
        // slidesPerView: "auto",
        // slidesPerColumn: process.env.VUE_APP_THEME == "Portrait" ? 3 : 4,
        // slidesPerColumnFill: "row",
        // observer: true, //修改swiper自己或子元素时，自动初始化swiper
        // observeParents: true,
        on: {
          tap() {
            if (this.clickedSlide) {
              _this.$emit("show-room-detail", {
                brandId: this.clickedSlide.dataset.brandid,
              });
              console.log("tap");
            }
          },
        },
      };
    },
  },
  created() {
    this.filterData = this.brands;

    if (this.useVirtual) {
      this.$nextTick(() => {
        var _this = this;
        this.swiper = new window.Swiper("#swiper-container", {
          direction: "vertical",
          virtual: {
            slides: _this.computedFilterData,
            renderExternal: function(data) {
              console.log("renderExternal", data);
              _this.realData = data;
              // _this.$nextTick(() => {
              //   this.slideToClosest();
              // });
            },
            addSlidesBefore: 1,
            addSlidesAfter: 1,
          },
        });
      });
    }
  },
  watch: {
    filterText() {
      this.filter();
    },
    filterData(newV) {
      var computedFilterData = [];
      for (let i = 0; i < Math.ceil(newV.length / this.count); i++) {
        computedFilterData.push(
          newV.slice(i * this.count, (i + 1) * this.count)
        );
      }
      this.computedFilterData = computedFilterData;
    },
  },
  methods: {
    handleClick(id) {
      this.$emit("show-room-detail", {
        brandId: id,
      });
    },
    prev() {
      if (this.useVirtual) {
        this.swiper.slidePrev();
      } else {
        this.$refs.swiper.$swiper.slidePrev();
      }
    },
    next() {
      if (this.useVirtual) {
        this.swiper.slideNext();
      } else {
        this.$refs.swiper.$swiper.slideNext();
      }
    },
    filter() {
      // this.filterData = new zpinyin(this.brands, ["name"]).query(
      //   this.filterText
      // );
     this.filterData = new lpinyin(this.brands, "name").query(
        this.filterText
      );


    },
    keyDelete() {
      if (!this.filterText) return;
      this.showSwiper = false;
      this.filterText = this.filterText.substring(
        0,
        this.filterText.length - 1
      );
      this.$nextTick(() => {
        this.showSwiper = true;
      });
    },
    keyClick(str) {
      this.filterText += str;
    },
  },
};
</script>
<style scoped lang="scss">
#Search {
  .brand-container {
    // overflow: hidden;
    padding-top: 2vmax;
    box-sizing: border-box;
    width: 50vmax;
    height: 36vmax;
    position: absolute;
    left: 4vw;
    top: 9vw;
    background-color: #fff;
    border-radius: 2vmax;
    box-shadow: 0 0 1vmax rgba(0, 0, 0, 0.1);
    .brand-header {
      width: 100%;
      text-align: center;
      color: #777;
      font-size: 1.6vmax;
      font-weight: bold;
      margin-bottom: 1.6vmax;
      span {
        color: #e3007e;
      }
    }
    .brand-main {
      width: 94%;
      height: 78%;
      margin-left: 6%;
      display: flex;
      flex-wrap: wrap;
      .tip {
        font-size: 1.5vmax;
        font-weight: 700;
        color: #e3007e;
        line-height: 10vmax;
        width: 100%;
        text-align: center;
      }
      .swiper-container {
        width: 90%;
        // height: 26.1vmax;
        height: 100%;
        // overflow: hidden;
        // display: flex;
        // flex-wrap: wrap;
        .swiper-wrapper {
          -webkit-perspective: 5000;
          -webkit-backface-visibility: hidden;
        }
        .swiper-slide {
          // border: none;
          width: 90%;
          // height: 26.1vmax;
          height: 100%;
          // padding-top: 0.5vmax;
          // width: 9.7vmax;
          // height: 8.2vmax;
          .brandWrapper {
            div {
              transform: translateZ(0); //安卓抗锯齿
            }
            width: 100%;
            // height: 26.1vmax;
            height: 100%;
            display: flex;
            // justify-content: space-between;
            align-content: flex-start;
            flex-wrap: wrap;
          }
          .brand-item {
            margin-top: 0.2vmax;
            margin-right: 1%;
            width: 24%;
            height: 8.2vmax;
            border: 0.2vmax solid #adadad;
            box-sizing: border-box;
            // width: 100%;
            // height: 100%;
            .brand-logo {
              width: 100%;
              height: 75%;
              text-align: center;
              img {
                width: auto;
                height: auto;
                max-width: 100%;
                max-height: 100%;
              }
            }
            .brand-name {
              color: #5e5e5e;
              border-top: 0.2vmax solid #c2c2c2;
              height: 25%;
              line-height: 2vmax;
              text-align: center;
              font-size: 1vmax;
              overflow: hidden;
            }
          }
        }
      }
      .brand-btns {
        width: 3.6vmax;
        // position: relative;
        .btn {
          width: 2vmax;
          height: 2vmax;
          position: absolute;
          right: 2vw;
        }
        .btn1 {
          bottom: 8vmax;
        }
        .btn2 {
          bottom: 4vmax;
        }
      }
    }
  }
  .keybord-container {
    padding-top: 3.7vmax;
    width: 40vmax;
    height: 36vmax;
    position: absolute;
    right: 3vw;
    top: 9vw;
    .form-control {
      .input {
        display: inline-block;
        font-size: 1.3vmax;
        width: 31.4vmax;
        height: 3.4vmax;
        outline: none;
        border: 0.2vmax solid #c0c0c0;
        border-radius: 0.8vmax;
        padding-left: 1.2vmax;
        vertical-align: middle;
        line-height: 3.4vmax;
        color: #c0c0c0;
        letter-spacing: 0.1vmax;
      }
      .button {
        margin-left: 1vmax;
        vertical-align: middle;
        font-family: "siyuanheiti";
        font-size: 1.6vmax;
        color: #fff;
        width: 5.5vmax;
        height: 3.4vmax;
        background-color: #e3007e;
        box-shadow: 0vmax 0vmax 0.3vmax 0vmax rgba(0, 0, 0, 0.15);
        border-radius: 0.5vmax;
        border: solid 0.1vmax #c0c0c0;
      }
    }
    .number-keybord {
      width: 36.5vmax;
      margin: 3.4vmax auto 0.8vmax;
      display: flex;
      justify-content: space-around;
    }
    .en-keybord {
      width: 34.5vmax;
      margin: 0 auto 0.8vmax;
      display: flex;
      justify-content: space-around;
      &:nth-of-type(3) {
        width: 32.5vmax;
      }
      &:nth-of-type(4) {
        width: 30.5vmax;
      }
    }
    .key {
      width: 2.7vmax;
      height: 3.5vmax;
      font-size: 2vmax;
      line-height: 3.5vmax;
      text-align: center;
      color: #818388;
      border-radius: 0.6vmax;
      border: 0.1vmax solid #c7c7c7;
    }
    .backspace {
      margin-left: 1.2vmax;
      height: 3.7vmax;
      border: none;
      img {
        height: 100%;
      }
    }
  }
}
</style>
