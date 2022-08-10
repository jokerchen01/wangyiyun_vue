<template>
  <div class="search-Song">
    <div class="header">
      <h3>找到{{ songCount }}首歌曲</h3>
      <div>最佳匹配</div>
      <div
        class="header-singer"
        v-if="multiMatch.artist"
        @click="goToSingerDetail(multiMatch.artist[0].id)"
      >
        <div class="singer-img">
          <img
            :src="multiMatch.artist[0].img1v1Url + '?param==200y200'"
            alt=""
          />
        </div>
        <div class="singer-detail">歌手：{{ multiMatch.artist[0].name }}</div>
      </div>
    </div>
    <div class="container">
      <el-table
        :data="searchSongList"
        :row-style="{ height: '30px' }"
        :cell-style="{ padding: '0px' }"
        stripe
        highlight-current-row
        style="
          width: 100%;
          cursor: pointer;
          margin-top: 20px;
          padding-left: 40px;
          font-size: 13px;
        "
        size="mini"
      >
        <el-table-column type="index" :index="handleIndex" width="">
        </el-table-column>
        <el-table-column width="80%">
          <i class="iconfont" style="font-size: 14px; font-weight: 700"
            >&#xe668;</i
          >
        </el-table-column>
        <el-table-column prop="name" label="音乐标题" width="600%">
          <template slot-scope="{ row }">
            <div @dblclick="playMusic(row)" style="color: #808080">
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ar[0].name" label="歌手" width="">
        </el-table-column>
        <el-table-column
          prop="al.name"
          label="专辑"
          width=""
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="dt" label="时长" width="" class="time">
          <template slot-scope="{ row }">
            <div>
              {{ row.dt | MusicTotalTime }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-pagination
          layout="prev, pager, next"
          :total="songCount"
          :page-size="30"
          :current-page="currentPage"
          @current-change="pageChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { MusicTotalTime } from "@/plugins/utils";
export default {
  data() {
    return {
      multiMatch: {},
      searchSongList: [],
      songCount: 0,
      currentPage: 1,
    };
  },
  created() {
    this.getMultMath();
    this.getSearchSong();
  },
  methods: {
    // 获取最佳匹配
    async getMultMath() {
      let res = await this.$API.reqMultMath({
        keywords: this.$route.params.id,
      });
      this.multiMatch = res.result;
    },
    // 请求搜索单曲
    async getSearchSong() {
      let res = await this.$API.reqSearchSong({
        keywords: this.$route.params.id,
        offset: 30 * (this.currentPage - 1),
      });

      this.songCount = res.result.songCount;
      this.searchSongList = res.result.songs;
    },
    //双击播放歌曲
    playMusic(row) {
      this.$bus.$emit("getSongInfo", row);
    },
    // 点击翻页的回调
    pageChange(page) {
      this.currentPage = page;
      this.searchSongList = [];
      this.getSearchSong();
    },
    //点击歌手进入详情
    goToSingerDetail(id) {
      this.$router.push({ name: "singerdetail", params: { id } });
    },
    //歌曲序号
    handleIndex(index) {
      index += 1;
      if (index < 10) {
        return "0" + index;
      } else {
        return index;
      }
    },
    handleTime(time) {
      let time1 = parseInt(time);
      time1 = Math.floor(time1 / 1000);
      let m = Math.floor(time1 / 60);
      let s = Math.floor(time1 % 60);
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      time1 = m + ":" + s;
      return time1;
    },
  },
  filters: {
    MusicTotalTime,
  },
  watch: {
    $route() {
      this.getMultMath();
      this.getSearchSong();
      this.$bus.$emit("changeFlag", 1);
    },
  },
};
</script>

<style lang="less" scoped>
.search-Song {
  margin-top: 30px;
  .header-singer {
    display: flex;
    width: 330px;
    height: 80px;
    margin-top: 10px;
    border-radius: 5px;
    background-color: #f4f4f4;
    cursor: pointer;
    .singer-img {
      flex: 1;
      img {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        width: 100%;
        height: 100%;
      }
    }
    .singer-detail {
      flex: 3;
      margin-top: 30px;
      margin-left: 10px;
    }
  }
  .container {
    &/deep/ .has-gutter tr th:nth-child(6) {
      padding-left: 30px !important;
    }
    &/deep/ .el-table__row td:nth-child(3) {
      color: rgb(36, 36, 36);
    }
    &/deep/ .el-table__row td:nth-child(6) {
      padding-left: 30px !important;
    }
    &/deep/ .el-table__row td:nth-child(n + 4) {
      color: rgb(128, 128, 128);
    }
    .placeholder {
      height: 50px;
      width: 100%;
    }
    .footer {
      height: 50px;
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>