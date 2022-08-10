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
          <div class="search">
            <i class="el-icon-search"></i>
            <el-popover
              placement="bottom"
              width="350"
              v-model="isSearchPopShow"
              trigger="click"
              popper-class="my-popover"
            >
              <input
                type="text"
                placeholder="请输入内容"
                class="hot"
                slot="reference"
                @input="inputSearch"
                v-model="searchInput"
              />
              <!-- 热搜榜 -->
              <div class="hotSearch" v-if="!searchSuggestList.songs">
                <div class="hotSearchTitle">热搜榜</div>
                <div
                  class="hotSearchItem"
                  v-for="(item, index) in hotSearchList"
                  :key="index"
                  @click="clickHotSearchItem(item.searchWord)"
                >
                  <div
                    class="hotSearchIndex"
                    :class="index < 3 ? 'topThree' : ''"
                  >
                    {{ index + 1 }}
                  </div>
                  <div class="hotSearchInfo">
                    <div
                      class="hotSearchWord"
                      :class="index < 3 ? 'hotSearchWordTopThree' : ''"
                    >
                      {{ item.searchWord }}
                    </div>
                    <div class="hotSearchContent">{{ item.content }}</div>
                  </div>
                </div>
              </div>
              <!-- 搜索推荐 -->
              <div class="searchSuggest">
                <div class="hotSearchTitle" v-if="searchSuggestList.songs">
                  搜索建议
                </div>
                <!-- 单曲 -->
                <div
                  class="searchSuggestItem"
                  v-if="
                    searchSuggestList.songs &&
                    searchSuggestList.songs.length != 0
                  "
                >
                  <div class="searchSuggestItemTitle">
                    <i class="iconfont icon-music"></i> 单曲
                  </div>
                  <div
                    class="suggestItemDetail"
                    v-for="(item, index) in searchSuggestList.songs"
                    :key="index"
                    @dblclick="clickSuggestSong(item.id)"
                  >
                    <!--  @click="clickSuggestSong(item.id)" -->
                    {{ item.name + " - " + item.artists[0].name }}
                  </div>
                </div>
                <!-- 歌手 -->
                <div
                  class="searchSuggestItem"
                  v-if="
                    searchSuggestList.artists &&
                    searchSuggestList.artists.length != 0
                  "
                >
                  <div class="searchSuggestItemTitle">
                    <i class="iconfont icon-maikefeng-xianxing"></i>
                    歌手
                  </div>
                  <div
                    class="suggestItemDetail"
                    v-for="(item, index) in searchSuggestList.artists"
                    :key="index"
                    @click="clickSuggestSinger(item.id)"
                  >
                    {{ item.name }}
                  </div>
                </div>
                <!-- 专辑 -->
                <div
                  class="searchSuggestItem"
                  v-if="
                    searchSuggestList.albums &&
                    searchSuggestList.albums.length != 0
                  "
                >
                  <div class="searchSuggestItemTitle">
                    <i class="iconfont icon-zhuanji"></i>
                    专辑
                  </div>
                  <div
                    class="suggestItemDetail"
                    v-for="(item, index) in searchSuggestList.albums"
                    :key="index"
                    @click="clickSuggestAlbum(item.id)"
                  >
                    {{ item.name + " - " + item.artist.name }}
                  </div>
                </div>
                <!-- 歌单 -->
                <div
                  class="searchSuggestItem"
                  v-if="
                    searchSuggestList.playlists &&
                    searchSuggestList.playlists.length != 0
                  "
                >
                  <div class="searchSuggestItemTitle">
                    <i class="iconfont icon-gedan"></i> 歌单
                  </div>
                  <div
                    class="suggestItemDetail"
                    v-for="(item, index) in searchSuggestList.playlists"
                    :key="index"
                    @click="clickSuggestMusicList(item.id)"
                  >
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </el-popover>
          </div>
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
let timer;
export default {
  name: "Header",
  components: {
    Login,
  },
  data() {
    return {
      userInfo: {},
      isRegisteredShow: false,
      //是否展示热门关键词
      isSearchPopShow: false,
      //热门关键词
      hotSearchList: [],
      //输入搜索框的内容
      searchInput: "",
      //推荐搜索列表
      searchSuggestList: [],
      //搜索中点歌
      currentSong: {},
    };
  },
  created() {
    this.getHotSearch();
  },
  mounted() {
    this.getCurrentUserInfo();
    this.$bus.$on("reparseUserInfo", this.reparseUserInfo);
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
      if (localStorage.getItem("userId")) {
        let timestamp = Date.parse(new Date());
        let ret = await this.$API.reqUserInfo({
          timestamp,
        });

        if (ret.profile != null) {
          this.userInfo = ret.profile;
        }
      } else {
        this.userInfo = {};
      }
    },
    //退出后重新解析模板
    reparseUserInfo(type) {
      if (type == 1) {
        this.getCurrentUserInfo();
      }
    },
    //搜索默认热门
    async getHotSearch() {
      let res = await this.$API.reqHotSearch();

      this.hotSearchList = res.data;
    },
    //搜索建议
    async getSearchSuggest(keywords) {
      let res = await this.$API.reqSearchSuggest({ keywords });
      console.log(res);
      this.searchSuggestList = res.result;
    },
    //点击搜索input聚焦时候默认展示热门
    inputSearch(e) {
      // console.log(e);
      this.isSearchPopShow = true;
      clearTimeout(timer);
      if (e.target.value != "") {
        timer = setTimeout(() => {
          this.getSearchSuggest(e.target.value);
        }, 500);
      } else {
        // 清空searchSuggestList
        this.searchSuggestList = {};
        return;
      }
    },
    // 跳转至搜索详情页面
    goSearch() {
      this.isSearchPopShow = false;
      this.$router.push({ name: "search", params: { id: this.searchInput } });
    },
    //点击热门搜索item
    clickHotSearchItem(searchWord) {
      this.searchInput = searchWord;
      this.goSearch();
    },
    // 点击搜索建议中专辑的回调
    clickSuggestAlbum(id) {
      this.$router.push({ name: "album", params: { id } });
      this.isSearchPopShow = false;
    },
    // 点击搜索建议中歌手的回调
    clickSuggestSinger(id) {
      this.$router.push({ name: "singerdetail", params: { id } });
      this.isSearchPopShow = false;
    },
    // 点击搜索建议中歌单的回调
    clickSuggestMusicList(id) {
      this.$router.push({ name: "musiclistdetails", params: { id } });
      this.isSearchPopShow = false;
    },

    // 点击搜索建议中单曲的回调
    async clickSuggestSong(ids) {
      let res = await this.$API.reqSearchMusicInfo({ ids });

      let row = res.songs[0];

      this.$bus.$emit("getSongInfo", row);
      this.isSearchPopShow = false;
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
  watch: {},
};
</script>

<style lang="less" scoped>
/* 头部 */

.header {
  width: 100vw;
  display: flex;

  background-color: rgb(231, 66, 67);
  height: 62px;
  align-items: center;
}
.header-logo {
  left: 20px;
  width: 15%;
  height: 30px;
}

.header-logo img {
  width: 160px;
}
.header-center {
  width: 70%;
  height: 30px;
  .el-row /deep/.el-col-8 {
    width: 100px;
    margin-top: 4px;
  }
}
.el-icon-arrow-left {
  cursor: pointer;
}
.el-icon-arrow-right {
  cursor: pointer;
}
.header-login {
  height: 40px;
  display: flex;
}

.hot {
  border: 0;
  border-radius: 20px;
  margin-top: 10px;
  color: #fff;
  font-size: 14px;
  background-color: rgb(220, 63, 64);
}
.hot::placeholder {
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

  cursor: pointer;
}
.login {
  margin-left: 10px;
  margin-top: 10px;
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

.hotSearch {
  height: 480px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
.hotSearchTitle {
  font-size: 16px;
  margin: 10px 0 5px 10px;
}

.hotSearchItem {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
}

.hotSearchItem:hover {
  background-color: #f2f2f2;
}

.hotSearchIndex {
  width: 7%;
  margin-right: 20px;
  color: #aaa;
}

.topThree {
  color: #e13e3e;
}

.hotSearchWord {
  font-size: 15px;
  color: rgb(51, 51, 51);
}

.hotSearchWordTopThree {
  font-weight: 600;
  color: black;
}

.hotSearchContent {
  font-size: 12px;
  transform: scale(0.9) translateX(-5%);
}
.searchSuggest {
  font-size: 15px;
}

.searchSuggestItemTitle {
  background-color: #f5f5f7;
  padding: 4px 8px;
}

.searchSuggestItemTitle i {
  font-size: 15px;
}

.searchSuggestItem {
  cursor: pointer;
}

.suggestItemDetail {
  padding: 4px 27px;
  font-size: 15px;
}

.suggestItemDetail:hover {
  background-color: #f2f2f2;
}
</style>

<style>
.el-popover.my-popover {
  padding: 0 !important;
}
</style>