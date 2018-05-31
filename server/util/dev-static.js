const axios = require('axios')
const path = require('path')
// 实时更新
const webpack = require('webpack')
const serverConfig = require('../../build/webpack.config.server')
const MemoryFs = require('memory-fs')
const ReactDomServer = require('react-dom/server')
const proxy = require('http-proxy-middleware')

// 通过http请求方式从webpack-dev-server启动的服务请求template
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:3000/public/index.html')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const Module = module.constructor

const mfs = new MemoryFs()
// 启动compiler，调用webpack是为了获取打包之后的内容
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs // webpack提供的配置项，重写之前fs的方法
let serverBundle
// stats是webpack的打包信息
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.log(warn))

  // 服务端bundle路径
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  // 不需要输入到硬盘，所以引入memory-fs模块，从内存中读写文件内容
  const bundle = mfs.readFileSync(bundlePath, 'utf-8') // 获取的是字符串
  // 将字符串转化为模块，有没有更好的方法？？？
  const m = new Module()
  m._compile(bundle, 'server-entry.js') // 生成新的模块，此方法一定要指定module的名字，文件名！
  serverBundle = m.exports.default // 这里使用exports.default??我的没有报错
})

module.exports = function (app) {
  // 处理静态文件，使用http-proxy-middleware
  // 客户端的文件在webpack-dev-server中，通过http服务获取，把静态文件代理到dev-server上面
  app.use('/public', proxy({
    target: 'http://localhost:3000'
  }))
  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<!--app-->', content))
    })
  })
}