const path = require('path') // 避免不同系统的路径问题
module.exports = {
  target: 'node', // react打包出来的文件，在node.js中执行
  // 入口文件
  entry: {
    app: path.join(__dirname, '../client/server-entry.js')
  },
  output: {
    filename: 'server-entry.js',
    path: path.join(__dirname, '../dist'),
    publicPath: '',
    libraryTarget: 'commonjs2' // 打包出来的js使用的方案，commonjs / amd /cmd
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
  mode: 'none'
}

// app.hash.js