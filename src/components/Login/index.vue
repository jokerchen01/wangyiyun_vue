<template>
  <div class="Login">
    <el-form
      ref="form"
      v-model="loginForm"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="手机号码：" label-width="120px" required>
        <input type="text" v-model="loginForm.phoneNum" class="loginInput" />
      </el-form-item>
      <el-form-item label="密码：" label-width="120px" required>
        <input
          type="password"
          v-model="loginForm.password"
          class="loginInput"
        />
      </el-form-item>
      <div class="loginButton">
        <el-button type="danger" size="small" @click="getLogin">登录</el-button>
      </div>
      <div class="regEnter">注册</div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        phoneNum: "",
        password: "",
      },
    };
  },
  methods: {
    async getLogin() {
      let timestamp = Date.parse(new Date());
      let ret = await this.$API.reqLogin({
        phone: this.loginForm.phoneNum,
        password: this.loginForm.password,
        withCredentials: true,
        timestamp,
      });
      console.log(ret);
      if (ret.code == 200) {
        window.localStorage.setItem("userId", ret.profile.userId);

        this.$emit("getUserInfo", ret.profile);

        this.$message.success("登录成功!");
      } else if (ret.code == 400) {
        // 手机号错误
        this.$message.error("手机号错误!");
        return;
      } else if (ret.code == 502) {
        // 密码错误
        this.$message.error("密码错误!");
        return;
      } else {
        // 登录失败，请稍后重试
        this.$message.error("登录失败，请稍后重试!");
        return;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.regEnter {
  width: 100%;
  text-align: center;
  cursor: pointer;
  margin: 15px auto 0;
}

.regEnter:hover {
  text-decoration: underline;
}

.loginInput {
  height: 30px;
  border-radius: 7px;
  outline: none;
  border: 1px solid #999;
  padding-left: 5px;
  width: 175px;
}

.el-form {
  padding-top: 10px;
}

.loginButton {
  width: 100%;
  text-align: center;
}

.loginButton .el-button {
  width: 200px;
  background-color: rgb(231, 66, 67);
}
</style>
