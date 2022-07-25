<template>
  <div class="comment">
    <!-- 发表评论 -->
    <div class="myComment">
      <el-input
        type="textarea"
        class="commentArea"
        maxlength="140"
        show-word-limit
        v-model="commentInput"
        placeholder="留下你的评论"
        resize="none"
        rows="5"
        cols="50"
      ></el-input>
      <el-button size="mini" round class="commit">评论</el-button>
    </div>
    <!-- 精彩评论 -->
    <div class="Wonderful-comment" v-show="currentPage == 1">
      <div class="title">精彩评论</div>
      <div class="contentBody" v-for="(hot, index) in hotComments" :key="index">
        <div class="content1" v-if="hotComments.length != 0">
          <div class="head-portrait">
            <img
              :src="hot.user.avatarUrl + '?param=100y100'"
              alt=""
              style="width: 50px; height: 50px"
              @click="goPersonal(hot.user.userId)"
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
        <hr />
      </div>
    </div>
    <!-- 热门评论 -->
    <div class="hot-comment">
      <div class="title">热门评论</div>
      <div
        class="contentBody"
        v-for="(comment, index) in commentList"
        :key="index"
      >
        <div class="content1">
          <div class="head-portrait">
            <img
              :src="comment.user.avatarUrl + '?param=100y100'"
              alt=""
              style="width: 50px; height: 50px"
              @click="goPersonal(comment.user.userId)"
            />
          </div>
          <div class="description">
            <div class="description-top">
              {{ comment.user.nickname }}:{{ comment.content }}
            </div>
            <div class="description-bottom">
              <div class="time">{{ comment.timeStr }}</div>
              <div class="function">
                <i class="good">{{ comment.likedCount }}</i>
                <i class="share"></i>
                <i class="say"></i>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
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
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  data() {
    return {
      //收集评论
      commentInput: "",
      //当前页码
      currentPage: 1,
      //评论列表
      commentList: [],
      //精彩评论
      hotComments: [],
      //总数量
      total: 1,
    };
  },
  methods: {
    async getComment() {
      let ret = await this.$API.reqCommentList({
        id: this.$route.params.id,
        offset: (this.currentPage - 1) * 50,
        limit: 50,
      });
      console.log(ret);
      this.commentList = ret.comments;
      this.hotComments = ret.hotComments;
      this.total = ret.total;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.getComment();
    },
    //去个人页面
    goPersonal(id) {
      this.$router.push({
        name: "personal",
        params: {
          uid: id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.comment {
  padding-left: 30px;
  .myComment {
    margin: 20px auto;
    width: 1400px;
    height: 160px;

    .commit {
      margin: 10px 0 0 1340px;
    }
  }
  .Wonderful-comment,
  .hot-comment {
    width: 1400px;
    margin: 20px auto;

    .title {
      width: 100px;
      font-weight: 700;
      font-size: 18px;
    }
    .contentBody {
      margin-top: 20px;
      .content1 {
        display: flex;
        height: 100px;

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
          width: 1300px;
          .description-top {
            height: 60px;
            color: #666;
            line-height: 25px;
            font-size: 15px;
          }
          .description-bottom {
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
</style>

  

