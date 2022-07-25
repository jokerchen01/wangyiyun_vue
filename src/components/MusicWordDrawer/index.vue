<template>
  <div class="MusicWordDrawer">
    <div class="drawer-content" v-if="isShow">
      <div class="word">
        <div class="le-img">
          <img
            src="@/assets/img/MusicDetailCard/needle.png"
            alt=""
            class="img1"
            :class="[isPlay ? 'needleRotate' : '']"
          />
          <img
            :src="currentUrl"
            alt=""
            class="img3"
            :class="[songInfo ? 'discAnimation' : '', isPlay ? '' : 'pause']"
            v-if="currentUrl"
          />
          <img src="@/assets/img/test.jpg" alt="" class="img3" v-else />
          <img
            src="@/assets/img/MusicDetailCard/disc.png"
            alt=""
            class="img2"
          />
        </div>
        <div class="rl-word" v-if="isShow">
          <div class="title">{{ currentSong.name }}</div>
          <div class="detail">{{ currentSong.al.name }}</div>
          <div class="singer">{{ currentSong.ar[0].name }}</div>
          <div class="lyrics">
            <div
              v-for="(item, index) in lyric"
              :key="index"
              class="lyricsItem"
              :class="lyricsIndex - 1 == index ? 'currentLyric' : ''"
            >
              {{ item[1] }}
            </div>
          </div>
        </div>
      </div>

      <div class="comment">
        <!-- 热门评论 -->
        <div class="Wonderful-comment">
          <div class="title">热门评论</div>
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
                  {{ hot.user.nickname }}:{{ hot.content }}
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

        <!-- 最新评论  -->
        <div class="hot-comment">
          <div class="title">最新评论</div>
          <div class="contentBody">
            <div class="content1" v-for="com in comments" :key="com.commentId">
              <div class="head-portrait">
                <img
                  :src="com.user.avatarUrl"
                  style="width: 50px; height: 50px"
                />
              </div>
              <div class="description">
                <div class="description-top">
                  {{ com.user.nickname }}:{{ com.content }}
                </div>
                <div class="description-bottom">
                  <div class="time">{{ com.timeStr }}</div>
                  <div class="function">
                    <i class="good">{{ com.likedCount }}</i>
                    <i class="share"></i>
                    <i class="say"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 分页器 -->
        <!--  @size-change="handleSizeChange     "
       -->
        <div class="footer">
          <el-pagination
            style="text-align: center"
            :current-page="currentCommentPage"
            :page-size="20"
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="drawer-content2" v-else>暂无播放歌曲</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
let placeholderHeight = 0;
export default {
  name: "MusicWordDrawer",
  props: ["songInfo", "currentUrl", "isPlay", "currentIndex", "currentTime"],
  data() {
    return {
      hotComments: [],
      comments: [],
      currentCommentPage: 1,
      total: 1,
      currentSong: {},
      //当前播放歌曲是否传到了
      isShow: false,
      //   歌词
      lyric: [[0, "正在加载歌词"]],
      // 当前歌词索引
      lyricsIndex: 0,
    };
  },
  created() {
    if (this.currentSong != {}) {
      this.getMusicComment();
      this.getLyric();
    }
  },
  computed: {
    ...mapState("songInfo", ["musicList"]),
  },
  methods: {
    //获取评论
    async getMusicComment() {
      let timestamp = Date.parse(new Date());
      let id = this.songInfo.id;
      let ret = await this.$API.reqHotComment({
        id,
        limit: 10,
        type: 0,
        timestamp,
      });
      if (ret.code != 200 && this.isShow != false) {
        this.$message.error("获取热门评论失败,请稍后重试!");
        return;
      }
      this.hotComments = ret.hotComments;
      //获取最新评论

      let res = await this.$API.reqMusicComment({
        id,
        offset: (this.currentCommentPage - 1) * 20,
        timestamp,
      });
      if (res.code !== 200 && this.isShow != false) {
        this.$message.error("获取评论失败,请稍后重试!");
      }
      this.comments = res.comments;
      this.total = res.total;
    },
    handleCurrentChange(page) {
      this.currentCommentPage = page;
      this.getMusicComment();
    },
    //获取歌词
    async getLyric() {
      let id = this.songInfo.id;
      let ret = await this.$API.reqLyric({ id });
      let lyrics = ret.lrc.lyric;
      //换行符分割
      let arr = lyrics.split("\n");
      //array用于去除空行
      let array = [];
      // let obj = {};
      let time = "";
      let value = "";
      let result = [];
      //去除空行
      arr.forEach((item) => {
        if (item != "") {
          array.push(item);
        }
      });
      arr = array;
      arr.forEach((item) => {
        time = item.split("]")[0];

        value = item.split("]")[1];

        //去掉时间里的中括号得到xx:xx.xx
        var t = time.slice(1).split(":");

        //将结果压入最终数组
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
      });
      this.lyric = result;

      this.currentSong = this.musicList[this.currentIndex];
      this.isShow = true;
    },
    lyricScroll(currentLyric) {
      // 获取歌词item
      let lyricsArr = document.querySelectorAll(".lyricsItem");
      // 获取歌词框
      let lyrics = document.querySelector(".lyrics");
      // placeholder的高度
      if (placeholderHeight == 0) {
        placeholderHeight = lyricsArr[0].offsetTop - lyrics.offsetTop;
      }
      //   歌词item在歌词框的高度 = 歌词框的offsetTop - 歌词item的offsetTop
      //   console.log(currentLyric);
      if (lyricsArr[currentLyric - 1]) {
        let distance = lyricsArr[currentLyric - 4].offsetTop - lyrics.offsetTop;
        //   lyricsArr[currentLyric].scrollIntoView();
        lyrics.scrollTo({
          behavior: "smooth",
          top: distance - placeholderHeight,
        });
      }
    },
    //获取当前歌词索引
    getCurrentLyricsIndex(currentTime) {
      let lyricsIndex = 0;
      this.lyric.some((item) => {
        if (lyricsIndex < this.lyric.length - 1) {
          if (currentTime > item[0]) {
            lyricsIndex += 1;
          }
          return currentTime <= item[0];
        }
      });
      // console.log(lyricsIndex);
      this.lyricsIndex = lyricsIndex;
    },
  },
  watch: {
    songInfo() {
      this.isShow = true;
      this.getMusicComment();
      this.getLyric();
      this.lyricsIndex = 0;
    },

    currentTime(currentTime, lastTime) {
      if (
        (lastTime && Math.abs(currentTime - lastTime) >= 1) ||
        (this.lyricsIndex == 0 && this.lyric.length > 1)
      ) {
        // 处理播放时间跳转时歌词位置的校准
        if (this.lyric.length > 1) {
          this.getCurrentLyricsIndex(currentTime);
          // 滑动到当前歌词
          this.lyricScroll(this.lyricsIndex);
        }
      }
      // 根据实时播放时间实现歌词滚动
      if (this.lyricsIndex < this.lyric.length) {
        if (currentTime >= this.lyric[this.lyricsIndex][0]) {
          this.lyricsIndex += 1;
          this.lyricScroll(this.lyricsIndex);
        }
      }
    },
    lyric(current) {
      console.log("获取了歌词");
      // 大于一秒，说明歌词在1秒后才请求成功 歌词可能不能马上跳转到当前时间 这里进行校准
      if (this.currentTime > 1) {
        // 处理播放时间跳转时歌词位置的校准
        if (this.lyric.length > 1) {
          this.getCurrentLyricsIndex(this.currentTime);
          this.$nextTick(() => {
            // 滑动到当前歌词
            this.lyricScroll(this.lyricsIndex);
          });
        }
      }
    },
    isShow() {
      this.getMusicComment();
      this.getLyric();
    },
  },
};
</script>

