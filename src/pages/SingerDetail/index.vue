<template>
  <div class="SingerDetail">
    <div class="center">
      <div class="personal">
        <div class="personal-img">
          <img :src="singerInfo.cover + '?param=400y400'" alt="" />
        </div>
        <div class="personal-right">
          <div class="name1">{{ singerInfo.name }}</div>
          <div class="name2">
            <div class="collect">收藏</div>
            <div class="personal-page">个人主页</div>
          </div>
          <div class="name3">
            <span>单曲数:{{ singerInfo.musicSize }}</span>
            <span>单曲数:{{ singerInfo.albumSize }}</span>
            <span>单曲数:{{ singerInfo.mvSize }}</span>
          </div>
        </div>
      </div>
      <!-- 导航区 -->
      <el-tabs v-model="activeName" @tab-click="clickTab">
        <el-tab-pane label="专辑" name="first">
          <Album
            :hotSongs="hotSongs"
            :hotAlbums="hotAlbums"
            :albums="albums"
            @checkAllHotSong="checkAllHotSong"
          ></Album>
        </el-tab-pane>
        <el-tab-pane label="MV" name="second">
          <SingerMV
            :MvList="MvList"
            :singerInfo="singerInfo"
            @getSingerMvList="getSingerMvList"
          ></SingerMV>
        </el-tab-pane>
        <el-tab-pane label="歌手详情" name="third">
          <div class="singerDesc">
            {{ singerInfo.briefDesc }}
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <goTop scrollObj=".SingerDetail"></goTop>
  </div>
</template>

<script>
import Album from "@/components/Album";
import SingerMV from "@/components/SingerMV";
import goTop from "@/components/goTop";
export default {
  name: "SingerDetail",
  components: {
    Album,
    SingerMV,
    goTop,
  },
  data() {
    return {
      //默认选中专辑
      activeName: "first",
      singerInfo: {},

      hotSongs: [],
      isCheckAll: false,
      //专辑页码
      albumPage: 1,
      //专辑列表
      hotAlbums: [],
      //专辑详情
      albums: [],
      //mv
      MvList: [],
      videoPage: 1,
      start: 0,
      end: 60,
    };
  },
  created() {
    this.getSingerInfo();
    this.getSingerHotSong();
    this.getSingerAlbum();
  },
  methods: {
    //获取歌手信息
    async getSingerInfo() {
      let ret = await this.$API.reqSingerInfo({
        id: this.$route.params.id,
      });

      this.singerInfo = ret.data.artist;
    },
    //获取歌手hotSong
    async getSingerHotSong() {
      let ret = await this.$API.reqSingerHotSong({
        id: this.$route.params.id,
      });
      if (this.isCheckAll) {
        this.hotSongs = ret.songs;
      } else {
        this.hotSongs = ret.songs.slice(0, 10);
      }
    },
    //hotSong点击全部查看
    checkAllHotSong() {
      this.isCheckAll = true;
      this.getSingerHotSong();
    },
    //获取歌手专辑信息
    async getSingerAlbum() {
      let ret = await this.$API.reqSingerAlbum({
        id: this.$route.params.id,
        limit: 20,
        offset: (this.albumPage - 1) * 20,
      });
      this.hotAlbums = ret.hotAlbums;

      await ret.hotAlbums.forEach((item) => {
        this.getAlbumDetail(item.id);
      });
    },
    //获取专辑详细信息
    async getAlbumDetail(id) {
      let ret = await this.$API.reqAlbumDetail({ id });

      this.albums.push(ret);
    },
    //获取歌手mv
    async getSingerMv() {
      let ret = await this.$API.reqSingerMv({
        id: this.$route.params.id,
        limit: this.total,
      });

      this.start = 60 * (this.videoPage - 1);
      this.end = 60 * this.videoPage;
      this.MvList = ret.mvs.slice(this.start, this.end);
    },
    getSingerMvList(page) {
      this.videoPage = page;
      this.getSingerMv();
    },
    // 点击el-tab-pane的回调
    clickTab(e) {
      if (e.index == 1 && this.MvList.length == 0) {
        this.getSingerMv();
      }
    },
  },
  computed: {
    total() {
      return this.singerInfo.mvSize || "";
    },
  },
};
</script>

<style lang="less" scoped>
.SingerDetail {
  padding: 20px;
  width: 1500px;
  height: 800px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(204, 204, 204);
  }
  .center {
    margin: 20px auto;
    .personal {
      display: flex;
      height: 200px;

      .personal-img {
        img {
          border-radius: 15px;
          width: 180px;
          height: 180px;
        }
      }
      .personal-right {
        padding: 15px 0 0 15px;
        width: 500px;

        .name1 {
          height: 30px;
          font-size: 22px;
          font-weight: 700;
        }
        .name2 {
          display: flex;
          font-size: 14px;
          width: 200px;
          height: 40px;
          margin: 20px 0;
          color: #666;
          .collect {
            height: 80%;
            line-height: 32px;
            width: 80px;
            text-align: center;
            border-radius: 20px;
            border: 1px solid #ddd;

            &::before {
              margin-right: 2px;
              font-family: "iconfont";
              content: "\e61f";
            }
          }
          .personal-page {
            margin-left: 10px;
            height: 80%;
            line-height: 32px;
            width: 100px;
            text-align: center;
            border-radius: 20px;
            border: 1px solid #ddd;

            &::before {
              margin-right: 2px;
              font-family: "iconfont";
              content: "\e61f";
            }
          }
        }
        .name3 {
          width: 300px;
          display: flex;

          span {
            flex: 1;
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }
}
.singerDesc {
  padding-top: 15px;
  font-size: 15px;
  color: #373737;
  line-height: 30px;
  letter-spacing: 0.5px;
  text-indent: 2em;
}
/deep/ .el-tabs__nav-wrap::after {
  height: 0;
}
/deep/ .el-tabs__item.is-active {
  color: black !important;
  font-weight: 600;
}
/deep/ .el-tabs__active-bar {
  background-color: red;
}
/deep/ .el-tabs__item:hover {
  color: black;
}
</style>
