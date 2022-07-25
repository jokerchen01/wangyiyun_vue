import requests from "./request";
/* 推荐歌单接口 */
export const reqRecommendList = () => requests({ url: '/personalized/?limit=10', method: 'get' })
//获取banner
export const reqBanner = () => requests({ url: '/banner', method: 'get' })

//获取精品歌单头部
export const reqHighQuality = () => requests({ url: '/top/playlist/highquality', method: 'get' })
//获取精品歌单标签列表
export const reqBoutiqueLabel = () => requests({ url: '/playlist/hot', method: 'get' })
//获取歌单列表
export const reqSongList = (params) => requests({ url: '/top/playlist', params, method: 'get' })
//获取全部歌单标签
export const reqAllLabels = () => requests({ url: '/playlist/catlist', method: 'get' })

//获取排行榜/toplist
export const reqAllRanking = () => requests({ url: '/toplist', method: 'get' })
//获取歌单中的歌曲列表
export const reqListDetail = (params) => requests({ url: '/playlist/detail', params, method: 'get' })
//获取音乐的url
export const reqSongUrl = (params) => requests({ url: `/song/url/`, params, method: 'get' })

//获取歌手列表
export const reqSingerList = (params) => requests({ url: '/artist/list', params, method: 'get' })
//获取歌曲评论
export const reqCommentList = (params) => requests({ url: '/comment/playlist', params, method: 'get' })
//获取歌曲收藏者
export const reqCollectionList = (params) => requests({ url: '/playlist/subscribers', params, method: 'get' })

//获取歌手信息
export const reqSingerInfo = (params) => requests({ url: '/artist/detail', params, method: 'get' })
//获取歌手top50歌曲
export const reqSingerHotSong = (params) => requests({ url: '/artist/top/song', params, method: 'get' })
//获取歌手专辑
export const reqSingerAlbum = (params) => requests({ url: '/artist/album', params, method: 'get' })
//获取专辑详情
export const reqAlbumDetail = (params) => requests({ url: '/album', params, method: 'get' })
//获取歌手mv
export const reqSingerMv = (params) => requests({ url: '/artist/mv', params, method: 'get' })

//登录
export const reqLogin = (params) => requests({ url: '/login/cellphone', params, method: 'get' })
//获取账号信息
export const reqUserInfo = (params) => requests({ url: '/user/account', params, method: 'get' })


//请求视频分类
export const reqVideoLabel = (params) => requests({ url: '/video/category/list', params, method: 'get' })
//获取视频list
export const reqVideoList = (params) => requests({ url: '/video/group', params, method: 'get' })
//获取视频全部标签
export const reqAllLabel = () => requests({ url: '/video/group/list', method: 'get' })
//获取mvList
export const reqMvList = (params) => requests({ url: '/mv/all', params, method: 'get' })


//获取每日歌曲列表
export const reqRecommendMusic = (params) => requests({ url: '/recommend/songs', params, method: 'get' })

//获取用户个人页面信息
export const reqPersonalInfo = (uid) => requests({ url: `/user/detail/?uid=${uid}`, method: 'get' })
//获取用户创建歌单
export const reqUserMusicList = (params) => requests({ url: `/user/playlist`, params, method: 'get' })
//退出登录
export const reqLogout = () => requests({ url: `/logout`, method: 'get' })

//获取mv详情数据
export const reqMvDetail = (params) => requests({ url: `/mv/detail`, params, method: 'get' })
//获取mv的url
export const reqMvUrl = (params) => requests({ url: `/mv/url`, params, method: 'get' })
//获取mv评论
export const reqMvComment = (params) => requests({ url: `/comment/mv`, params, method: 'get' })
//请求相关视频
export const reqRelatedVideo = (params) => requests({ url: `/related/allvideo`, params, method: 'get' })
//获取视频详情
export const reqVideoDetail = (params) => requests({ url: `/video/detail`, params, method: 'get' })
//获取相关视频url
export const reqVideoUrl = (params) => requests({ url: `/video/url`, params, method: 'get' })
//获取视频评论
export const reqVideoComment = (params) => requests({ url: `/comment/video`, params, method: 'get' })


//获取歌词页面的评论
export const reqMusicComment = (params) => requests({ url: `/comment/music`, params, method: 'get' })

export const reqHotComment = (params) => requests({ url: `/comment/hot`, params, method: 'get' })

//获取歌词
export const reqLyric = (params) => requests({ url: `/lyric`, params, method: 'get' })