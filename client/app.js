// 程序入口
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App.jsx'

// 如果客户端，就用render；如果用ssr就是hydrate
// ReactDOM.render(<App/>, document.getElementById('root'))

const root = document.getElementById('root')
const render = Component => { // 使用hot-loader的用法
  ReactDOM.hydrate(
    <AppContainer>
      <Component/>
    </AppContainer>,
    root
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    const NextApp = require('./App.jsx').default
    // ReactDOM.render(<NextApp/>, document.getElementById('root'))
    render(NextApp)
  })
}