<template>
  <div class="max">
    <div class="detail">
      <div class="detail-header">
        <div class="detail-img">
          <img :src="playlist.coverImgUrl" alt="" />
        </div>
        <div class="right">
          <div class="title">
            <div class="title-logo">歌单</div>
            <div class="title-font">{{ playlist.name }}</div>
          </div>
          <div class="writer">
            <img :src="playlist.coverImgUrl" alt="" />
            <div class="name">{{ creator.nickname }}</div>
            <div class="time">{{ playlist.createTime | handletime }}创建</div>
          </div>
          <div class="play">
            <div class="play-all" @click="playAllSongs">播放全部</div>
            <div class="collection">收藏</div>
            <div class="share">分享</div>
          </div>
          <div class="songInfo">
            <div class="label">
              <div class="label-0">标签：</div>
              <div class="label-1">流行</div>
              <div class="label-2">地铁</div>
              <div class="label-2">思念</div>
            </div>
            <div class="playnum">
              <div class="songnum">歌曲：{{ playlist.trackCount }}</div>
              <div class="play">播放：{{ playlist.playCount | handleNum }}</div>
            </div>
            <div class="description">
              <div class="description">
                <span> {{ playlist.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-list">
        <div
          class="songlist"
          @click="goSongList"
          :class="{ active: flag == 1 }"
        >
          歌曲列表
        </div>
        <div class="comment" @click="goComment" :class="{ active: flag == 2 }">
          评论
        </div>
        <div
          class="collection"
          @click="goCollection"
          :class="{ active: flag == 3 }"
        >
          收藏者
        </div>
      </div>
      <div
        class="container"
        v-infinite-scroll="load"
        :infinite-scroll-disabled="disabled"
        :infinite-scroll-immediate="false"
        :infinite-scroll-distance="300"
      >
        <el-table
          :data="playlist.tracks"
          v-show="flag == 1"
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
          <el-table-column
            prop="ar[0].name"
            label="歌手"
            width=""
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="al.name"
            label="专辑"
            width=""
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="dt" label="时长" width="" class="time">
          </el-table-column>
        </el-table>
        <div style="height: 50px" v-show="flag == 1"></div>

        <Comment class="comment" v-show="flag == 2" ref="Comment"></Comment>
        <Collection
          class="collectioner"
          v-show="flag == 3"
          :subscribers="subscribers"
        ></Collection>
      </div>
    </div>
  </div>
</template>

<script>
import { handleNum, handleMusicTime } from "@/plugins/utils";
import dayjs from "dayjs";
import Comment from "@/components/Comment";
import Collection from "@/components/Collection";
import goTop from "@/components/goTop";
export default {
  name: "",
  components: {
    Comment,
    Collection,
    goTop,
  },
  data() {
    return {
      //歌单信息
      playlist: [],
      creator: {},
      flag: 1,
      songUrl: [],

      //以下是收藏者信息
      // 是否还有更多数据
      isMore: false,
      // 无限滚动是否可用
      disabled: true,
      subscribers: [],
      currentPage: 1,
    };
  },

  mounted() {
    this.getSongList();
  },
  methods: {
    //获取歌单歌曲
    async getSongList() {
      let result = await this.$API.reqListDetail({ id: this.$route.params.id });
      if (result.code == 200) {
        this.playlist = result.playlist;
        this.creator = this.playlist.creator;
      }

      this.playlist.tracks.forEach((item, index) => {
        this.playlist.tracks[index].dt = handleMusicTime(item.dt);
      });
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
    playMusic(row) {
      this.$bus.$emit("getSongInfo", row);
    },
    //播放全部歌曲
    playAllSongs() {
      //防止传过去的数据互相影响
      let row = this.playlist.tracks.map((item) => {
        return item;
      });
      this.$bus.$emit("getSongInfo", row);
    },

    goSongList() {
      this.flag = 1;
    },
    goComment() {
      this.$refs.Comment.getComment();
      this.flag = 2;
    },
    goCollection() {
      this.flag = 3;

      this.getCollectionList();
    },
    //获取收藏着列表
    async getCollectionList() {
      let ret = await this.$API.reqCollectionList({
        id: this.$route.params.id,
        offset: (this.currentPage - 1) * 50,
        limit: 50,
      });

      this.subscribers.push(...ret.subscribers);
      this.isMore = ret.more;
      console.log(ret);
    },
    // 卡片上拉触底触发
    load() {
      // console.log("bottomLoad");
      // 如果还有更多数据 则发送请求 将数据 push到数组
      if (this.isMore == true) {
        this.currentPage += 1;
        this.getCollectionList();
        this.disabled = true;
      } else {
        console.log(123);
      }
    },
  },
  filters: {
    handleNum,
    handleMusicTime,
    handletime(time) {
      return dayjs(time).format("YYYY-MM-DD");
    },
  },
  watch: {
    //   数据更新后，可再次运行触发load事件
    subscribers() {
      if (this.subscribers.length != 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.max {
  width: 88vw;

  .detail {
    height: calc(90vh - 20px);
    padding: 0;

    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: rgb(204, 204, 204);
    }
  }

  .detail-header {
    display: flex;
    width: 100%;
    margin-bottom: 20px;
    padding-left: 30px;
    .detail-img {
      text-align: right;
      padding-top: 30px;
      padding-right: 10px;
      width: 240px;
      height: 100%;
      img {
        width: 190px;
        height: 190px;
        border-radius: 15px;
      }
    }
    .right {
      width: 1500px;
      height: 100%;
      padding-left: 10px;
      padding-top: 30px;
      .title {
        display: flex;
        height: 40px;
        .title-logo {
          margin-top: 3px;
          width: 37px;
          height: 23px;
          font-size: 15px;
          color: #ec4141;
          border: 1px solid #ec4141;
          padding: 1px 2px;
          border-radius: 2px;
          transform: scale(0.8);
        }
        .title-font {
          padding-left: 5px;
          font-size: 24px;
          font-weight: 700;
          color: #373737;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .writer {
        display: flex;
        height: 40px;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .name {
          padding-left: 10px;
          line-height: 30px;
          color: #6191c2;
          font-size: 15px;
          cursor: pointer;
        }
        .time {
          margin-left: 10px;
          width: 150px;
          font-size: 13px;
          line-height: 30px;
          color: #666;
        }
      }
      .play {
        display: flex;
        height: 50px;
        .play-all {
          width: 110px;
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
          width: 80px;
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
        .share {
          width: 80px;
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
            margin-right: 3px;
            content: "\e622";
            font-family: "iconfont";
          }
        }
      }
      .songInfo {
        width: 1100px;
        padding-left: 10px;
        height: 60px;
        font-size: 13px;
        color: #666;
        .label {
          display: flex;
          .label-1 {
            color: #6191c2;
          }
          .label-2 {
            margin: 0 5px 0 5px;
            color: #6191c2;
          }
        }
        .playnum {
          height: 20px;
          margin-top: 8px;
          display: flex;
          .songnum {
            margin-right: 15px;
          }
        }
        .description {
          display: flex;
        }
      }
    }
  }
  .detail-list {
    display: flex;
    padding-left: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    .songlist {
      width: 80px;
      height: 100%;
    }
    .comment {
      margin: 0 20px;
      width: 70px;
      height: 100%;
    }
  }
  .container {
    width: calc(100% - 100px);

    &/deep/ .has-gutter tr th:nth-child(5) {
      padding-left: 30px !important;
    }
    &/deep/ .has-gutter tr th:nth-child(6) {
      padding-left: 30px !important;
    }

    &/deep/ .el-table__row td:nth-child(3) {
      color: rgb(36, 36, 36);
    }
    &/deep/ .el-table__row td:nth-child(5) {
      padding-left: 30px !important;
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
  .description {
    width: 1100px;
  }
  .description span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.active {
  font-size: 20px;
  font-weight: 600;
  color: black;
  border-bottom: 3px solid red;
}
</style>
<style scoped>
.footer {
  width: 200px;
  height: 50px;
}
</style>