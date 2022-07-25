<template>
  <div class="videoDetail">
    <div class="v-content">
      <div class="v-left">
        <h3>{{ $route.params.type == "mv" ? "MV详情" : "视频详情" }}</h3>
        <div class="v-video">
          <!--   @play="playVideo" -->
          <video
            class="videoPlayer"
            :src="videoUrl"
            controls
            width="620px"
            height="350px"
            :poster="
              $route.params.type == 'mv' ? videoInfo.cover : videoInfo.coverUrl
            "
          ></video>
        </div>
        <div class="v-artist">
          <img
            :src="
              $route.params.type == 'mv'
                ? artists.img1v1Url
                : videoInfo.avatarUrl
            "
            alt=""
          />
          <span>{{
            $route.params.type == "mv" ? artists.name : creator.nickname
          }}</span>
        </div>
        <span class="v-name">
          {{
            $route.params.type == "mv" ? videoInfo.name : videoInfo.title
          }}</span
        >
        <div class="v-count">
          <span
            >发布：{{
              $route.params.type == "mv"
                ? videoInfo.publishTime
                : videoInfo.publishTime | handletime
            }}</span
          >
          <span
            >播放：{{
              ($route.params.type == "mv"
                ? videoInfo.playCount
                : videoInfo.playTime) | handleNum
            }}</span
          >
        </div>
        <div class="v-funtion">
          <div class="good">赞</div>
          <div class="collection">收藏</div>
          <div class="share">分享</div>
        </div>
        <h3>评论</h3>
        <div class="v-comment">
          <el-input
            type="textarea"
            class="commentArea"
            maxlength="140"
            show-word-limit
            v-model="commentInput"
            placeholder="留下你的评论"
            resize="none"
            rows="4"
            cols="50"
          ></el-input>
          <el-button size="mini" round class="commit">评论</el-button>
        </div>
        <!-- 精彩评论 -->
        <div class="Wonderful-comment">
          <div class="title">精彩评论</div>
          <div class="contentBody">
            <div
              class="content1"
              v-for="hot in hotComments"
              :key="hot.commentId"
            >
              <div class="head-portrait">
                <img
                  :src="hot.user.avatarUrl"
                  style="width: 50px; height: 50px"
                />
              </div>
              <div class="description">
                <div class="description-top">
                  {{ hot.user.nickname }} : {{ hot.content }}
                </div>
                <div class="description-bottom">
                  <div class="time">{{ hot.timeStr }}</div>
                  <div class="function">
                    <i class="good">{{ hot.likedCount }}</i>
                    <i class="share"></i>
                    <i class="say"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 热门评论 -->
        <div class="hot-comment">
          <div class="title">精彩评论</div>
          <div class="contentBody">
            <div class="content1" v-for="c in comments" :key="c.commentId">
              <div class="head-portrait">
                <img
                  :src="c.user.avatarUrl"
                  style="width: 50px; height: 50px"
                />
              </div>
              <div class="description">
                <div class="description-top">
                  {{ c.user.nickname }} : {{ c.content }}
                </div>
                <div class="description-bottom">
                  <div class="time">{{ c.timeStr }}</div>
                  <div class="function">
                    <i class="good">{{ c.likedCount }}</i>
                    <i class="share"></i>
                    <i class="say"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <!--  @size-change="handleSizeChange    
       -->
        <div class="footer">
          <el-pagination
            style="text-align: center"
            :current-page="1"
            :page-size="20"
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
      <div class="v-right">
        <h3>相关推荐</h3>
        <div
          class="recommend"
          v-for="r in relatedVideo"
          :key="r.vid"
          @click="goToRelatedVideo(r.vid)"
        >
          <img :src="r.coverUrl" alt="" />
          <div class="r-description">
            <div class="r-content">{{ r.title }}</div>
            <div class="r-writer">by{{ r.creator[0].userName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { handleNum, handleMusicTime, formatDate } from "plugins/utils.js";
import dayjs from "dayjs";
export default {
  name: "",
  data() {
    return {
      commentInput: "",
      videoInfo: {},
      videoUrl: "",
      // 相关视频数据
      relatedVideo: [],
      comments: [],
      hotComments: [],
      // 评论页数
      commentsPage: 1,
      total: 1,
      artists: {},
      creator: {},
    };
  },
  async created() {
    this.getRelatedVideo();
    if (this.$route.params.type == "mv") {
      await this.getMvDetail();
      this.getMvUrl();
      this.getMvComment();
    } else if (this.$route.params.type == "video") {
      await this.getVideoDetail();
      this.getVideoUrl();
      this.getVideoComment();
    }
  },
  mounted() {},
  methods: {
    //获取mv详情
    async getMvDetail() {
      let ret = await this.$API.reqMvDetail({
        mvid: this.$route.params.id,
      });
      this.videoInfo = ret.data;
      this.artists = ret.data.artists[0];
    },
    // 请求mv地址
    async getMvUrl() {
      let ret = await this.$API.reqMvUrl({ id: this.$route.params.id });
      this.videoUrl = ret.data.url;
    },
    //获取评论
    async getMvComment() {
      let timestamp = Date.parse(new Date());
      let ret = await this.$API.reqMvComment({
        id: this.$route.params.id,
        offset: 20 * (this.commentsPage - 1),
        timestamp,
      });
      this.comments = ret.comments;
      this.hotComments = ret.hotComments;
      this.total = ret.total;
    },
    handleCurrentChange(page) {
      this.commentsPage = page;
      if (this.$route.params.type == "mv") {
        this.getMvComment();
      } else {
        this.getVideoComment();
      }
    },
    //获取相关视频
    async getRelatedVideo() {
      let ret = await this.$API.reqRelatedVideo({
        id: this.$route.params.id,
      });
      this.relatedVideo = ret.data;
    },

    // 请求视频详情
    async getVideoDetail() {
      let ret = await this.$API.reqVideoDetail({
        id: this.$route.params.id,
      });
      this.videoInfo = ret.data;
      this.creator = ret.data.creator;
    },
    // 请求video的url
    async getVideoUrl() {
      let ret = await this.$API.reqVideoUrl({
        id: this.$route.params.id,
      });
      this.videoUrl = ret.urls[0].url;
    },
    //获取video评论
    async getVideoComment() {
      let timestamp = Date.parse(new Date());
      let ret = await this.$API.reqVideoComment({
        id: this.$route.params.id,
        offset: 20 * (this.commentsPage - 1),
        timestamp,
      });
      this.comments = ret.comments;
      this.hotComments = ret.hotComments;
      this.total = ret.total;
    },
    //去相关视频页面video
    goToRelatedVideo(id) {
      this.$router.push({
        name: "videodetail",
        params: { id, type: "video" },
      });
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
    async $route() {
      await this.goToRelatedVideo(this.$route.params.id);
      this.getVideoDetail();
      this.getVideoUrl();
      this.getVideoComment();
      await this.getRelatedVideo();
    },
  },
};
</script>

<style lang="less" scoped>
.videoDetail {
  width: 100%;
  height: 790px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(204, 204, 204);
  }

  .v-content {
    display: flex;
    width: 1000px;
    height: 800px;
    margin: 0 auto;

    .v-left {
      width: 620px;
      height: 500px;

      .v-video {
        width: 100%;
        height: 340px;
      }
      .v-artist {
        display: flex;
        padding-top: 20px;
        width: 100%;
        height: 90px;

        img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        span {
          height: 35px;
          line-height: 40px;
          padding-left: 10px;
        }
      }
      .v-name {
        font-weight: 600;
        font-size: 24px;
      }
      .v-count {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 40%;
        font-size: 14px;
        color: #666;
        height: 40px;
      }
      .v-funtion {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 50%;
        height: 50px;

        .good {
          width: 80px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 15px;
          border: 1px solid #666;
          &::before {
            margin-right: 5px;
            content: "\e62a";
            font-family: "iconfont";
          }
        }
        .collection {
          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 15px;
          border: 1px solid #666;
          &::before {
            margin-right: 5px;
            content: "\e65e";
            font-family: "iconfont";
          }
        }
        .share {
          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-radius: 15px;
          border: 1px solid #666;
          &::before {
            margin-right: 5px;
            content: "\e60c";
            font-family: "iconfont";
          }
        }
      }
      .v-comment {
        width: 100%;
        height: 80px;
        background-color: pink;
        .commit {
          margin: 10px 0 0 550px;
        }
      }
      .Wonderful-comment,
      .hot-comment {
        width: 100%;
        margin: 80px auto;

        .title {
          width: 100px;
          font-weight: 700;
          font-size: 18px;
        }
        .contentBody {
          margin-top: 40px;
          .content1 {
            margin: 40px 0;
            padding-bottom: 20px;
            display: flex;
            font-size: 14px;
            border-bottom: 1px solid #ccc;
            .head-portrait {
              display: flex;
              width: 100px;
              justify-content: center;
              img {
                cursor: pointer;
                border-radius: 50%;
              }
            }
            .description {
              width: 100%;
              .description-top {
                width: 500px; //设置宽度
                overflow: hidden;
                color: #666;
                line-height: 25px;
                font-size: 15px;
              }
              .description-bottom {
                margin-top: 20px;
                display: flex;
                justify-content: space-between;
                .time {
                  font-size: 14px;
                  color: rgb(172, 172, 172);
                }
                .function {
                  .good::before {
                    content: "\e62a";
                    font-family: "iconfont";
                  }
                  .share::after {
                    margin: 0 20px;
                    content: "\e60c";
                    font-family: "iconfont";
                  }
                  .say::after {
                    content: "\e650";
                    font-family: "iconfont";
                  }
                }
              }
            }
          }
        }
      }
    }
    .v-right {
      height: 600px;
      width: 370px;

      padding-left: 30px;
      .recommend {
        margin-bottom: 10px;
        display: flex;
        height: 110px;

        img {
          width: 180px;
          border-radius: 15px;
          cursor: pointer;
        }
        .r-description {
          display: flex;
          flex-direction: column;
          .r-content {
            padding: 20px 0 0 10px;
            height: 60px;
            width: 160px; //设置宽度
            overflow: hidden;
            text-overflow: ellipsis; //文本超出省略
            display: -webkit-box;
            -webkit-line-clamp: 2; //第几行省略就设置第几行
            -webkit-box-orient: vertical;
          }
          .r-writer {
            padding-left: 10px;
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
}
</style>