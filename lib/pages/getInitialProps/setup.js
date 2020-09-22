const { logTitle, logItem } = require("../../helpers/logger");
const { NETLIFY_FUNCTIONS_PATH } = require("../../config");
const setupNetlifyFunctionForPage = require("../../helpers/setupNetlifyFunctionForPage");
const pages = require("./pages");

// Create a Netlify Function for every page with getInitialProps
const setup = () => {
  logTitle(
    "💫 Setting up pages with getInitialProps as Netlify Functions in",
    NETLIFY_FUNCTIONS_PATH
  );

  // Create Netlify Function for every page
  pages.forEach(({ filePath }) => {
    logItem(filePath);
    setupNetlifyFunctionForPage(filePath);
  });
};

module.exports = setup;
