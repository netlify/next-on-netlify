const { join } = require("path");
const { readJSONSync } = require("fs-extra");
const { NEXT_DIST_DIR } = require("../config");

const getPagesManifest = () => {
  const contents = readJSONSync(
    join(NEXT_DIST_DIR, "serverless", "pages-manifest.json")
  );
  // Next.js mistakenly puts backslashes in certain paths on Windows, replace
  Object.entries(contents).forEach(([key, value]) => {
    contents[key] = value.replace(/\\/g, "/");
  });
  return contents;
};

module.exports = getPagesManifest;
