<template>
  <div class="leftBox">
    <el-popover placement="bottom-start" trigger="click" v-model="showPopover">
      <div class="popover">
        <div
          v-for="(label, index) in allLabels"
          :key="index"
          @click="getCurrentName(label)"
          :class="{ currentItem: label.name == currentLabel.name }"
        >
          {{ label.name }}
        </div>
      </div>
      <el-button slot="reference" class="popover-title">{{
        currentLabel.name
      }}</el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "LeftBox",
  props: ["allLabels", "currentLabel"],
  data() {
    return {
      showPopover: false,
    };
  },
  methods: {
    getCurrentName(label) {
      this.$emit("clickLeftBox", label);
      this.showPopover = false;
    },
  },
};
</script>

<style scoped>
.popover {
  display: flex;
  width: 430px;
  height: 400px;
  flex-wrap: wrap;
  overflow-y: auto;
}
.popover::-webkit-scrollbar {
  width: 8px;
}
.popover::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgb(204, 204, 204);
}
.popover div {
  width: 90px;
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
  text-align: center;
  margin-top: 20px;
  margin-left: 10px;
  cursor: pointer;
}
.popover-title {
  border-radius: 15px;
  height: 30px;
  line-height: 8px;
}
.popover-title::after {
  content: "\e65f";
  font-weight: 700;
  font-family: "iconfont";
}
.leftBox >>> .el-popover__reference {
  color: #666;
  background-color: transparent;
  border: none;
}
.currentItem {
  color: #eb4f4f;
  background-color: #fcebeb;
}
</style>