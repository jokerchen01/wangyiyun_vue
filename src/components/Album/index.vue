<template>
  <div>
    <div class="Album">
      <div class="Album-img">
        <img src="@/assets/img/topSongsLogo.png" alt="" />
      </div>
      <div class="Album-detail">
        <div class="Album-name">热门50首</div>
        <div class="Album-list">
          <el-table
            :data="hotSongs"
            :row-style="{ height: '40px' }"
            :cell-style="{ padding: '0px' }"
            stripe
            highlight-current-row
            :show-header="false"
            style="
              width: 100%;
              cursor: pointer;
              margin-top: 20px;
              font-size: 13px;
            "
            size="mini"
          >
            <el-table-column type="index" :index="handleIndex" width="36">
            </el-table-column>

            <el-table-column prop="name" width="1000">
              <template slot-scope="{ row }">
                <!--  @dblclick="playMusic(row)" -->
                <div @dblclick="playMusic(row)">
                  {{ row.name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ar[0].name" width="80">
              <template slot-scope="{ row }">
                <!--  @dblclick="playMusic(row)" -->
                <div style="color: #808080">
                  {{ row.ar[0].name }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="checkAll" @click="checkAllHot">查看全部</div>
        </div>
      </div>
    </div>
    <div class="Album" v-for="hot in albums" :key="hot.album.id">
      <div class="Album-img">
        <img :src="hot.album.picUrl + '?param=400y400'" />
      </div>
      <div class="Album-detail">
        <div class="Album-name">{{ hot.album.name }}</div>
        <div class="Album-list">
          <el-table
            :data="hot.songs"
            :row-style="{ height: '40px' }"
            :cell-style="{ padding: '0px' }"
            stripe
            highlight-current-row
            :show-header="false"
            style="
              width: 100%;
              cursor: pointer;
              margin-top: 20px;
              font-size: 13px;
            "
            size="mini"
          >
            <el-table-column type="index" :index="handleIndex" width="36">
            </el-table-column>

            <el-table-column prop="name" width="1000">
              <template slot-scope="{ row }">
                <!--  @dblclick="playMusic(row)" -->
                <div @dblclick="playMusic(row)">
                  {{ row.name }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="" width="80">
              <template slot-scope="{ row }">
                <!--  @dblclick="playMusic(row)" -->
                <div style="color: #808080">{{ row.ar[0].name }}</div>
              </template>
            </el-table-column>
          </el-table>
          <div class="checkAll">查看全部</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Album",
  props: ["hotSongs", "hotAlbums", "albums"],
  data() {
    return {};
  },

  methods: {
    handleIndex(index) {
      index += 1;
      if (index < 10) {
        return "0" + index;
      } else {
        return index;
      }
    },
    checkAllHot() {
      this.$emit("checkAllHotSong");
    },
    playMusic(row) {
      console.log(row);
      this.$bus.$emit("getSongInfo", row);
    },
  },
};
</script>

<style lang="less" scoped>
.Album {
  margin: 30px 0 60px 0;
  display: flex;
  width: 1400px;
  .checkAll {
    font-size: 14px;
    margin-top: 10px;
  }

  .Album-img {
    width: 180px;
    height: 180px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 15px;
    }
  }
  .Album-detail {
    padding-left: 20px;
    .Album-name {
      font-size: 20px;
      font-weight: 600;
    }
    .Album-list {
      .checkAll {
        &::after {
          content: "\e65f";
          font-family: "iconfont";
        }
      }
    }
  }
}
</style>