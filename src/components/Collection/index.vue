<template>
  <div class="collection" v-loading="isLoading">
    <div class="user" v-for="sub in subscribers" :key="sub.userId">
      <div class="user-img">
        <img
          :src="sub.avatarUrl + '?param=100y100'"
          @click="goPersonal(sub.userId)"
        />
      </div>
      <div class="user-name">
        <div class="name">{{ sub.nickname }}</div>
        <div class="say">{{ sub.signature }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Collection",
  props: ["subscribers", "isLoading"],
  methods: {
    //去个人页面
    goPersonal(id) {
      this.$router.push({
        name: "personal",
        params: {
          uid: id,
        },
      });
    },
  },
};
</script>
 
<style lang="less" scoped>
.collection {
  display: flex;
  flex-wrap: wrap;
  width: 1350px;
  margin: 40px auto;
  & > .user:nth-child(3n-1) {
    margin: 0 50px;
  }

  .user {
    display: flex;
    width: 400px;
    height: 120px;
    margin-bottom: 10px;
    padding: 10px;
    cursor: pointer;
    &:hover {
      background-color: rgba(198, 198, 198, 0.15);
    }
    .user-img {
      width: 90px;
      height: 90px;
      img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
    .user-name {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-top: 10px;
      padding-left: 10px;
      height: 50px;
      width: 80%;

      .say {
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
