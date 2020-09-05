const { join } = require("path");
const { copySync } = require("fs-extra");
const { logTitle } = require("./logger");
const { NETLIFY_PUBLISH_PATH, NEXT_DIST_DIR } = require("./config");

// Copy the NextJS' static assets from NextJS distDir to Netlify publish folder.
// These need to be available for NextJS to work.
const copyNextAssets = () => {
  logTitle("💼 Copying static NextJS assets to", NETLIFY_PUBLISH_PATH);
  copySync(
    join(NEXT_DIST_DIR, "static"),
    join(NETLIFY_PUBLISH_PATH, "_next", "static"),
    {
      overwrite: false,
      errorOnExist: true,
    }
  );
};

module.exports = copyNextAssets;
