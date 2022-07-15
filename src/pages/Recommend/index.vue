<template>
  <div class="Recommend">
    <div class="header">
      <div class="day-recommend">
        <img src="@/assets/img/recommendMusic.png" alt="" />
        <div class="description">
          <div class="div1">每日歌曲推荐</div>
          <div class="div2">根据你的音乐口味生成，每天6:00更新</div>
        </div>
      </div>
      <div class="play">
        <div class="play-all" @click="playAllSongs">播放全部</div>
        <div class="collection">收藏全部</div>
      </div>
    </div>
    <div class="container">
      <el-table
        :data="recommendMusic"
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
        <el-table-column type="index" :index="handleIndex" width="80">
        </el-table-column>
        <el-table-column width="80">
          <i class="iconfont" style="font-size: 14px; font-weight: 700"
            >&#xe668;</i
          >
        </el-table-column>
        <el-table-column prop="name" label="音乐标题" width="520">
          <template slot-scope="{ row }">
            <div @dblclick="playMusic(row)" style="color: #808080">
              {{ row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ar[0].name" label="歌手" width="250">
        </el-table-column>
        <el-table-column
          prop="al.name"
          label="专辑"
          width="300"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="dt" label="时长" width="200" class="time">
          <template slot-scope="{ row }">
            <div>
              {{ row.dt | MusicTotalTime }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 50px"></div>
    </div>
  </div>
</template>

<script>
import { MusicTotalTime } from "@/plugins/utils";
export default {
  name: "",
  data() {
    return {
      // 每日推荐歌曲列表
      recommendMusic: [],
    };
  },
  mounted() {
    this.getRecommendMusic();
  },
  methods: {
    //获取每日推荐歌曲

    async getRecommendMusic() {
      let ret = await this.$API.reqRecommendMusic();
      this.recommendMusic = ret.data.dailySongs;
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
    playMusic(row) {
      this.$bus.$emit("getSongInfo", row);
    },
    //播放全部歌曲
    playAllSongs() {
      //防止传过去的数据互相影响
      let row = this.recommendMusic.map((item) => {
        return item;
      });
      this.$bus.$emit("getSongInfo", row);
    },
  },
  filters: {
    MusicTotalTime,
  },
};
</script>

<style lang="less" scoped>
.Recommend {
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(204, 204, 204);
  }
  .header {
    height: 200px;

    .day-recommend {
      padding: 30px 0 0 50px;
      display: flex;
      height: 100px;

      img {
        width: 100px;
        height: 100px;
      }
      .description {
        padding: 20px 0 0 20px;
        .div1 {
          font-size: 20px;
          font-weight: 700;
        }
        .div2 {
          margin-top: 5px;
          font-size: 14px;
          color: #666;
        }
      }
    }
    .play {
      padding: 40px 0 0 50px;
      display: flex;
      height: 100px;

      .play-all {
        width: 100px;
        height: 35px;
        border-radius: 20px;
        background-color: #ec4141;
        color: #fff;
        line-height: 35px;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
        &::before {
          content: "\e602";
          font-family: "iconfont";
        }
      }
      .collection {
        width: 100px;
        height: 35px;
        margin-left: 10px;
        border-radius: 20px;
        line-height: 35px;
        text-align: center;
        font-size: 14px;
        color: #666;
        border: 1px solid #ddd;
        cursor: pointer;
        &::before {
          margin-right: 2px;
          content: "\e61f";
          font-family: "iconfont";
        }
      }
    }
  }
  .container {
    height: 600px;
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
  }
}
</style>