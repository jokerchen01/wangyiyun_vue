<template>
  <div class="search-musicList">
    <h3>找到{{ musicListCount }}个歌单</h3>

    <div class="songSheet">
      <span
        v-for="a in searchMusicList"
        :key="a.id"
        @click="clickListCardItem(a.id)"
      >
        <img :src="a.coverImgUrl + '?param=400y400'" />

        <div>{{ a.name }}</div>
      </span>
    </div>
    <div class="footer">
      <el-pagination
        layout="prev, pager, next"
        :total="musicListCount"
        :page-size="30"
        :current-page="currentPage"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicListCount: 0,
      searchMusicList: [],
      currentPage: 1,
    };
  },
  methods: {
    // 请求
    // 请求搜索歌手
    async getSearchMusicList() {
      let res = await this.$API.reqSearchSong({
        keywords: this.$route.params.id,
        offset: 30 * (this.currentPage - 1),
        type: 1000,
      });

      this.musicListCount = res.result.playlistCount;
      this.searchMusicList = res.result.playlists;
    },
    // 评论点击翻页的回调
    pageChange(page) {
      this.currentPage = page;
      this.searchMusicList = [];
      this.getSearchMusicList();
    },
    // 跳转至musicListDetail页面
    clickListCardItem(id) {
      this.$router.push({ name: "musiclistdetails", params: { id } });
    },
  },
  created() {
    this.getSearchMusicList();
  },
};
</script>

<style lang="less" scoped>
//一样的布局就直接复制了 懒得封装了
.search-musicList {
  margin-top: 30px;
  padding: 0 80px;
  .songSheet {
    display: flex;
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
  }
  .songSheet span {
    width: 250px;
    height: 300px;
    cursor: pointer;
  }
  .songSheet span img {
    width: 230px;
    height: 230px;
    border-radius: 15px;
  }
  .songSheet span div {
    font-size: 15px;
    width: 210px;
    height: 60px;
    margin-top: 10px;
  }
  .footer {
    height: 50px;

    text-align: center;
  }
}
</style>