const path = require('path')
const process = require('process')
const { spawn } = require('child_process')
const webpack = require('webpack')
const config = require('../configs/webpack.main.config')

const ELECTRON_PATH = path.resolve(__dirname, '../node_modules/.bin/electron')
const PROJECT_ROOT = path.resolve(__dirname, '..')

const compiler = webpack(config)

// subprocess to run electron
let subprocess

const watching = compiler.watch({}, (error, stats) => {
  // on compilation error, stop watching the files
  // and exit the process
  if (error) {
    watching.close()
    process.exit()
  } else {
    // show webpack compilation stats
    // eslint-disable-next-line no-console
    console.log(
      stats.toString({
        colors: true,
        source: true,
      }),
    )

    // if there is any previous electron process running
    // close it before starting a new process
    if (subprocess) {
      subprocess.off('close', handleSubprocessClose)
      subprocess.kill('SIGTERM')
    }

    // spawn a new electron process
    subprocess = spawn(ELECTRON_PATH, [PROJECT_ROOT], {
      detached: true,
      stdio: 'inherit',
    })
    // https://nodejs.org/api/child_process.html#child_process_subprocess_unref
    // allowing the parent to exit indenpendently of child
    subprocess.unref()

    // if the user closes the electron window, then we can
    // safely exit the application
    subprocess.on('close', handleSubprocessClose)
  }
})

// SIGINT signal is emitted when the user presses ctrl+c
// in that case close the electron subprocess if it still running
process.on('SIGINT', handleProcessClose)

/**
 * Callback to be called on closing the electron subprocess.
 */
function handleSubprocessClose() {
  process.exit()
}

/**
 * Callback to be called on closing the `start-main` process.
 */
function handleProcessClose() {
  if (subprocess) {
    subprocess.kill('SIGTERM')
  }
  process.exit()
}
