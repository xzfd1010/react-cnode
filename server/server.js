// node服务，使用express
const express = require('express')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')

const isDev = process.env.NODE_ENV === "development"

const app = express()

if (!isDev) {
  // require不会读export default的内容，引入的是整个文件，需要 .default
  const serverEntry = require('../dist/server-entry').default // 引入的dist/server-entry
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
  // 静态文件的返回，对应webpack的publicPath
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry)
    res.send(template.replace('<!--app-->', appString))   // 应该返回整个html内容
  })
}else{
  // 需引入dev时的配置
  const devStatic = require('./util/dev-static')
  devStatic(app)
}


app.listen(4000, function () {
  console.log('server is listening')
})