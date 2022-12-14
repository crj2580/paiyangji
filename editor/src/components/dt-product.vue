<template>
  <div class="dt-product">
    <div class="detailGroup" v-show="selectedItem.type == 'product'">
      <div class="row">
        <span>商品</span>
        <input
          list="bro"
          v-model="selectedItem.productName"
          @input="$parent.maybeProduct($event, selectedItem)"
          @compositionend="$parent.searchProduct($event, selectedItem)"
        />
        <datalist id="bro">
          <option
            v-for="opt of selectedItem.optList"
            :key="opt.id"
            :value="opt.productName"
          ></option>
        </datalist>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dt-product",
  props: ["value"],
  data() {
    return {
      selectedItem: null,
    };
  },
  watch: {
    value(newVal) {
      this.selectedItem = newVal;
    },
  },
  created() {
    this.selectedItem = this.value;
  },
  methods: {
    handleInput(e, tag) {
      this.selectedItem[tag] = e.target.value;
      this.$emit("input", this.selectedItem);
    },
  },
};
</script>

<style lang="less" scoped>
</style>
