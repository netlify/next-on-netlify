const path = require("path");
const { join } = path;
const { copySync, existsSync } = require("fs-extra");
const { logTitle, logItem } = require("./logger");
const {
  NEXT_DIST_DIR,
  NETLIFY_FUNCTIONS_PATH,
  FUNCTION_TEMPLATE_PATH,
} = require("./config");
const allNextJsPages = require("./allNextJsPages");
const getNetlifyFunctionName = require("./getNetlifyFunctionName");

// Identify all pages that require server-side rendering and create a separate
// Netlify Function for every page.
const setupSsrPages = () => {
  logTitle(
    "💫 Setting up SSR pages and SSG pages with fallback",
    "as Netlify Functions in",
    NETLIFY_FUNCTIONS_PATH
  );

  // Get SSR pages and SSG fallback pages (which also need to be rendered
  // server-side)
  const ssrPages = allNextJsPages.filter(
    (page) => page.isSsr() || page.isSsgFallback()
  );

  // Create Netlify Function for every page
  ssrPages.forEach(({ filePath }) => {
    logItem(filePath);

    // Set function name based on file path
    const functionName = getNetlifyFunctionName(filePath);
    const functionDirectory = join(NETLIFY_FUNCTIONS_PATH, functionName);

    // Copy function template
    copySync(
      FUNCTION_TEMPLATE_PATH,
      join(functionDirectory, `${functionName}.js`),
      {
        overwrite: false,
        errorOnExist: true,
      }
    );

    // Copy page
    copySync(
      join(NEXT_DIST_DIR, "serverless", filePath),
      join(functionDirectory, "nextJsPage.js"),
      {
        overwrite: false,
        errorOnExist: true,
      }
    );
  });
};

module.exports = setupSsrPages;
