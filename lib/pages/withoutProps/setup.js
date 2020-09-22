const { join, relative } = require("path");
const { copySync } = require("fs-extra");
const { logTitle, logItem } = require("../../helpers/logger");
const { NEXT_DIST_DIR, NETLIFY_PUBLISH_PATH } = require("../../config");
const setupStaticFileForPage = require("../../helpers/setupStaticFileForPage");
const pages = require("./pages");

// Identify all pages that have been pre-rendered and copy each one to the
// Netlify publish directory.
const setup = () => {
  logTitle(
    "🔥 Copying pre-rendered pages without props to",
    NETLIFY_PUBLISH_PATH
  );

  // Copy each page to the Netlify publish directory
  pages.forEach(({ filePath }) => {
    logItem(filePath);

    // The path to the file, relative to the pages directory
    const relativePath = relative("pages", filePath);
    setupStaticFileForPage(relativePath);
  });
};

module.exports = setup;
