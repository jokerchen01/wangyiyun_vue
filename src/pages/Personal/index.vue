<template>
  <div class="personal">
    <div class="header">
      <img :src="personalInfo.avatarUrl" alt="" />
      <div class="right">
        <div class="name">
          <div class="user">{{ personalInfo.nickname }}</div>
          <div class="logout" @click="logout" v-if="isCurrentUser == true">
            退出登录
          </div>
        </div>
        <div class="level">{{ "Lv" + level }}</div>
        <div class="info">
          <div class="dongtai">
            <span class="num1">{{ personalInfo.eventCount }}</span>
            <span class="text">动态</span>
          </div>
          <div class="guanzhu">
            <span class="num2">{{ personalInfo.newFollows }}</span>
            <span class="text">关注</span>
          </div>
          <div class="fensi">
            <span class="num3">{{ personalInfo.followeds }}</span>
            <span class="text">粉丝</span>
          </div>
        </div>
        <div class="person">
          <span>用户id：{{ personalInfo.userId }}</span>
          <span
            >所在地区：
            {{ personalInfo.province + " " + personalInfo.city }}</span
          >
          <span
            >个人介绍：
            {{
              personalInfo.signature == "" ? "暂无介绍" : personalInfo.signature
            }}</span
          >
        </div>
      </div>
    </div>
    <div class="center">
      <div class="center-content">
        <div>
          <h3>
            {{ personalInfo.nickname }}创建的歌单({{ createdMusicList.length }})
          </h3>
          <div class="createList">
            <span
              v-for="cml in createdMusicList"
              :key="cml.id"
              @click="goListDetails(cml.id)"
            >
              <img :src="cml.coverImgUrl" alt="" />
              <div class="description">{{ cml.name }}</div>
            </span>
          </div>
        </div>
      </div>
      <div class="center-content">
        <div>
          <h3>
            {{ personalInfo.nickname }}收藏的歌单({{
              collectedMusicList.length
            }})
          </h3>
          <div class="createList">
            <span
              v-for="oml in collectedMusicList"
              :key="oml.id"
              @click="goListDetails(oml.id)"
            >
              <img :src="oml.coverImgUrl" alt="" />
              <div class="description">{{ oml.name }}</div>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      personalInfo: {},
      level: "",
      // 创建的歌单
      createdMusicList: [],
      // 收藏的歌单
      collectedMusicList: [],
      // 该用户是否为当前用户
      isCurrentUser: false,
      personalId: "",
    };
  },
  async created() {
    await this.getPersonalInfo();
    this.getUserMusicList();
  },
  mounted() {},
  methods: {
    //请求个人信息
    async getPersonalInfo() {
      if (this.$route.params.uid) {
        //如果有先存在本地
        localStorage.setItem("personalId", this.$route.params.uid);
        let ret = await this.$API.reqPersonalInfo(this.$route.params.uid);
        this.level = ret.level;
        this.personalInfo = ret.profile;
        this.isUserPage();
      } else {
        this.personalId = localStorage.getItem("personalId");
        let ret = await this.$API.reqPersonalInfo(this.personalId);

        this.level = ret.level;
        this.personalInfo = ret.profile;
        this.isUserPage();
      }
    },
    //请求个人创建歌单
    async getUserMusicList() {
      let timestamp = Date.parse(new Date());
      // 先从localStorage里面读取用户信息  如果登录成功是有存的
      this.personalId = localStorage.getItem("personalId");
      let ret = await this.$API.reqUserMusicList({
        uid: this.personalId,
        timestamp,
      });
      ret = ret.playlist;

      let index = ret.findIndex((item) => item.subscribed == true);
      ret[0].name = `${this.personalInfo.nickname}喜欢的音乐`;
      this.createdMusicList = ret.slice(0, index);
      this.collectedMusicList = ret.slice(index);
    },
    async logout() {
      let ret = await this.$API.reqLogout();
      // console.log(res);
      console.log(ret);
      if (ret.code != 200) {
        this.$message("退出登录失败, 请稍后重试!");
        return;
      }

      window.localStorage.removeItem("userId");

      this.$message.success("退出成功!");
      this.isCurrentUser = false;
    },
    //判断是否是去到本人页面
    isUserPage() {
      if (
        localStorage.getItem("personalId") == localStorage.getItem("userId")
      ) {
        this.isCurrentUser = true;
      } else {
        this.isCurrentUser = false;
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

<style lang="less" scoped>
.personal {
  height: 800px;
  width: 1500px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(204, 204, 204);
  }

  .header {
    padding: 40px 0 0 20px;
    display: flex;
    height: 200px;

    img {
      width: 170px;
      height: 170px;
      border-radius: 50%;
    }
    .right {
      width: 80%;
      padding-left: 20px;
      .name {
        display: flex;
        justify-content: space-between;
        height: 30px;

        .user {
          font-weight: 600;
          font-size: 25px;
        }
        .logout {
          width: 100px;
          line-height: 25px;
          text-align: center;
          border: 1px solid #666;
          border-radius: 15px;
          cursor: pointer;
        }
      }
      .level {
        width: 1280px;
        font-size: 12px;
        border-bottom: 1px solid #ccc;
        margin-top: 10px;
        height: 20px;
      }
      .info {
        display: flex;
        margin-top: 10px;
        width: 100%;
        height: 50px;

        .dongtai {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 60px;
          font-size: 20px;
          .num1 {
            padding-left: 5px;
          }
        }
        .guanzhu {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          width: 80px;
          font-size: 20px;
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          text-align: center;
          .num2 {
            padding-right: 2px;
          }
        }
        .fensi {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          font-size: 20px;
          width: 80px;
          text-align: center;
        }
        .text {
          font-size: 12px;
          color: #666;
        }
      }
      .person {
        margin-top: 10px;
        display: flex;
        font-size: 12px;
        color: #666;
        flex-direction: column;
        justify-content: space-around;
        height: 50px;
      }
    }
  }
  .center {
    .center-content {
      width: 1400px;

      margin: 60px auto;

      .createList {
        display: flex;
        flex-wrap: wrap;
        span {
          margin-right: 20px;
          width: 250px;
          height: 320px;
          cursor: pointer;
          .description {
            padding-top: 10px;
          }
          img {
            width: 250px;
            height: 250px;
            border-radius: 15px;
          }
        }
      }
    }
  }
}
</style>