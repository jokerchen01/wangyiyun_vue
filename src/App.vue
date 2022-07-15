<template>
  <div>
    <Header></Header>
    <el-container>
      <el-aside width="200px">
        <ul class="Music-List">
          <li @click="goFindMusic" :class="{ active: flag == 1 }">发现音乐</li>
          <li @click="goVideo" :class="{ active: flag == 2 }">视频</li>
          <li @click="goCollection" :class="{ active: flag == 3 }">收藏</li>
          <li @click="goRecommend" :class="{ active: flag == 4 }">每日推荐</li>
        </ul>
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
    };
  },
  components: { Header, Footer },

  methods: {
    goFindMusic() {
      this.flag = 1;
      this.$router.push("/findmusic/personality");
    },
    goVideo() {
      if (localStorage.getItem("userId")) {
        this.flag = 2;
        this.$router.push("/video");
      } else {
        this.$message({ type: "error", message: "请登录后再操作！" });
      }
    },
    goCollection() {
      if (localStorage.getItem("userId")) {
        this.flag = 3;
        this.$router.push("/collection");
      } else {
        this.$message({ type: "error", message: "请登录后再操作！" });
      }
    },
    goRecommend() {
      if (localStorage.getItem("userId")) {
        this.flag = 4;
        this.$router.push("/recommend");
      } else {
        this.$message({ type: "error", message: "请登录后再操作！" });
      }
    },
  },
};
</script>

<style scoped>
.el-aside {
  color: #333;
  height: 12000px;
  border-right: 1px solid #ccc;
  cursor: pointer;
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
