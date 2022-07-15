import { reqSongUrl } from '@/api/index'

export default ({
    namespaced: true,
    state: {
        songInfo: {},
        // 音乐的url
        musicId: '',
        // 音乐的播放状态
        isPlay: false,
        // 当前播放的歌单
        musicList: [],
        // 当前播放歌单的id
        musicListId: '',

        // 实时播放时长
        currentTime: 0,
    },
    actions: {
        //播放音乐
        async playSong({ commit }, id = {}) {

            const ret = await reqSongUrl(id);
            if (ret.code == 200) {
                commit('PLAYSONG', ret.data[0])
            }


        },
    },
    mutations: {
        PLAYSONG(state, songInfo) {
            state.songInfo = songInfo
        },
        PLAYALLSONG(state, musicList) {
            state.musicList = musicList
        },
        CHANGEINDEX(state, index) {
            state.currentIndex = index
        }
    },
    getters: {}
})