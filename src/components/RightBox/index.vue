<template>
  <div>
    <div class="RightBox-ul">
      <div
        v-for="(hot, index) in hotLabel"
        :key="hot.id"
        @click="changeIndex(index)"
        :class="{ active: currentIndex == index }"
        class="RightBox-li"
      >
        {{ hot.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RightBox",
  props: ["hotLabel", "currentLabel"],
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    //改变索引值重新发请求
    changeIndex(index) {
      this.currentIndex = index;
      this.$emit("clickRightBox", index);
    },
  },
  watch: {
    currentLabel(leftLabel) {
      this.currentIndex = this.hotLabel.findIndex(
        (item) => item.name == leftLabel.name
      );
    },
  },
};
</script>

<style scoped>
.RightBox-ul {
  display: flex;
  height: 30px;
  flex-wrap: wrap;
  line-height: 30px;
}
.RightBox-li {
  text-align: center;
  width: 76px;
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  color: #666;
  transform: scale(0.9, 0.9);
  cursor: pointer;
}
.active {
  border-radius: 14px;
  background-color: #fdf5f5;
  color: #ec4747;
}
</style>