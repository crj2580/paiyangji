<template>
  <div id="Environment">
    <div class="map"></div>
  </div>
</template>

<script>
export default {
  name: "Environment",
  components: {},
  data() {
    return {

    };
  },
  mounted() {

  },
  methods: {},
};
</script>
<style scoped lang="scss">
#Environment {
  .map {
    position: absolute;
    width: 82%;
    height: 64%;
    left: 9%;
    top: 16%;
    background-image: url(../assets/img/Environment/map.png);
    background-size: 100% 100%;
  }
}
</style>
