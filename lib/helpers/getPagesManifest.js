const { join } = require("path");
const { readJSONSync } = require("fs-extra");
const { NEXT_DIST_DIR } = require("../config");

const getPagesManifest = () => {
  return readJSONSync(join(NEXT_DIST_DIR, "serverless", "pages-manifest.json"));
};

module.exports = getPagesManifest;
