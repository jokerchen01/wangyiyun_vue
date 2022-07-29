<template>
  <div class="content1" ref="content">
    <!-- 头部 -->
    <div class="highqualityEntry">
      <img v-lazy="HighQualityImg.coverImgUrl" alt="" class="backgroundImg" />
      <div class="left">
        <img v-lazy="HighQualityImg.coverImgUrl" alt="" class="left-Img" />
      </div>
      <div class="right">
        <div class="right-good">
          <div>精品歌单</div>
        </div>
        <div class="right-title">{{ HighQualityImg.name }}</div>
      </div>
    </div>
    <!-- 导航区 -->
    <div class="nav-center">
      <div class="nav-left" @click="getAllLabels">
        <LeftBox
          :allLabels="allLabels"
          :currentLabel="currentLabel"
          @clickLeftBox="clickLeftBox"
        ></LeftBox>
      </div>
      <div class="nav-right">
        <RightBox
          :hotLabel="hotLabel"
          :currentLabel="currentLabel"
          @clickRightBox="clickRightBox"
        ></RightBox>
      </div>
    </div>

    <div class="songList" v-loading="loading">
      <span v-for="song in songList" :key="song.id">
        <img
          :src="song.coverImgUrl + '?param=400y400'"
          alt=""
          @click="goListDetails(song.id)"
        />
        <div>{{ song.name }}</div>
      </span>
    </div>
    <!-- 分页器 -->
    <!--  @size-change="handleSizeChange"
       -->
    <div class="footer">
      <el-pagination
        style="text-align: center"
        :current-page="currentPage"
        :page-size="50"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
        v-show="!loading"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import RightBox from "@/components/RightBox";
import LeftBox from "@/components/LeftBox";
export default {
  name: "",
  components: { RightBox, LeftBox },
  data() {
    return {
      //热门标签
      hotLabel: [],
      //顶部背景图
      HighQualityImg: [],
      //第一个默认的标签的歌曲
      currentLabel: {},
      currentPage: 1,
      //热门歌曲
      songList: [],
      //全部标签
      allLabels: [],
      //box标签当前显示的名字
      total: 1,
      loading: true,
    };
  },
  mounted() {
    // 切换页面时滚动条自动滚动到顶部

    this.getBoutiqueLabel();
    this.getHighQuality();
  },
  methods: {
    async getHighQuality() {
      let result = await this.$API.reqHighQuality();
      if (result.code == 200) {
        this.HighQualityImg = result.playlists[0];
      }
    },
    //获取标签
    async getBoutiqueLabel() {
      let result = await this.$API.reqBoutiqueLabel();
      if (result.code == 200) {
        this.hotLabel = result.tags;
        this.currentLabel = result.tags[0];
      }
      this.getSongList();
      this.currentIndex = 0;
    },

    //获取歌单列表
    async getSongList() {
      let result = await this.$API.reqSongList({
        cat: this.currentLabel.name,
        offset: (this.currentPage - 1) * 50,
      });
      this.songList = result.playlists;
      this.total = result.total;
      this.loading = false;
    },
    clickLeftBox(label) {
      this.currentLabel = label;
      this.currentPage = 1;
      this.loading = true;
      this.getSongList();
    },
    clickRightBox(index) {
      this.currentLabel = this.hotLabel[index];
      this.currentPage = 1;
      this.loading = true;
      this.getSongList();
    },
    //获取全部标签
    async getAllLabels() {
      let result = await this.$API.reqAllLabels();
      if (result.code == 200) {
        this.allLabels = result.sub;
      }
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.loading = true;
      this.getSongList();
      this.$emit("goTop");
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

<style scoped>
.content1 {
  width: 1200px;
  margin: 40px auto;
}
.highqualityEntry {
  overflow: hidden;
  position: relative;
  display: flex;
  width: 1180px;
  height: 170px;
  border-radius: 15px;
  background-size: 100%;
}
.backgroundImg {
  position: absolute;
  width: 100%;
  height: 800px;
  z-index: -1;
  transform: translateY(0px);
  filter: blur(30px) brightness(70%);
}
.left {
  margin-top: 10px;
  margin-left: 10px;
  width: 150px;
  height: 150px;
}
.left-Img {
  width: 100%;
  border-radius: 10px;
}
.right {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.right-good {
  flex: 1;
  position: relative;
  width: 100%;
}
.right-good div {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 110px;
  height: 35px;
  padding-top: 10px;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #d59e54;
  color: #d59e54;
  font-size: 14px;
}
.right-good div::before {
  margin-right: 7px;
  content: "\e62a";
  font-family: "iconfont";
}
.right-title {
  flex: 2;
  padding: 20px 0 0 10px;
  color: #fff;
  font-size: 20px;
}
.nav-center {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 70px;
}
.nav-left {
  border-radius: 15px;
  border: 1px solid #ddd;
  font-size: 15px;
  color: #666;
  transform: scale(0.9, 0.9);
}

.songList {
  display: flex;
  flex-wrap: wrap;
}
.songList span {
  width: 240px;
  height: 300px;
  cursor: pointer;
}
.songList span:nth-child(5n) {
  margin-right: 0;
}
.songList span img {
  width: 220px;
  height: 220px;
  border-radius: 15px;
}
.songList span div {
  font-size: 15px;
  width: 210px;
  height: 60px;
  margin-top: 10px;
}
.footer {
  width: 100%;
  height: 80px;
}
</style>