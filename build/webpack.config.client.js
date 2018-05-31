const path = require('path') // 避免不同系统的路径问题
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  // 入口文件
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name].[hash].js', // 对整个app打包完成后会添加hash值
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/'  // 区分是静态资源还是api请求；如果部署了cdn，直接写前缀即可  public/app.hash.js ，这里一定要加"/"
  },
  module: {
    // 配置react loader
    rules: [
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ],
  mode: 'none'
}
// 如果有dist目录的话，配置会失效；所以要先删掉
if (isDev) {
  // 热更新需要的内容
  config.entry = {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/app.js')
    ]
  }
  config.devServer = {
    host: '0.0.0.0', // 可以用任何方式访问 localhost/127.0.0.1/ip
    port: '3000',
    contentBase: path.join(__dirname, '../dist'), // 经过webpack编译出来的静态文件路径,
    // hot: true, // 热模块重载
    overlay: { // 弹窗错误
      errors: true
    },
    hot: true,
    publicPath: '/public/', // 访问所有静态文件，前面都要加public
    // 配置路由的方法
    historyApiFallback: {
      index: '/public/index.html' // 指定index对应的文件
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config