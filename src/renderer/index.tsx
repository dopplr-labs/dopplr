import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app'
import './styles/index.css'

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
