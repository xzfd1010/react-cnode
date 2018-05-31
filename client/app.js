// 程序入口
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

// 服务端没有document
ReactDOM.hydrate(<App/>, document.getElementById('root'))