<style lang="less" scoped>
.MusicWordDrawer {
  height: calc(94vh - 15px);

  width: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(204, 204, 204);
  }

  background-image: linear-gradient(to bottom, #e3e2e3, white);
  .drawer-content {
    width: 1000px;
    display: flex;
    flex-direction: column;

    margin: 0 auto;

    .word {
      display: flex;
      width: 100%;
      height: 500px;

      .le-img {
        position: relative;
        flex: 1;

        .img1 {
          position: absolute;
          left: 48%;
          top: 15%;
          width: 110px;
          height: 85px;
          transition: all 1s;
          transform-origin: 5.3px 5.3px;
        }
        .img2 {
          margin: 150px 0 0 100px;
          width: 55%;
          height: 55%;
        }

        .img3 {
          position: absolute;
          left: 28.8%;
          top: 38.8%;
          width: 37.4%;
          height: 37.4%;
          border-radius: 50%;
        }
        /* 碟子设置旋转动画 */
        .discAnimation {
          /* infinite动画无限循环 */
          animation: disc 25s linear infinite;
          /* 动画延迟一秒 */
          animation-delay: 0.8s;
        }
        .pause {
          animation-play-state: paused;
          -webkit-animation-play-state: paused;
        }
        .needleRotate {
          transform-origin: 5.3px 5.3px;
          transform: rotate(24deg);
        }
        @keyframes disc {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }
      .rl-word {
        flex: 1;
        overflow: hidden;
        .title {
          width: 60%;
          margin-top: 40px;
          text-align: center;
          font-size: 25px;
        }
        .detail {
          width: 60%;
          margin-top: 10px;
          text-align: center;
          color: #666;
        }
        .singer {
          width: 60%;
          margin-top: 10px;
          text-align: center;
          color: #666;
        }
        .lyrics {
          margin: 10px 0 0 0;
          width: 300px;
          height: 345px;
          overflow-y: scroll;
          text-align: center;
          &::-webkit-scrollbar {
            display: none;
          }
          .currentLyric {
            font-weight: 600;
            font-size: 18px;
            color: black;
          }
          .lyricsItem {
            /* height: 20px; */
            margin: 35px 20px;
            transition: all 0.5s;
            line-height: 20px;
          }
          div {
            margin: 30px;
          }
        }
      }
    }
    .comment {
      margin-top: 20px;
      width: 100%;

      .Wonderful-comment,
      .hot-comment {
        width: 100%;
        margin: 0 auto;

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
  }
  .drawer-content2 {
    font-size: 30px;
    color: #666;
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
  }
}
</style>