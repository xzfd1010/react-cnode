const path = require('path') // 避免不同系统的路径问题
const HTMLPlugin = require('html-webpack-plugin')
module.exports = {
  // 入口文件
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name].[hash].js', // 对整个app打包完成后会添加hash值
    path: path.join(__dirname, '../dist'),
    publicPath: 'public'  // 区分是静态资源还是api请求；如果部署了cdn，直接写前缀即可  public/app.hash.js
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