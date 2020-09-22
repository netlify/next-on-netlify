const { join } = require("path");
const { readJSONSync } = require("fs-extra");
const { NEXT_DIST_DIR } = require("../config");

const getPrerenderManifest = () => {
  return readJSONSync(join(NEXT_DIST_DIR, "prerender-manifest.json"));
};

module.exports = getPrerenderManifest;
