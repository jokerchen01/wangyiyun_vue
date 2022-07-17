<template>
  <div class="ranking">
    <h3>官方榜</h3>
    <div class="official-list" v-for="rank in FiveSong" :key="rank.id">
      <img v-lazy="rank.coverImgUrl" alt="" @click="goListDetails(rank.id)" />
      <div class="listContainer">
        <tr v-for="(track, index) in rank.tracks.slice(0, 5)" :key="track.id">
          <td>{{ index + 1 }}</td>
          <td>{{ track.name }}</td>
          <td>{{ track.ar[0].name }}</td>
        </tr>

        <div @click="goListDetails(rank.id)" style="cursor: pointer">
          查看全部
        </div>
      </div>
    </div>

    <h3>全球榜</h3>
    <div class="Global-list">
      <span v-for="g in GlobalList" :key="g.id">
        <img
          v-lazy="g.coverImgUrl + '?param=400y400'"
          @click="goListDetails(g.id)"
        />
        <div>{{ g.name }}</div>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  async created() {
    await this.getAllRanking();
  },
  mounted() {},
  data() {
    return {
      RankingList: [],
      GlobalList: [],
      FiveSong: [],
      allList: [],
    };
  },
  methods: {
    async getAllRanking() {
      let result = await this.$API.reqAllRanking();
      if (result.code == 200) {
        this.RankingList = result.list.slice(0, 4);
        this.allList = result.list;
        this.getFiveSong();
      }
    },
    async getListDetail(id) {
      let result = await this.$API.reqListDetail({ id });
      if (result.code == 200) {
        this.FiveSong.push(result.playlist);
        this.GlobalList = this.allList.slice(4);
      }
    },
    //获取前五首歌
    getFiveSong() {
      this.RankingList.forEach((item) => {
        this.getListDetail(item.id);
      });
    },
    goListDetails(id) {
      this.$router.push({
        name: "musiclistdetails",
        params: {
          id: id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.ranking {
  width: 1200px;
  height: 680px;
  margin: 20px auto;

  h3 {
    color: #666;
    font-weight: normal;
  }
  .official-list {
    margin-bottom: 50px;
    display: flex;
    height: 220px;
    img {
      width: 180px;
      height: 180px;
      border-radius: 15px;
      cursor: pointer;
    }
    .listContainer {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      margin-left: 25px;
      div {
        margin-top: 15px;
        font-size: 14px;
        color: rgb(153, 153, 153);
        &::after {
          content: "\e65f";
          font-family: "iconfont";
        }
      }
      tr {
        height: 35px;
        width: 940px;
        &:nth-child(odd) {
          background-color: #f9f9f9;
        }
        td {
          &:nth-child(1) {
            width: 35px;
            height: 35px;
            text-align: center;
            font-size: 14px;
            color: rgb(153, 153, 153);
          }
          &:nth-child(2) {
            width: 700px;
            height: 30px;
            line-height: 40px;
            color: rgb(32, 32, 32);
            font-size: 14px;
          }
          &:nth-child(3) {
            width: 250px;
            text-align: right;
            font-size: 14px;
            color: rgb(153, 153, 153);
          }
        }
      }
    }
  }
  .Global-list {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    span {
      width: 240px;
      height: 300px;
      cursor: pointer;
      img {
        width: 220px;
        height: 220px;
        border-radius: 15px;
      }
      div {
        font-size: 15px;
        width: 210px;
        height: 60px;
        margin-top: 10px;
      }
    }
  }
}
</style>
