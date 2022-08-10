<template>
  <div class="search-Singer">
    <h3>找到{{ singerCount }}位歌手</h3>

    <div class="songSheet">
      <span
        v-for="a in searchSingerList"
        :key="a.id"
        @click="clickListCardItem(a.id)"
      >
        <img :src="a.img1v1Url + '?param=400y400'" />

        <div>{{ a.name }}</div>
      </span>
    </div>
    <div class="footer">
      <el-pagination
        layout="prev, pager, next"
        :total="singerCount"
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
      singerCount: 1,
      searchSingerList: [],
      currentPage: 1,
    };
  },
  created() {
    this.getSearchSinger();
  },
  methods: {
    // 请求搜索歌手
    async getSearchSinger() {
      let res = await this.$API.reqSearchSong({
        keywords: this.$route.params.id,
        offset: 30 * (this.currentPage - 1),
        type: 100,
      });
      console.log(res);
      this.singerCount = res.result.artistCount;
      this.searchSingerList = res.result.artists;
    },
    pageChange(page) {
      this.currentPage = page;
      this.searchSingerList = [];
      this.getSearchSinger();
    },
    // 跳转至singerDetail页面
    clickListCardItem(id) {
      this.$router.push({ name: "singerdetail", params: { id } });
    },
  },
  watch: {},
};
</script>

<style lang="less" scoped>
.search-Singer {
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