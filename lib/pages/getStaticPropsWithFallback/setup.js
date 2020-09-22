const { join } = require("path");
const { logTitle, logItem } = require("../../helpers/logger");
const { NETLIFY_FUNCTIONS_PATH } = require("../../config");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const setupNetlifyFunctionForPage = require("../../helpers/setupNetlifyFunctionForPage");
const pages = require("./pages");

// Create a Netlify Function for every page with getStaticProps and fallback
const setup = () => {
  logTitle(
    "💫 Setting up pages with getStaticProps and fallback: true",
    "as Netlify Functions in",
    NETLIFY_FUNCTIONS_PATH
  );

  // Create Netlify Function for every page
  pages.forEach(({ route }) => {
    const relativePath = getFilePathForRoute(route, "js");
    const filePath = join("pages", relativePath);
    logItem(filePath);
    setupNetlifyFunctionForPage(filePath);
  });
};

module.exports = setup;
