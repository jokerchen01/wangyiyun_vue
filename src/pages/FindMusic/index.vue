<template>
  <div>
    <div class="nav-top">
      <span @click="goPersonality(1)" :class="{ active: currentIndex == 1 }"
        >个性推荐</span
      >
      <span @click="goSongList(2)" :class="{ active: currentIndex == 2 }"
        >歌单</span
      >
      <span @click="goRanking(3)" :class="{ active: currentIndex == 3 }"
        >排行榜</span
      >
      <span @click="goSinger(4)" :class="{ active: currentIndex == 4 }"
        >歌手</span
      >
    </div>

    <div class="main" ref="content">
      <router-view @goTop="goTop"> </router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "FindMusic",
  components: {},
  data() {
    return {
      currentIndex: 1,
    };
  },
  mounted() {
    this.isCurrentPage();
  },
  methods: {
    goPersonality(index) {
      this.$router.push("/findmusic/personality");
      this.currentIndex = index;
    },
    goSongList(index) {
      this.$router.push("/findmusic/songlist");
      this.currentIndex = index;
    },
    goRanking(index) {
      this.$router.push("/findmusic/ranking");
      this.currentIndex = index;
    },
    goSinger(index) {
      this.$router.push("/findmusic/singer");
      this.currentIndex = index;
    },
    //判断刷新后当前页面路径保持标题样式不变
    isCurrentPage() {
      if (this.$route.path == "/findmusic/songlist") {
        this.currentIndex = 2;
      } else if (this.$route.path == "/findmusic/ranking") {
        this.currentIndex = 3;
      } else if (this.$route.path == "/findmusic/singer") {
        this.currentIndex = 4;
      }
    },
    goTop() {
      this.$refs.content.scrollTop = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  height: calc(80vh - 10px);
  width: 88vw;
  padding: 0;

  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(204, 204, 204);
  }
}
.nav-top {
  display: flex;
  margin-top: 20px;
  height: 50px;
}
.nav-top span {
  margin-left: 30px;
  height: 35px;
  cursor: pointer;
}

.active {
  font-size: 20px;
  font-weight: 700;
  border-bottom: 3px solid red;
  transform: translateY(-3px);
}
</style>

