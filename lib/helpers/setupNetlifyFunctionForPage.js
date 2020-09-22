const { copySync } = require("fs-extra");
const { join } = require("path");
const {
  NEXT_DIST_DIR,
  NETLIFY_FUNCTIONS_PATH,
  FUNCTION_TEMPLATE_PATH,
} = require("../config");
const getNetlifyFunctionName = require("./getNetlifyFunctionName");

// Create a Netlify Function for the page with the given file path
const setupNetlifyFunctionForPage = (filePath) => {
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
};

module.exports = setupNetlifyFunctionForPage;
