<template>
  <div class="search-Video">
    <h3>找到{{ videoCount }}个视频</h3>

    <div class="songSheet">
      <span
        v-for="a in searchVideoList"
        :key="a.vid"
        @click="clickListCardItem(a.vid, a.type)"
      >
        <img :src="a.coverUrl + '?param=400y400'" />

        <div>{{ a.title }}</div>
      </span>
    </div>
    <div class="footer">
      <el-pagination
        layout="prev, pager, next"
        :total="videoCount"
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
      videoCount: 0,
      searchVideoList: [],
      currentPage: 1,
    };
  },
  methods: {
    // 请求
    // 请求搜索专辑
    async getSearchVideo() {
      let res = await this.$API.reqSearchSong({
        keywords: this.$route.params.id,
        offset: 30 * (this.currentPage - 1),
        type: 1014,
      });

      this.videoCount = res.result.videoCount;
      this.searchVideoList = res.result.videos;
    },
    // 评论点击翻页的回调
    pageChange(page) {
      this.currentPage = page;
      this.searchVideoList = [];
      this.getSearchVideo();
    },
    // 点击videoCard的回调
    clickListCardItem(id, type) {
      console.log(id);
      console.log(type);
      if (type == 0) {
        this.$router.push({ name: "videodetail", params: { id, type: "mv" } });
      } else {
        this.$router.push({
          name: "videodetail",
          params: { id, type: "video" },
        });
      }
    },
  },
  created() {
    this.getSearchVideo();
  },
};
</script>

<style lang="less" scoped>
//一样的布局就直接复制了 懒得封装了
.search-Video {
  margin-top: 30px;
  padding-left: 80px;
  .songSheet {
    display: flex;
    width: 100%;
    height: 100%;
    flex-wrap: wrap;
  }
  .songSheet span {
    margin-right: 30px;
    width: 280px;
    height: 245px;
    cursor: pointer;
  }
  .songSheet span img {
    width: 100%;
    height: 180px;
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