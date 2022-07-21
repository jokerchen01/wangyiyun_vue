import axios from "axios";
//axios二次封装

//引入进度条
import nprogress from "nprogress";
//引入进度条样式
import 'nprogress/nprogress.css'
//引入store(uuid)


const requests = axios.create({
    //基础路径
    baseURL: '/api',
    //请求超时时间
    timeout: 30000,
    withCredentials: true
})
//请求拦截器
requests.interceptors.request.use((config) => {


    nprogress.start()
    return config
})

//响应拦截器
requests.interceptors.response.use((res) => {
    nprogress.done()
    return res.data
}, (error) => {
    return Promise.reject(new Error('faile'))
})
export default requests