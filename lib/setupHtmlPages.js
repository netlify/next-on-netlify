const path = require("path");
const { join } = path;
const { copySync, existsSync } = require("fs-extra");
const { logTitle, logItem } = require("./logger");
const { NEXT_DIST_DIR, NETLIFY_PUBLISH_PATH } = require("./config");
const allNextJsPages = require("./allNextJsPages");

// Identify all pages that have been pre-rendered and copy each one to the
// Netlify publish directory.
const setupHtmlPages = () => {
  logTitle("📝 Writing pre-rendered HTML pages to", NETLIFY_PUBLISH_PATH);

  // Get HTML pages
  const htmlPages = allNextJsPages.filter((page) => page.isHtml());

  // Copy each page to the Netlify publish directory
  htmlPages.forEach(({ filePath }) => {
    logItem(filePath);

    // The path to the file, relative to the pages directory
    const relativePath = path.relative("pages", filePath);

    copySync(
      join(NEXT_DIST_DIR, "serverless", "pages", relativePath),
      join(NETLIFY_PUBLISH_PATH, relativePath),
      {
        overwrite: false,
        errorOnExist: true,
      }
    );
  });
};

module.exports = setupHtmlPages;
