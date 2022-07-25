import Vue from 'vue'
import App from './App.vue'
import store from '@/store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/normalize.css'

import '@/assets/icons/iconfont.css'
//引入路由
import router from './router'
//统一接口api文件
import * as API from '@/api'

import imgLoading from '@/assets/img/imgLoading.png'
//引入图片懒加载
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  loading: imgLoading
})






Vue.config.productionTip = false
Vue.use(ElementUI)

//创建vm
new Vue({
  el: '#app',
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  },

  router,
  store,

})
