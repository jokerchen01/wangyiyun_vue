import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import songInfo from './song'

export default new Vuex.Store({
    modules: {
        songInfo
    }
})