<template>
  <div class="Footer">
    <audio
      :src="songInfo.url"
      autoplay="autoplay"
      preload="auto"
      ref="audioPlayer"
      @timeupdate="timeupdate"
      @ended="playComplete"
    ></audio>
    <div class="Footer-left">
      <img src="@/assets/img/test.jpg" alt="" />
      <div class="song">
        <span>歌名</span>
        <span>歌手</span>
      </div>
    </div>
    <div class="Footer-center">
      <span style="cursor: pointer">
        <i class="iconfont icon-24gl-shuffle"></i>
        <i class="iconfont icon-shangyishou" @click="preSong"></i>
        <i
          :class="['iconfont', isPlay ? 'icon-zanting' : 'icon-bofang']"
          @click="changeState"
        ></i>
        <i class="iconfont icon-xiayishou" @click="playComplete"></i>
        <i class="iconfont icon-aixin"></i>
      </span>
      <div class="progress">
        <div class="start-time">{{ currentTime | handleMusicTime }}</div>

        <div
          class="block block-big"
          @mousedown="isDraging = true"
          @mouseup="isDraging = false"
        >
          <el-slider
            v-model="timeProgress"
            :show-tooltip="false"
            @change="changeProgress"
          ></el-slider>
          <!--   
          :disabled="musicList.length == 0" -->
        </div>

        <div class="end-time">{{ totalTime | MusicTotalTime }}</div>
      </div>
    </div>
    <div class="Footer-right">
      <div class="block block-small">
        <i class="iconfont icon-laba" @click="changeMutedState"></i>
        <el-slider
          class="volumeSlider"
          v-model="volume"
          @input="changeVolume"
          :show-tooltip="false"
        ></el-slider>
        <i
          class="iconfont icon-24gl-playlistHeart"
          @click="musicListDrawer"
        ></i>
      </div>
      <span>粤ICP备2021068014号</span>
    </div>

    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      :size="400"
      class="drawer"
      :wrapperClosable="true"
      :append-to-body="true"
      z-index="2"
    >
      <div class="drawerHeader">总{{ musicList.length }}首</div>
      <el-table
        :data="musicList"
        stripe
        style="width: 100%; cursor: pointer"
        :show-header="false"
        highlight-current-row
        lazy
        @click="changeSong"
      >
        <el-table-column prop="name" width="200px">
          <template slot-scope="{ row, $index }">
            <div @dblclick="changeSong(row, $index)">{{ row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="ar[0].name" width="120px"> </el-table-column>
        <el-table-column prop="dt" width="80px"> </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { returnSecond, handleMusicTime, MusicTotalTime } from "@/plugins/utils";

export default {
  name: "Footer",
  data() {
    return {
      //歌曲总时间
      totalTime: "00:00",
      //播放状态
      isPlay: false,
      //抽屉状态
      drawer: false,
      // 当前播放时间位置
      currentTime: 0,
      // 进度条的位置
      timeProgress: 0,
      //总播放秒数
      durationNum: 0,
      //判断拉取进度条时鼠标按下和松开
      isDraging: null,
      // 当前播放音乐的索引
      currentIndex: -1,
      //是否静音
      isMuted: false,
      //当前音量
      volume: 30,
      //保存静音前的音量
      volumeSave: 0,
    };
  },
  mounted() {
    this.$bus.$on("getSongInfo", this.getSongInfo);
    this.$bus.$on("playAll", this.playAllSongs);
  },
  methods: {
    getUrl() {
      this.totalTime = this.musicList[this.currentIndex].dt;
      let id = this.musicList[this.currentIndex].id;
      this.$store.dispatch("songInfo/playSong", { id });
    },
    getSongInfo(row) {
      //判断单点播放还是全部播放
      console.log(row);
      if (Array.isArray(row)) {
        this.$store.commit("songInfo/PLAYALLSONG", row);
        //全部播放时重置index值
        this.currentIndex = 0;
        this.getUrl();
        this.isPlay = true;
      } else {
        //加入列表之前判断是否有重复歌曲
        let isRepeat = this.musicList.some((item) => {
          return item.id == row.id;
        });
        if (isRepeat) {
          //说明有重复
          //说明歌单有此歌曲 则拿到此歌曲index发请求

          this.currentIndex = this.musicList.findIndex((item) => {
            return item.id == row.id;
          });
          this.getUrl();
          this.isPlay = true;
        } else {
          this.musicList.unshift(row);
          this.currentIndex = 0;
          this.getUrl();
          this.isPlay = true;
        }
      }
    },
    changeState() {
      //暂停播放
      if (this.isPlay) {
        this.isPlay = !this.isPlay;
        this.$refs.audioPlayer.pause();
      } else {
        this.isPlay = !this.isPlay;
        this.$refs.audioPlayer.play();
      }
    },
    //全部播放列表抽屉
    musicListDrawer() {
      //抖动bug
      this.drawer = !this.drawer;
    },

    timeupdate() {
      if (!this.isDraging) {
        let time = this.$refs.audioPlayer.currentTime;

        time = Math.floor(time);

        this.durationNum = returnSecond(this.totalTime);

        this.currentTime = time;
        // 计算进度条的位置 百分比
        this.timeProgress = Math.floor((time / this.durationNum) * 100);
      }
    },
    //拉取滚动条
    changeProgress(e) {
      // console.log(e);

      this.currentTime = Math.floor((e / 100) * this.durationNum);
      // 改变audio的实际当前播放时间
      this.$refs.audioPlayer.currentTime = this.currentTime;
    },
    //自动播放下一首和点击下一首
    playComplete() {
      this.currentIndex = this.currentIndex + 1;
      //判断后面是否还有歌曲
      if (this.currentIndex <= this.musicList.length - 1) {
        this.$refs.audioPlayer.play();
        this.getUrl();
        this.isPlay = true;
      } else {
        this.currentIndex = this.musicList.length - 1;
      }
    },
    //在全部列表中切歌
    changeSong(row, index) {
      this.currentIndex = index;
      this.totalTime = this.musicList[this.currentIndex].dt;
      let id = this.musicList[this.currentIndex].id;
      this.$store.dispatch("songInfo/playSong", { id });
      this.isPlay = true;
    },
    //上一首
    preSong() {
      this.currentIndex = this.currentIndex - 1;
      //判断后面是否还有歌曲
      if (this.currentIndex >= 0) {
        this.$refs.audioPlayer.play();
        this.getUrl();
        this.isPlay = true;
      } else {
        this.currentIndex = 0;
      }
    },
    //点击喇叭是否静音
    changeMutedState() {
      if (this.isMuted) {
        this.volume = this.volumeSave;
      } else {
        this.volumeSave = this.volume;
        this.volume = 0;
      }
      this.isMuted = !this.isMuted;
    },
    //拖拽音量进度条
    changeVolume(e) {
      this.$refs.audioPlayer.volume = e / 100;
      if (this.isMuted && e > 0) {
        this.isMuted = false;
      } else if (e == 0 && this.isMuted == false) {
        this.isMuted = true;
      }
    },
  },
  filters: {
    handleMusicTime,
    returnSecond,
    MusicTotalTime,
  },
  computed: {
    ...mapState("songInfo", ["songInfo", "musicList"]),
  },
};
</script>

<style scoped>
.Footer {
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #ccc;
  width: 100%;
  height: 70px;
  z-index: 4;
}
.Footer-left {
  display: flex;
  align-items: center;
  width: 160px;
}
.Footer-left::after {
  content: "\e668";
  font-family: "iconfont";
}

.Footer-left img {
  padding-left: 10px;
  width: 60px;
  height: 50px;
}
.song {
  width: 80px;
  height: 40px;
}
.song span {
  padding-left: 10px;
  display: block;
  width: 100%;
  font-size: 15px;
}
.song span:nth-child(2) {
  padding-top: 5px;
}
.Footer-center {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 460px;
  height: 100%;
}
.Footer-center span {
  display: flex;
  justify-content: space-between;
  width: 270px;
  height: 40px;
}
.Footer-center span i {
  padding-top: 10px;
  font-size: 24px;
}
.Footer-center span i:nth-child(3) {
  padding-top: 5px;
  font-size: 30px;
}
.Footer-center .progress {
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;
  height: 20px;
}
.Footer-center .start-time {
  width: 50px;
  height: 100%;
  font-size: 13px;
  color: rgb(188, 170, 170);
  padding-left: 10px;
  margin-top: -5px;
}
.block-big {
  position: absolute;
  left: 60px;
  top: -12px;
  width: 340px;
  height: 100%;
  margin-top: -5px;
}
.Footer-center .end-time {
  width: 50px;
  height: 100%;
  font-size: 13px;
  color: rgb(188, 170, 170);
  padding-right: 10px;
  margin-top: -5px;
}
.Footer-right {
  position: relative;
  height: 100%;
  width: 200px;
}
.Footer-right span {
  font-size: 12px;
  color: rgb(134, 132, 132);
  margin-left: 30px;
}
.icon-laba {
  position: absolute;
  top: 8px;
  left: 10px;
  cursor: pointer;
  font-size: 24px;
}
.block-small {
  width: 100px;
  height: 40px;
  margin: 0 auto;
}
.icon-24gl-playlistHeart {
  position: absolute;
  top: 10px;
  left: 160px;
  cursor: pointer;
}
.v-modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>