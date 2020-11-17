const { emptyDirSync } = require("fs-extra");
const { logTitle, log } = require("../helpers/logger");

// Empty existing publish and functions folders
const prepareFolders = ({ functionsPath, publishPath }) => {
  logTitle("🚀 Next on Netlify 🚀");
  log("  ", "Functions directory: ", functionsPath);
  log("  ", "Publish directory: ", publishPath);
  log("  ", "Make sure these are set in your netlify.toml file.");

  emptyDirSync(publishPath);
  emptyDirSync(functionsPath);
};

module.exports = prepareFolders;
