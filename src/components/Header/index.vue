<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="header-logo">
        <img src="../../assets/img/logo.png" alt="" />
      </div>
      <div class="header-center">
        <el-row>
          <el-col :span="8"
            ><div class="grid-content bg-purple">
              <div class="bgc-icon-left">
                <i class="el-icon-arrow-left" @click="back"></i>
              </div>
              <div class="bgc-icon-right">
                <i class="el-icon-arrow-right" @click="forWard"></i>
              </div></div
          ></el-col>
          <el-col :span="16" :push="0.5">
            <div class="search-box">
              <i class="el-icon-search"></i>
              <input type="text" placeholder="请输入内容" class="search" />
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="header-login">
        <el-popover
          placement="bottom"
          width="330"
          trigger="click"
          v-if="!userInfo.avatarUrl"
        >
          <Login
            @getUserInfo="
              (info) => {
                userInfo = info;
                isPopoverShow = false;
              }
            "
          ></Login>
          <img
            src="../../assets/img/test.jpg"
            slot="reference"
            alt=""
            class="user"
          />
        </el-popover>
        <img
          :src="userInfo.avatarUrl"
          alt=""
          slot="reference"
          v-else
          @click="goPersonal"
        />
        <span class="login" v-if="userInfo.nickname">
          {{ userInfo.nickname }}</span
        >
        <span class="login" v-else>点击头像登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "@/components/Login";
export default {
  name: "Header",
  components: {
    Login,
  },
  data() {
    return {
      userInfo: {},
      isRegisteredShow: false,
    };
  },
  mounted() {
    this.getCurrentUserInfo();
  },
  methods: {
    back() {
      this.$router.back();
    },
    forWard() {
      this.$router.forward();
    },
    //获取当前用户信息
    async getCurrentUserInfo() {
      let timestamp = Date.parse(new Date());
      let ret = await this.$API.reqUserInfo({
        timestamp,
      });
      if (ret.profile != null) {
        this.userInfo = ret.profile;
      }
    },
    //去个人页面
    goPersonal() {
      this.$router.push({
        name: "personal",
        params: {
          uid: this.userInfo.userId,
        },
      });
    },
  },
  watch: {
    $route() {
      if (this.$route.name === "personal") {
        this.goPersonal();
      }
    },
  },
};
</script>

<style scoped>
/* 头部 */
.header {
  position: relative;
  display: flex;
  justify-content: space-between;
  background-color: rgb(231, 66, 67);
  height: 62px;
  align-items: center;
}
.header-logo {
  position: absolute;
  left: 20px;
  width: 130px;
  height: 30px;
}

.header-logo img {
  width: 100%;
}
.header-center {
  position: absolute;
  left: 220px;
  width: 300px;
  height: 30px;
}
.el-icon-arrow-left {
  cursor: pointer;
}
.el-icon-arrow-right {
  cursor: pointer;
}
.header-login {
  position: absolute;
  right: 25px;
  width: 230px;
  height: 40px;
}

.search {
  border: 0;
  border-radius: 20px;
  margin-top: 8px;
  color: #fff;
  font-size: 14px;
  background-color: rgb(220, 63, 64);
}
.search::placeholder {
  color: #fff;
}
.el-icon-search {
  color: #fff;
  font-size: 14px;
}

.header-login img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}
img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}
.login {
  position: absolute;
  top: 10px;
  left: 50px;
  color: #fff;
}

/* 左侧导航 */
</style>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  position: relative;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.bgc-icon-left {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(41, 40, 40, 0.05);
  color: #fff;
}
.bgc-icon-right {
  position: absolute;
  top: 0;
  right: 30px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(41, 40, 40, 0.05);
  color: #fff;
}
.el-icon-arrow-left {
  font-weight: 700;
  padding-left: 6px;
  padding-top: 6px;
}
.el-icon-arrow-right {
  padding-left: 6px;
  padding-top: 6px;
  font-weight: 700;
}
</style>