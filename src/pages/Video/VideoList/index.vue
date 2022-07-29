<template>
  <div>
    <div class="v-header">
      <!-- 导航区 -->
      <div class="nav-center">
        <div class="nav-left" @click="getAllLabels">
          <LeftBox
            :allLabels="allLabels"
            :currentLabel="currentLabel"
            @clickLeftBox="clickLeftBox"
          ></LeftBox>
        </div>
        <div class="nav-right">
          <RightBox
            :hotLabel="hotLabel"
            :currentLabel="currentLabel"
            @clickRightBox="clickRightBox"
          ></RightBox>
        </div>
      </div>
    </div>
    <div class="v-content">
      <div class="v-list" v-loading="loading">
        <span
          v-for="(v, index) in videoList"
          :key="index"
          @click="goVideoDetail(v.data.vid)"
        >
          <div class="v-img">
            <img :src="v.data.coverUrl + '?param=680y400'" alt="" />
            <div class="number">{{ v.data.playTime | handleNum }}</div>
            <div class="time">{{ v.data.durationms | handleMusicTime }}</div>
          </div>
          <div class="descrition">{{ v.data.description }}</div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { handleNum, handleMusicTime } from "@/plugins/utils";
import RightBox from "@/components/RightBox";
import LeftBox from "@/components/LeftBox";
let i = 2;
export default {
  name: "",
  components: {
    RightBox,
    LeftBox,
  },
  data() {
    return {
      allLabels: [],
      currentLabel: {},
      hotLabel: [],
      videoList: [],
      videoPage: 1,
      loading: true,
    };
  },
  async created() {
    await this.getVideoLabel();
    this.getVideoList(this.currentLabel.id);
    i = 2;
  },

  methods: {
    //获取标签
    async getVideoLabel() {
      let ret = await this.$API.reqVideoLabel();
      this.hotLabel = ret.data;
      this.currentLabel = ret.data[0];
    },
    //获取视频list

    async getVideoList(id) {
      let ret = await this.$API.reqVideoList({
        id: id,
        offset: 8 * (this.videoPage - 1),
      });
      this.videoPage = this.videoPage + 1;
      ret.datas.forEach((item) => {
        this.videoList.push(item);
      });

      this.loading = false;
      i--;
      if (i >= 1) {
        this.getVideoList(id);
      }
    },
    //获取全部标签
    async getAllLabels() {
      let ret = await this.$API.reqAllLabel();
      this.allLabels = ret.data;
    },
    clickLeftBox(label) {
      this.currentLabel = label;
      this.loading = true;
      this.getVideoList(this.currentLabel.id);
      this.videoList = [];
      i = 2;
    },
    clickRightBox(index) {
      this.loading = true;
      this.currentLabel = this.hotLabel[index];
      this.getVideoList(this.currentLabel.id);
      this.videoList = [];
      i = 2;
    },
    goVideoDetail(id) {
      this.$router.push({
        name: "videodetail",
        params: { id, type: "video" },
      });
    },
  },
  filters: {
    handleNum,
    handleMusicTime,
  },
};
</script>

<style lang="less" scoped>
.v-header {
  display: flex;
  width: 88vw;
  height: 100px;

  .nav-center {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 88vw;
    height: 70px;
  }
  .nav-left {
    border-radius: 15px;
    margin-left: 25px;
    border: 1px solid #ddd;
    font-size: 15px;
    color: #666;
    transform: scale(0.9, 0.9);
  }
}

.v-content {
  width: 88vw;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(204, 204, 204);
  }
  .v-list {
    width: 1250px;
    height: 600px;
    margin: 10px auto;

    span {
      display: inline-block;
      width: 280px;
      height: 250px;
      margin: 0 15px;
      cursor: pointer;
      .descrition {
        width: 240px;
        height: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .v-img {
        position: relative;
        img {
          border-radius: 15px;
          width: 280px;
          height: 180px;
        }
        .number {
          position: absolute;
          top: 2px;
          right: 10px;
          font-size: 13px;
          color: #fff;
          &::before {
            content: "\ea72";
            font-size: 16px;
            font-family: "iconfont";
          }
        }
        .time {
          position: absolute;
          bottom: 10px;
          right: 10px;
          font-size: 14px;
          color: #fff;
        }
      }
    }
  }
}
</style>