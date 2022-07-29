import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
//重写VueRouter.prototype身上的push方法了
VueRouter.prototype.push = function (location, resolve, reject) {
    //第一个形参：路由跳转的配置对象（query|params）
    if (resolve && reject) {
        //originPush：利用call修改上下文，变为(路由组件.$router)这个对象，第二参数：配置对象、第三、第四个参数：成功和失败回调函数
        originPush.call(this, location, resolve, reject);
    } else {
        //push方法没有产地第二个参数|第三个参数
        originPush.call(this, location, () => { }, () => { });
    }
};
//重写VueRouter.prototype身上的replace方法了
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject);
    } else {
        originReplace.call(this, location, () => { }, () => { });
    }
};

//创建router实例对象
const router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        {
            path: '/findmusic',
            component: () => import('@/pages/FindMusic'),
            children: [
                {
                    path: 'personality',
                    component: () => import('@/pages/FindMusic/Personality'),
                },
                {
                    path: 'songlist',
                    component: () => import('@/pages/FindMusic/SongList'),

                },
                {
                    path: 'ranking',
                    component: () => import('@/pages/FindMusic/Ranking'),

                },
                {
                    path: 'singer',
                    component: () => import('@/pages/FindMusic/Singer'),

                },
                {
                    path: '/findmusic',
                    redirect: '/findmusic/personality'
                }

            ]
        },
        {
            path: '/video',
            component: () => import('@/pages/Video'),
            children: [
                {

                    path: 'videolist',
                    component: () => import('@/pages/Video/VideoList')
                },
                {

                    path: 'mvlist',
                    component: () => import('@/pages/Video/MvList')
                },
                {
                    path: '/video',
                    redirect: '/video/videolist'
                }
            ]
        },
        {
            path: '/collection',
            component: () => import('@/pages/Collection')
        },
        {
            path: '/recommend',
            component: () => import('@/pages/Recommend')
        },
        {
            name: 'musiclistdetails',
            path: '/musiclistdetails/:id',
            component: () => import('@/pages/MusicListDetails'),

        }
        ,
        {
            name: 'singerdetail',
            path: '/singerdetail/:id',
            component: () => import('@/pages/SingerDetail'),

        },
        {
            name: 'personal',
            path: '/personal/:uid',
            component: () => import('@/pages/Personal'),

        },
        {
            name: 'videodetail',
            path: '/videodetail/:id',
            component: () => import('@/pages/VideoDetail'),

        },

        {
            path: '/',
            redirect: '/findmusic'
        }


    ]
})
export default router