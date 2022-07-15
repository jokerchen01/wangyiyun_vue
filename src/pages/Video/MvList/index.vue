<template>
  <div>
    <div class="v-header">
      <div class="selectors">
        <div class="selectorItem1">
          <div class="languages">地区：</div>
          <div class="RightBox">
            <RightBox
              :hotLabel="areaList"
              @clickRightBox="clickAreaList"
            ></RightBox>
          </div>
        </div>
        <div class="selectorItem2">
          <div class="Classification">类型：</div>
          <div class="RightBox">
            <RightBox
              :hotLabel="typeList"
              @clickRightBox="clickTypeList"
            ></RightBox>
          </div>
        </div>
        <div class="selectorItem3">
          <div class="Filter">排序：</div>
          <div class="RightBox">
            <RightBox
              :hotLabel="orderList"
              @clickRightBox="clickOrderList"
            ></RightBox>
          </div>
        </div>
      </div>
    </div>
    <div class="v-content">
      <div class="v-list">
        <span v-for="mv in MvList" :key="mv.id" @click="goMvDetail(mv.id)">
          <div class="mv-img">
            <img :src="mv.cover + '?param=680y400'" alt="" />
            <div class="number">{{ mv.playCount | handleNum }}</div>
          </div>
          <div class="descrition">
            <div>{{ mv.briefDesc }}</div>
            <div class="mv-artist">{{ mv.artistName }}</div>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { handleNum } from "@/plugins/utils";
import RightBox from "@/components/RightBox";
import LeftBox from "@/components/LeftBox";
export default {
  name: "",
  components: { RightBox, LeftBox },
  async created() {
    await this.getMvList();
  },
  data() {
    return {
      // mv 地区
      areaList: [
        { name: "全部", path: "" },
        { name: "内地", path: "内地" },
        { name: "港台", path: "港台" },
        { name: "欧美", path: "欧美" },
        { name: "日本", path: "日本" },
        { name: "韩国", path: "韩国" },
      ],
      // mv 类型
      typeList: [
        { name: "全部", path: "" },
        { name: "官方版", path: "官方版" },
        { name: "原生", path: "原生" },
        { name: "现场版", path: "现场版" },
        { name: "网易出品", path: "网易出品" },
      ],
      // 排序
      orderList: [
        { name: "上升最快", path: "" },
        { name: "最热", path: "最热" },
        { name: "最新", path: "最新" },
      ],
      // 当前地区
      area: "",
      // 当前类型
      type: "",
      // 当前排序
      order: "",
      // 当前视频页数
      mvPage: 1,
      MvList: [],
    };
  },
  methods: {
    async getMvList() {
      let ret = await this.$API.reqMvList({
        area: this.area,
        type: this.type,
        order: this.order,
        offset: 30 * (this.mvPage - 1),
      });
      this.MvList = ret.data;
    },
    clickAreaList(index) {
      this.area = this.areaList[index].path;
      this.MvList = [];
      this.mvPage = 1;
      this.getMvList();
    },
    clickTypeList(index) {
      this.type = this.typeList[index].path;
      this.MvList = [];
      this.mvPage = 1;
      this.getMvList();
    },
    clickOrderList(index) {
      this.order = this.orderList[index].path;
      this.MvList = [];
      this.mvPage = 1;
      this.getMvList();
    },
    goMvDetail(id) {
      this.$router.push({
        name: "videodetail",
        params: { id, type: "mv" },
      });
    },
  },
  filters: {
    handleNum,
  },
};
</script>

<style lang="less" scoped>
.v-header {
  display: flex;
  width: 100%;
  height: 150px;

  .selectors {
    margin: 25px 0 0 40px;
    display: flex;
    flex-direction: column;
    height: 160px;
    //background-color: pink;
    .selectorItem1 {
      flex: 1;
      .languages {
        color: #666;
      }
      .RightBox {
        margin: -22px 0 0 40px;
      }
    }
    .selectorItem2 {
      flex: 1;
      .RightBox {
        margin: -22px 0 0 40px;
      }
    }
    .selectorItem3 {
      flex: 2;
      .RightBox {
        margin: -22px 0 0 40px;
        width: 1200px;
        height: 80px;
        display: flex;
      }
    }
  }
}
.v-content {
  width: 100%;
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
    display: flex;
    flex-wrap: wrap;
    margin: 10px auto;
    .descrition {
      height: 50px;
    }
    .mv-artist {
      font-size: 14px;
      color: #666;
    }
    span {
      width: 280px;
      height: 250px;
      margin: 0 15px;
      .mv-img {
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
 