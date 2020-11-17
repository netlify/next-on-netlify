const { join } = require("path");
const { copySync } = require("fs-extra");
const { logTitle } = require("../helpers/logger");
const { NEXT_DIST_DIR } = require("../config");

// Copy the NextJS' static assets from NextJS distDir to Netlify publish folder.
// These need to be available for NextJS to work.
const copyNextAssets = (publishPath) => {
  logTitle("💼 Copying static NextJS assets to", publishPath);
  copySync(
    join(NEXT_DIST_DIR, "static"),
    join(publishPath, "_next", "static"),
    {
      overwrite: false,
      errorOnExist: true,
    }
  );
};

module.exports = copyNextAssets;
