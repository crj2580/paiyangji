<template>
  <div id="Recommend">
    <div class="nav">
      <swiper :options="swiperOptionNav" class="swiperNav">
        <template v-for="cate in brandCategorys">
          <swiper-slide :key="cate.id" :data-id="cate.id">
            <div class="nav-item" :class="activeId == cate.id ? 'active' : ''">
              <div class="item">
                <img
                  v-if="activeId != cate.id"
                  :src="transferUrl(cate.imageUrl)"
                />
                <img v-else :src="transferUrl(cate.iconUrl)" />
                {{ cate.text }}
              </div>
            </div>
          </swiper-slide>
        </template>
      </swiper>
    </div>

    <div class="sub-nav" v-if="subnavFlag">
      <div class="btn btn-left" @click="subNavBtnClick('prev')">
        <img src="@/assets/img/Recommend/arrow-l.png" />
      </div>
      <swiper
        ref="swiperSubNav"
        :options="swiperOptionSubNav"
        class="swiperSubNav"
      >
        <template v-for="nav in navChild.children">
          <swiper-slide :key="nav.id" :data-id="nav.id">
            <div class="subnav-box">
              <div
                class="sub-item"
                :class="selectId == nav.id ? 'is-selected' : ''"
              >
                {{ nav.text }}
              </div>
            </div>
          </swiper-slide>
        </template>
      </swiper>
      <div class="btn btn-right" @click="subNavBtnClick('next')">
        <img src="@/assets/img/Recommend/arrow-r.png" />
      </div>
    </div>

    <div class="main">
      <swiper
        v-if="flag"
        ref="swiperBrand"
        :options="swiperOptionBrand"
        class="swiperBrand"
      >
        <template v-for="i in filterData">
          <swiper-slide :key="i.id" :data-brandid="i.id">
            <div class="itemContainer">
              <div class="item">
                <div class="brand-logo">
                  <img v-if="i.logoUrl" :src="transferUrl(i.logoUrl)" />
                  <img v-else src="@/assets/img/noLogo.png" />
                </div>
                <p class="brand-name">{{ i.name }}</p>
              </div>
            </div>
          </swiper-slide>
        </template>
      </swiper>
    </div>
    <div @click="prevSlider" class="prevSlider"></div>
    <div @click="nextSlider" class="nextSlider"></div>
  </div>
</template>

