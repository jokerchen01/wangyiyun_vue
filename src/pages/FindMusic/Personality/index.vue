<template>
  <div class="content">
    <!-- 轮播图 -->
    <div class="Carousel">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="(banner, index) in bannerList" :key="index">
          <img
            v-lazy="banner.imageUrl"
            alt=""
            style="width: 100%; height: 200px"
          />
        </el-carousel-item>
      </el-carousel>
      <!-- 推荐歌单 -->
      <h2>推荐歌单 <i class="el-icon-arrow-right"></i></h2>
      <div class="songSheet">
        <span v-for="item in recommendList" :key="item.id">
          <img
            v-lazy="item.picUrl + '?param=400y400'"
            @click="goListDetails(item.id)"
          />
          <div>{{ item.name }}</div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      bannerList: [],
      recommendList: [],
    };
  },
  mounted() {
    this.getBanner();
    this.getRecommendList();
  },
  methods: {
    //获取轮播图
    async getBanner() {
      let result = await this.$API.reqBanner();
      if (result.code == 200) {
        this.bannerList = result.banners;
      }
    },
    //获取推荐歌单
    async getRecommendList() {
      let result = await this.$API.reqRecommendList();
      if (result.code == 200) {
        this.recommendList = result.result;
      }
    },
    goListDetails(id) {
      this.$router.push({
        name: "musiclistdetails",
        params: {
          id: id,
        },
      });
    },
  },
};
</script>

<style scpoed>
.content {
  width: 1200px;
  height: 660px;
  margin: 40px auto;
}
.el-carousel {
  width: 960px;
  margin: 0 auto;
  margin-top: -20px;
}
.el-carousel__item {
  border-radius: 15px;
}

.el-carousel__item:nth-child(2n) {
  background-color: #8fa1b9;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-icon-arrow-right {
  font-weight: 700;
}
.songSheet {
  display: flex;
  width: 100%;
  height: 600px;
  flex-wrap: wrap;
}
.songSheet span {
  width: 240px;
  height: 300px;
  cursor: pointer;
}
.songSheet span img {
  width: 220px;
  height: 220px;
  border-radius: 15px;
}
.songSheet span div {
  font-size: 15px;
  width: 210px;
  height: 60px;
  margin-top: 10px;
}
</style>