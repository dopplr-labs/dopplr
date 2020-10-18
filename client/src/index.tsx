import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import 'antd/dist/antd.less'

import './styles/index.css'
import { App } from './app'

const root = document.getElementById('root')
if (root) {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    root,
  )
} else {
  // eslint-disable-next-line no-console
  console.error("Couldn't find the root element to mount")
}
