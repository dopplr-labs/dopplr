const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const config = require('../configs/webpack.renderer.config')

// build the webpack compiler using the configuration
const compiler = webpack(config)

const PORT = 3000
const HOST = 'localhost'

// eslint-disable-next-line new-cap
const server = new webpackDevServer(compiler)
server.listen(PORT, HOST, (error) => {
  if (!error) {
    // eslint-disable-next-line no-console
    console.log(`renderer running on http://${HOST}:${PORT}`)
  }
})