<script>
export default {
  name: "Recommend",
  props: ["brands", "brandCategorys"],
  data() {
    return {
      filterData: [],
      room: {},
      activeId: "",
      selectId: "",
      navChild: {},
      sliderIndex: 0,
      cateList: [],
      flag: true,
      subnavFlag: false,
    };
  },
  computed: {
    swiperSubNav() {
      return this.$refs.swiperSubNav.$swiper;
    },
    swiperOptionNav() {
      var _this = this;
      return {
        direction: "horizontal",
        slidesPerView: process.env.VUE_APP_THEME == "Portrait" ? 3 : 4,
        slidesPerColumnFill: "row",
        on: {
          tap() {
            var id = this.clickedSlide.dataset.id;
            _this.activeId = id;

            _this.flag = false;

            // 筛二级
            if (_this.subnavFlag) {
              _this.changeSubNavByNav(id);
            } else {
              _this.filterData = _this.filterBrandByCateId(
                _this.activeId,
                _this.brands
              );
            }

            _this.$nextTick(() => {
              _this.flag = true;
            });
          },
        },
      };
    },
    // 二级分类
    swiperOptionSubNav() {
      var _this = this;
      return {
        direction: "horizontal",
        slidesPerView: process.env.VUE_APP_THEME == "Portrait" ? 4.9 : 5.9,
        loop: true,
        slidesOffsetBefore: process.env.VUE_APP_THEME == "Portrait" ? -2 : -10,
        slideToClickedSlide: true,
        centeredSlides: true,
        on: {
          tap() {
            var id = this.clickedSlide.dataset.id;
            _this.selectId = id;
            _this.filterData = _this.filterBrandByCateId(
              _this.selectId,
              _this.brands
            );
          },
        },
      };
    },
    swiperOptionBrand() {
      var _this = this;
      return {
        direction:
          process.env.VUE_APP_THEME == "Portrait" ? "vertical" : "horizontal",
        slidesPerView: process.env.VUE_APP_THEME == "Portrait" ? 4 : 6,
        slidesPerColumn: process.env.VUE_APP_THEME == "Portrait" ? 3 : 2, //显示2行
        slidesPerColumnFill: "row",
        on: {
          tap() {
            _this.$emit("show-room-detail", {
              brandId: this.clickedSlide.dataset.brandid,
            });
          },
        },
      };
    },
  },
  created() {
    // 是否有二级分类
    this.subnavFlag = this.brandCategorys.every(
      (item) => item.children.length != 0
    );

    if (this.subnavFlag) {
      var list = [];
      this.brandCategorys.forEach((item) => {
        list.push(...item.children);
      });

      this.cateList = list;
    }

    // 选中第一项
    this.filterData = this.brands;
    this.activeId = this.brandCategorys[0].id;
    this.filterData = this.filterBrandByCateId(this.activeId, this.brands);

    // 有二级分类选中一级分类下的二级分类的的第一项
    if (this.subnavFlag) {
      this.navChild = this.brandCategorys.find(
        (cate) => cate.id == this.activeId
      );
      this.selectId = this.navChild.children[0].id;
      this.selectId = this.brandCategorys[0].children[0].id;
      this.filterData = this.filterBrandByCateId(this.selectId, this.brands);
    }
  },
  methods: {
    changeSubNavByNav(id) {
      this.activeId = id;
      this.navChild = this.brandCategorys.find(
        (cate) => cate.id == this.activeId
      );
      this.selectId = this.navChild.children[0].id
      this.filterData = this.filterBrandByCateId(this.selectId, this.brands);
    },

    filterBrandByCateId(cateId, brandList) {
      var list = [];
      brandList.forEach((brand) => {
        if (brand.b_BrandCategories.findIndex((i) => i.id == cateId) != -1) {
          list.push(brand);
        }
      });
      return list;
    },

    subNavBtnClick(type) {
      if (type == "prev") {
        this.swiperSubNav.slidePrev();
      } else if (type == "next") {
        this.swiperSubNav.slideNext();
      }
      this.selectId = this.swiperSubNav.slides[
        this.swiperSubNav.activeIndex
      ].dataset.id;
      this.selectId = this.selectId;
      this.filterData = this.filterBrandByCateId(this.selectId, this.brands);
    },

    prevSlider() {
      var num = process.env.VUE_APP_THEME == "Portrait" ? 4 : 6;
      if (this.sliderIndex <= 0) {
        this.sliderIndex = 0;
      } else {
        --this.sliderIndex;
      }
      this.$refs.swiperBrand.$swiper.slideTo(
        this.sliderIndex * num,
        500,
        false
      );
    },
    nextSlider() {
      var num = process.env.VUE_APP_THEME == "Portrait" ? 4 : 6;
      var count = Math.ceil(this.filterData.length / 12);

      if (this.sliderIndex >= count) {
        this.sliderIndex = count;
      } else {
        ++this.sliderIndex;
      }
      this.$refs.swiperBrand.$swiper.slideTo(
        this.sliderIndex * num,
        500,
        false
      );
    },
  },
};
</script>
<style scoped lang="scss">
#Recommend {
  padding-top: 4.3vmax;
  box-sizing: border-box;

  .nav {
    margin: 0 auto;
    width: 58vmax;
    .nav-item {
      padding: 0.5vmax;
      border-radius: 2.5vmax;
      &.active {
        border: 0.2vmax solid #e3007e;
        .item {
          background-color: #e3007e;
          color: #fff;
          img {
            opacity: 0.4;
          }
        }
      }
      .item {
        text-align: center;
        line-height: 3.6vmax;
        font-size: 1.3vmax;
        height: 3.6vmax;
        background-color: #ebebeb;
        border-radius: 2.5vmax;
        color: #818181;
        img {
          vertical-align: middle;
          margin-right: 0.2vmax;
        }
      }
    }
  }
  .sub-nav {
    width: 70vmax;
    margin: 2vmax auto 0;
    display: flex;
    .swiperSubNav {
      width: 59vmax;
      .swiper-slide-active {
        .is-selected {
          background-color: #818181;
          color: #fff !important;
        }
      }
      .swiper-slide {
        width: 9vmax;

        .subnav-box {
          border-right: 0.1vmax solid #696969;
          box-sizing: border-box;
          .sub-item {
            margin: 0 auto;
            font-size: 1.3vmax;
            padding: 0 0.7vmax;
            width: 7vmax;
            height: 2vmax;
            line-height: 2vmax;
            color: #959595;
            text-align: center;
            border-radius: 1vmax;
          }
        }
      }
    }
  }

  .main {
    margin: 5.5vmax auto 0;
    width: 80vw;
    .swiperBrand {
      width: 80vmax;
      .swiper-slide {
        width: 12.4vmax;
        height: 10.7vmax;
        .itemContainer {
          // div {
          //     transform: translateZ(0); //安卓抗锯齿
          //   }
          width: 100%;
          height: 100%;
          padding: 0.5vmax;
          box-sizing: border-box;
          .item {
            width: 100%;
            height: 100%;
            border: 0.1vmax solid #8e8e8e;
            box-sizing: border-box;
            .brand-logo {
              width: 100%;
              height: 7.5vmax;
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
              height: 2vmax;
              line-height: 2vmax;
              text-align: center;
              font-size: 1vmax;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
  .prevSlider {
    background-image: url(../assets/img/btn-left.png);
    background-position: center center;
    background-repeat: no-repeat;
    width: 3.5vmax;
    height: 3.5vmax;
    position: absolute;
    left: 2%;
    top: 78%;
  }
  .nextSlider {
    background-image: url(../assets/img/btn-right.png);
    background-position: center center;
    background-repeat: no-repeat;
    width: 3.5vmax;
    height: 3.5vmax;
    position: absolute;
    right: 2%;
    top: 78%;
  }
}
</style>
