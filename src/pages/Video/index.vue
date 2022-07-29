<template>
  <div>
    <div class="video-header">
      <div
        class="videoList"
        :class="{ active: isactive == true }"
        @click="goVideoList"
      >
        视频
      </div>
      <div
        class="mvList"
        :class="{ active: isactive == false }"
        @click="goMVList"
      >
        MV
      </div>
    </div>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      isactive: true,
    };
  },
  methods: {
    goVideoList() {
      this.$router.push("/video/videolist");
      this.isactive = true;
    },
    goMVList() {
      this.$router.push("/video/mvlist");
      this.isactive = false;
    },
  },
};
</script>

<style lang="less" scoped>
.video-header {
  display: flex;
  justify-content: space-around;
  width: 100px;
  height: 35px;
  margin: 20px 0 0 30px;
  cursor: pointer;
  .videoList {
    line-height: 30px;
  }
  .mvList {
    line-height: 30px;
  }
}
.active {
  font-size: 20px;
  font-weight: 700;
  border-bottom: 3px solid red;
}
</style>
