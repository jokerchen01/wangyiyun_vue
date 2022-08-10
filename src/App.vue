<template>
  <div>
    <Header class="header"></Header>
    <el-container>
      <el-aside width="200px">
        <ul class="Music-List">
          <li @click="goFindMusic" :class="{ active: flag == 1 }">发现音乐</li>
          <li @click="goVideo" :class="{ active: flag == 2 }">视频</li>
          <li @click="goCollection" :class="{ active: flag == 3 }">收藏</li>
          <li @click="goRecommend" :class="{ active: flag == 4 }">每日推荐</li>
        </ul>
        <el-menu active-text-color="black">
          <el-menu-item-group v-if="createdMusicList.length != 0">
            <template slot="title" class="groupTitle">创建的歌单</template>
            <el-menu-item
              v-for="(item, index) in createdMusicList"
              :key="index"
              @click="goSongDetail(item.id)"
            >
              {{ item.name }}</el-menu-item
            >
          </el-menu-item-group>

          <el-menu-item-group v-if="collectedMusicList.length != 0">
            <template slot="title" class="groupTitle">收藏的歌单</template>
            <el-menu-item
              v-for="(item, index) in collectedMusicList"
              :key="index"
              @click="goSongDetail(item.id, index)"
              :class="{ active: index == cIndex }"
            >
              {{ item.name }}</el-menu-item
            >
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";

export default {
  name: "App",
  data() {
    return {
      flag: 1,
      createdMusicList: [],
      collectedMusicList: [],
      //收藏歌单的索引
      cIndex: -1,
    };
  },

  components: { Header, Footer },
  created() {
    if (window.localStorage.getItem("userId")) {
      this.getUserSongList();
    }
    this.$bus.$on("loginSuccess", this.loginSuccess);
    this.$bus.$on("clearUserSongList", this.clearUserSongList);
  },
  methods: {
    goFindMusic() {
      this.flag = 1;
      this.cIndex = -1;

      this.$router.push("/findmusic/personality");
    },
    goVideo() {
      if (localStorage.getItem("userId")) {
        this.flag = 2;
        this.cIndex = -1;

        this.$router.push("/video");
      } else {
        this.$message({ type: "error", message: "请登录后再操作！" });
      }
    },
    goCollection() {
      if (localStorage.getItem("userId")) {
        this.flag = 3;
        this.cIndex = -1;

        this.$router.push("/collection");
      } else {
        this.$message({ type: "error", message: "请登录后再操作！" });
      }
    },
    goRecommend() {
      if (localStorage.getItem("userId")) {
        this.flag = 4;
        this.cIndex = -1;

        this.$router.push("/recommend");
      } else {
        this.$message({ type: "error", message: "请登录后再操作！" });
      }
    },
    //获取登录用户的歌单
    async getUserSongList() {
      if (window.localStorage.getItem("userId")) {
        let timestamp = Date.parse(new Date());
        let ret = await this.$API.reqUserSongList({
          uid: window.localStorage.getItem("userId"),
          timestamp,
        });

        ret = ret.playlist;
        let index = ret.findIndex((item) => item.subscribed == true);
        this.createdMusicList = ret.slice(0, index);
        this.createdMusicList[0].name = "我喜欢的音乐";
        this.collectedMusicList = ret.slice(index);
      } else {
        this.createdMusicList = [];
        this.collectedMusicList = [];
      }
    },
    goSongDetail(id, index) {
      this.$router.push({
        name: "musiclistdetails",
        params: {
          id: id,
        },
      });
      this.flag = -1;
      this.cIndex = index;
    },
    //退出登录重新解析模板
    clearUserSongList(type) {
      if (type == 1) {
        this.getUserSongList();
        console.log("退出成功");
      }
    },
    loginSuccess(type) {
      if (type == 1) {
        this.getUserSongList();
        console.log("登陆成功");
      }
    },
  },
};
</script>

<style lang="less" scoped >
.el-aside {
  color: #333;
  height: calc(100vh - 95px);
  border-right: 1px solid #ccc;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(204, 204, 204);
  }
  .Music-List {
    cursor: pointer;
  }
  .el-menu {
    border: none;
    .el-menu-item-group {
      margin-top: 10px;

      .el-menu-item {
        font-size: 16px;
        padding: 0 20px 0 10px !important;
        margin: 15px 0 !important;
        height: 30px;
        line-height: 30px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        &:hover {
          background-color: #f5f5f6 !important;
        }
        &::before {
          padding-right: 10px;
          content: "\e98e";
          font-family: "iconfont";
        }
      }
    }
  }
}

.Music-List {
  padding-left: 20px;
  font-size: 14px;
}
.Music-List li {
  height: 40px;
}
.Music-List li:nth-child(1)::before {
  padding-right: 10px;
  content: "\e98e";
  font-family: "iconfont";
}
.Music-List li:nth-child(2)::before {
  padding-right: 10px;
  content: "\e618";
  font-family: "iconfont";
}
.Music-List li:nth-child(3)::before {
  padding-right: 10px;
  content: "\e65e";
  font-family: "iconfont";
}
.Music-List li:nth-child(4)::before {
  padding-right: 10px;
  content: "\e62a";
  font-family: "iconfont";
}

.main {
  padding: 0;
}

.active {
  font-size: 16px;
  font-weight: 600;
}
</style>
<style>
