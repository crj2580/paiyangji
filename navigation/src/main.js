import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import $ from "jquery";

// import VueAwesomeSwiper from 'vue-awesome-swiper'
// Vue.use(VueAwesomeSwiper, /* { default options with global component } */)

//FIXME 用于解决vue-awesome-swiper4.1.1对swiper6+无法显示pagination的问题 https://github.com/surmon-china/vue-awesome-swiper/issues/680#issuecomment-665051360
import {
  Swiper as SwiperClass,
  Pagination,
  Navigation,
  Mousewheel,
  Autoplay,
} from "swiper/swiper.esm";
import getAwesomeSwiper from "vue-awesome-swiper/dist/exporter";
SwiperClass.use([Pagination, Mousewheel, Navigation, Autoplay]);
Vue.use(getAwesomeSwiper(SwiperClass));
import "swiper/swiper-bundle.min.css";

window.$ = $;
Vue.config.productionTip = false;

import config from "@/assets/config.json";
for (var item in config) {
  if (config[item]) {
    Vue.prototype[item] = config[item];
  }
}

if (
  window.AndroidWebView &&
  window.AndroidWebView.getSubkeyFromJS &&
  window.AndroidWebView.getSubkeyFromJS()
) {
  Vue.prototype.subkey = window.AndroidWebView.getSubkeyFromJS();
}

//Vue.prototype.subkey="b98ea448cf32474d9c884dbdc7cacd0c";

Vue.prototype.transferUrl = function(url) {
  if (url && window.AndroidWebView && window.AndroidWebView.downloadLinks) {
    var splitArr = url.split(".");
    return "../" + window.md5(url) + "." + splitArr[splitArr.length - 1];
  } else {
    return url;
  }
};

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
