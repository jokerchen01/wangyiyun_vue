const { defineConfig } = require('@vue/cli-service')
// // 引入等比适配插件



module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  productionSourceMap: false,



  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
        'plugins': '@/plugins',
      }
    }
  },
  devServer: {


    proxy: {
      '/api': {
        target: 'http://114.132.182.115:3000',
        /*  target: 'http://www.codeman.ink:3000', */
        /*   target: 'http://localhost:3000/', */
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      'm7': {
        target: 'http://m7.music.126.net',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/m7': ''
        }
      },
      'm701': {
        target: 'http://m701.music.126.net',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/m701': ''
        }
      },
      'm8': {
        target: 'http://m8.music.126.net',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/m8': ''
        }
      },
      'm801': {
        target: 'http://m801.music.126.net',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/m801': ''
        }
      }

    }
  },




})
