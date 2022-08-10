<template>
  <div class="max">
    <div class="search">
      <div class="header">
        <div class="title" @click="goSearchSong" :class="{ active: flag == 1 }">
          单曲
        </div>
        <div
          class="title"
          @click="goSearchSinger"
          :class="{ active: flag == 2 }"
        >
          歌手
        </div>
        <div
          class="title"
          @click="goSearchAlbum"
          :class="{ active: flag == 3 }"
        >
          专辑
        </div>
        <div
          class="title"
          @click="goSearchVideo"
          :class="{ active: flag == 4 }"
        >
          视频
        </div>
        <div
          class="title"
          @click="goSearchMusicList"
          :class="{ active: flag == 5 }"
        >
          歌单
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "search",
  data() {
    return {
      flag: 1,
    };
  },
  mounted() {
    /*  this.$bus.$on("changeFlag", this.goSearch); */
  },
  methods: {
    goSearchSong() {
      this.flag = 1;
      this.$router.push({ name: "searchsong" });
    },
    goSearchSinger() {
      this.flag = 2;
      this.$router.push({ name: "searchsinger" });
    },
    goSearchAlbum() {
      this.flag = 3;
      this.$router.push({ name: "searchalbum" });
    },
    goSearchVideo() {
      this.flag = 4;
      this.$router.push({ name: "searchvideo" });
    },
    goSearchMusicList() {
      this.flag = 5;
      this.$router.push({ name: "searchmusiclist" });
    },
  },
  watch: {
    $route(oldID, newID) {
      if (oldID.params.id != newID.params.id) {
        //在其他路径继续搜另一个人时 重置flag的值
        this.flag = 1;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.max {
  width: 88vw;

  .search {
    padding: 20px 30px;
    width: 100%;
    height: calc(90vh - 20px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: rgb(204, 204, 204);
    }
    .header {
      display: flex;
      align-items: center;
      width: 300px;
      height: 40px;
      justify-content: space-around;
      cursor: pointer;
      .title {
        height: 100%;
      }
    }
  }
}
.active {
  font-weight: 600;
  font-size: 20px;
  border-bottom: 3px solid #ec4141;
  transform: translateY(-3px);
}
</style>