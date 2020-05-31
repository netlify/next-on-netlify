const { existsSync, copySync }              = require('fs-extra')
const { NETLIFY_PUBLISH_PATH, PUBLIC_PATH } = require('./config')

// Copy files from public folder to Netlify publish folder
const copyPublicFiles = () => {
  // Abort if no public/ folder
  if(!existsSync(PUBLIC_PATH))
    return

  // Perform copy operation
  console.log(`\x1b[1m🌍️ Copying ${PUBLIC_PATH} folder to ${NETLIFY_PUBLISH_PATH}\x1b[22m`)
  copySync(PUBLIC_PATH, NETLIFY_PUBLISH_PATH)
}

module.exports = copyPublicFiles
