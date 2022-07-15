<template>
  <div
    class="max"
    v-infinite-scroll="load"
    :infinite-scroll-disabled="disabled"
    :infinite-scroll-immediate="false"
    :infinite-scroll-distance="300"
  >
    <div class="singerContainer">
      <div class="singer">
        <!-- 歌手分类选择 -->
        <div class="selectors">
          <div class="selectorItem1">
            <div class="languages">语种：</div>
            <div class="RightBox">
              <RightBox
                :hotLabel="languageSort"
                @clickRightBox="clickLanguageSort"
              ></RightBox>
            </div>
          </div>
          <div class="selectorItem2">
            <div class="Classification">分类：</div>
            <div class="RightBox">
              <RightBox
                :hotLabel="typeSort"
                @clickRightBox="clickTypeSort"
              ></RightBox>
            </div>
          </div>
          <div class="selectorItem3">
            <div class="Filter">筛选：</div>
            <div class="RightBox">
              <RightBox
                :hotLabel="initialSort"
                @clickRightBox="clickInitialSort"
              ></RightBox>
            </div>
          </div>
        </div>

        <!-- 歌手展示区 -->
        <div class="listCardContainer">
          <span
            v-for="(singer, index) in singerList"
            :key="index"
            @click="goSingerDetail(singer.id)"
          >
            <img
              v-lazy="(singer.picUrl || singer.coverImgUrl) + '?param=400y400'"
            />
            <div>{{ singer.name }}</div>
          </span>
        </div>
      </div>
      <goTop scrollObj=".max"></goTop>
    </div>
  </div>
</template>

<script>
import RightBox from "@/components/RightBox";
import goTop from "@/components/goTop";

export default {
  components: { RightBox, goTop },
  name: "Singer",
  data() {
    return {
      languageSort: [
        { area: -1, name: "全部" },
        { area: 7, name: "华语" },
        { area: 96, name: "欧美" },
        { area: 8, name: "日本" },
        { area: 16, name: "韩国" },
        { area: 0, name: "其它" },
      ],
      typeSort: [
        { type: -1, name: "全部" },
        { type: 1, name: "男歌手" },
        { type: 2, name: "女歌手" },
        { type: 3, name: "乐队" },
      ],
      initialSort: [
        { initial: -1, name: "热门" },
        { initial: "a", name: "A" },
        { initial: "b", name: "B" },
        { initial: "c", name: "C" },
        { initial: "d", name: "D" },
        { initial: "e", name: "E" },
        { initial: "f", name: "F" },
        { initial: "g", name: "G" },
        { initial: "h", name: "H" },
        { initial: "i", name: "I" },
        { initial: "j", name: "J" },
        { initial: "k", name: "K" },
        { initial: "l", name: "L" },
        { initial: "m", name: "M" },
        { initial: "n", name: "N" },
        { initial: "o", name: "O" },
        { initial: "p", name: "P" },
        { initial: "q", name: "Q" },
        { initial: "r", name: "R" },
        { initial: "s", name: "S" },
        { initial: "t", name: "T" },
        { initial: "u", name: "U" },
        { initial: "v", name: "V" },
        { initial: "w", name: "W" },
        { initial: "x", name: "X" },
        { initial: "y", name: "Y" },
        { initial: "z", name: "Z" },
        { initial: 0, name: "#" },
      ],
      area: -1,
      type: -1,
      initial: -1,
      // 当前所在页数
      currentPage: 1,
      singerList: [],
      // 是否还有更多数据
      isMore: false,
      // 无限滚动是否可用
      disabled: true,
    };
  },

  created() {
    this.getSingerList();
  },
  mounted() {},
  methods: {
    async getSingerList() {
      let ret = await this.$API.reqSingerList({
        type: this.type,
        area: this.area,
        initial: this.initial,
        offset: (this.currentPage - 1) * 30,
      });
      this.singerList.push(...ret.artists);
      this.isMore = ret.more;
      console.log(123);
    },
    //点击语种标签
    clickLanguageSort(index) {
      this.area = this.languageSort[index].area;
      this.singerList = [];
      this.currentPage = 1;
      this.getSingerList();
    },
    //点击分类标签
    clickTypeSort(index) {
      this.type = this.typeSort[index].type;
      this.singerList = [];
      this.currentPage = 1;
      this.getSingerList();
    },
    //点击筛选标签
    clickInitialSort(index) {
      this.initial = this.initialSort[index].initial;
      this.singerList = [];
      this.currentPage = 1;
      this.getSingerList();
    },
    // 卡片上拉触底触发
    load() {
      // console.log("bottomLoad");
      // 如果还有更多数据 则发送请求 将数据 push到数组
      if (this.isMore == true) {
        this.currentPage += 1;
        this.getSingerList();
        this.disabled = true;
        console.log("禁止滚动");
      }
    },

    goSingerDetail(id) {
      this.$router.push({ name: "singerdetail", params: { id } });
    },
  },
  watch: {
    //   数据更新后，可再次运行触发load事件
    singerList() {
      if (this.singerList.length != 0) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.max {
  width: 100%;
  height: 722px;

  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgb(204, 204, 204);
  }
  .singerContainer {
    display: flex;
    width: 1200px;

    margin: 10px auto;
    .selectors {
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
    .listCardContainer {
      display: flex;
      width: 100%;
      height: 600px;
      flex-wrap: wrap;

      span {
        width: 240px;
        height: 270px;
        cursor: pointer;
        div {
          font-size: 15px;
          width: 210px;
          height: 60px;
          margin-top: 10px;
        }
        img {
          width: 220px;
          height: 220px;
          border-radius: 15px;
        }
      }
    }
  }
}
</style>

