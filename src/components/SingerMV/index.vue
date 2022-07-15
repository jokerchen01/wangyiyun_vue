<template>
  <div class="SingerMV">
    <span class="mv" v-for="mv in MvList" :key="mv.id" @click="goVideoDetail">
      <div class="mv-img">
        <img :src="mv.imgurl + '?param=680y400'" alt="" />
        <div class="number">{{ mv.playCount | handleNum }}</div>
        <div class="time">{{ mv.duration | handleMusicTime }}</div>
      </div>
      <div class="mv-description">
        {{ mv.name }}
      </div>
    </span>
    <!-- 分页器 -->
    <!--  @size-change="handleSizeChange"
       -->
    <div class="footer">
      <el-pagination
        style="text-align: center"
        :current-page="currentPage"
        :page-size="60"
        layout="prev, pager, next"
        :total="singerInfo.mvSize"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { handleNum, handleMusicTime } from "@/plugins/utils";
export default {
  name: "SingerMV",
  props: ["MvList", "singerInfo"],
  data() {
    return {
      currentPage: 1,
    };
  },
  methods: {
    handleCurrentChange(page) {
      this.currentPage = page;
      this.$emit("getSingerMvList", this.currentPage);
    },
    goVideoDetail() {
      this.$router.push({ name: "videodetail" });
    },
  },
  filters: {
    handleNum,
    handleMusicTime,
  },
};
</script>

<style lang="less" scoped>
.SingerMV {
  display: flex;
  flex-wrap: wrap;
  margin: 20px auto;
  width: 1320px;

  span {
    margin: 0 30px 10px 0;
    height: 240px;
    width: 290px;
    cursor: pointer;
    .mv-img {
      position: relative;
      .number {
        position: absolute;
        top: 2px;
        right: 10px;
        font-size: 13px;
        color: #fff;
      }
      .time {
        position: absolute;
        bottom: 10px;
        right: 10px;
        font-size: 14px;
        color: #fff;
      }
    }
    img {
      border-radius: 15px;
      width: 100%;
      height: 180px;
    }
    .mv-description {
      padding-top: 10px;
    }
  }
  .footer {
    width: 100%;
    height: 50px;
  }
}
</style>