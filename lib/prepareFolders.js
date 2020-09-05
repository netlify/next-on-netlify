const { emptyDirSync } = require("fs-extra");
const { logTitle, log } = require("./logger");
const { NETLIFY_PUBLISH_PATH, NETLIFY_FUNCTIONS_PATH } = require("./config");

// Empty existing publish and functions folders
const prepareFolders = () => {
  logTitle("🚀 Next on Netlify 🚀");
  log("  ", "Functions directory:", NETLIFY_PUBLISH_PATH);
  log("  ", "Publish directory:  ", NETLIFY_FUNCTIONS_PATH);
  log("  ", "Make sure these are set in your netlify.toml file.");

  emptyDirSync(NETLIFY_PUBLISH_PATH);
  emptyDirSync(NETLIFY_FUNCTIONS_PATH);
};

module.exports = prepareFolders;
