const path = require("path");
const { join } = path;
const { copySync, existsSync } = require("fs-extra");
const { logTitle, logItem } = require("./logger");
const {
  NEXT_DIST_DIR,
  NETLIFY_PUBLISH_PATH,
  NETLIFY_FUNCTIONS_PATH,
  FUNCTION_TEMPLATE_PATH,
} = require("./config");
const allNextJsPages = require("./allNextJsPages");
const getNetlifyFunctionName = require("./getNetlifyFunctionName");

// Identify all pages that require server-side rendering and create a separate
// Netlify Function for every page.
const setupSsgPages = () => {
  // Folder for page JSON data
  const nextDataFolder = join(NETLIFY_PUBLISH_PATH, "_next", "data/");

  logTitle(
    "🔥 Copying pre-rendered SSG pages to",
    NETLIFY_PUBLISH_PATH,
    "and JSON data to",
    nextDataFolder
  );

  // Get SSG pages
  const ssgPages = allNextJsPages.filter((page) => page.isSsg());

  ssgPages.forEach(({ route, htmlFile, jsonFile, dataRoute }) => {
    logItem(route);

    // Copy pre-rendered HTML page
    const htmlPath = join("pages", htmlFile);

    copySync(
      join(NEXT_DIST_DIR, "serverless", htmlPath),
      join(NETLIFY_PUBLISH_PATH, htmlFile),
      {
        overwrite: false,
        errorOnExist: true,
      }
    );

    // Copy page's JSON data
    const jsonPath = join("pages", jsonFile);

    copySync(
      join(NEXT_DIST_DIR, "serverless", jsonPath),
      join(NETLIFY_PUBLISH_PATH, dataRoute),
      {
        overwrite: false,
        errorOnExist: true,
      }
    );
  });
};

module.exports = setupSsgPages;
