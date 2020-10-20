const { relative } = require("path");
const { logTitle, logItem } = require("../../helpers/logger");
const { NETLIFY_PUBLISH_PATH } = require("../../config");
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
