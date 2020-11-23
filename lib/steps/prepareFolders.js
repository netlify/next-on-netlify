const { emptyDirSync } = require("fs-extra");
const { logTitle, log } = require("../helpers/logger");
const { NETLIFY_PUBLISH_PATH, NETLIFY_FUNCTIONS_PATH } = require("../config");

// Empty existing publish and functions folders
const prepareFolders = ({ functionsPath, publishPath }) => {
  logTitle("🚀 Next on Netlify 🚀");

  if (functionsPath === NETLIFY_FUNCTIONS_PATH) {
    log("  ", "Functions directory: ", functionsPath);
  }
  if (publishPath === NETLIFY_PUBLISH_PATH) {
    log("  ", "Publish directory: ", publishPath);
  }
  if (
    functionsPath === NETLIFY_FUNCTIONS_PATH ||
    publishPath === NETLIFY_PUBLISH_PATH
  ) {
    log("  ", "Make sure these are set in your netlify.toml file.");
  }

  if (publishPath === NETLIFY_PUBLISH_PATH) emptyDirSync(publishPath);
  if (functionsPath === NETLIFY_FUNCTIONS_PATH) emptyDirSync(functionsPath);
};

module.exports = prepareFolders;
