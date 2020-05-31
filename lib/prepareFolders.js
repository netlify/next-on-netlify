const { emptyDirSync }                                  = require('fs-extra')
const { NETLIFY_PUBLISH_PATH, NETLIFY_FUNCTIONS_PATH }  = require('./config')

// Empty existing publish and functions folders
const prepareFolders = () => {
  console.log("\x1b[1m🚀 Next on Netlify 🚀\x1b[22m")
  console.log("   Functions directory:", NETLIFY_PUBLISH_PATH)
  console.log("   Publish directory:  ", NETLIFY_FUNCTIONS_PATH)
  console.log("   Make sure these are set in your netlify.toml file.")

  emptyDirSync(NETLIFY_PUBLISH_PATH)
  emptyDirSync(NETLIFY_FUNCTIONS_PATH)
}

module.exports = prepareFolders
