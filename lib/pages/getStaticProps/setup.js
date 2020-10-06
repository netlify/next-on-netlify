const { join } = require("path");
const { logTitle, logItem } = require("../../helpers/logger");
const { NETLIFY_PUBLISH_PATH } = require("../../config");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const isSourceRouteWithFallback = require("../../helpers/isSourceRouteWithFallback");
const setupStaticFileForPage = require("../../helpers/setupStaticFileForPage");
const setupNetlifyFunctionForPage = require("../../helpers/setupNetlifyFunctionForPage");
const pages = require("./pages");

// Copy pre-rendered SSG pages
const setup = () => {
  logTitle(
    "🔥 Copying pre-rendered pages with getStaticProps and JSON data to",
    NETLIFY_PUBLISH_PATH
  );

  // Keep track of the functions that have been set up, so that we do not set up
  // a function for the same file path twice
  const filePathsDone = [];

  pages.forEach(({ route, dataRoute, srcRoute }) => {
    logItem(route);

    // Copy pre-rendered HTML page
    const htmlPath = getFilePathForRoute(route, "html");
    setupStaticFileForPage(htmlPath);

    // Copy page's JSON data
    const jsonPath = getFilePathForRoute(route, "json");
    setupStaticFileForPage(jsonPath, dataRoute);

    // // Set up the Netlify function (this is ONLY for preview mode)
    const relativePath = getFilePathForRoute(srcRoute || route, "js");
    const filePath = join("pages", relativePath);

    // Skip if we have already set up a function for this file
    // or if the source route has fallback: true
    if (filePathsDone.includes(filePath) || isSourceRouteWithFallback(srcRoute))
      return;

    logItem(filePath);
    setupNetlifyFunctionForPage(filePath);
    filePathsDone.push(filePath);
  });
};

module.exports = setup;
