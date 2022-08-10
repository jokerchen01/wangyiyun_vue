<template>
  <div class="search-Album">
    <h3>找到{{ albumCount }}个专辑</h3>

    <div class="songSheet">
      <span v-for="a in searchAlbumList" :key="a.id">
        <img :src="a.picUrl + '?param=400y400'" />

        <div>{{ a.name }}</div>
      </span>
    </div>
    <div class="footer">
      <el-pagination
        layout="prev, pager, next"
        :total="albumCount"
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
      albumCount: 0,
      searchAlbumList: [],
      currentPage: 1,
    };
  },
  methods: {
    // 请求
    // 请求搜索专辑
    async getSearchAlbum() {
      let res = await this.$API.reqSearchSong({
        keywords: this.$route.params.id,
        offset: 30 * (this.currentPage - 1),
        type: 10,
      });

      this.albumCount = res.result.albumCount;
      this.searchAlbumList = res.result.albums;
    },
    // 评论点击翻页的回调
    pageChange(page) {
      this.currentPage = page;
      this.searchAlbumList = [];
      this.getSearchAlbum();
    },
    // 点击卡片的回调
  },
  created() {
    this.getSearchAlbum();
  },
};
</script>

<style lang="less" scoped>
//一样的布局就直接复制了 懒得封装了
.search-Album {
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