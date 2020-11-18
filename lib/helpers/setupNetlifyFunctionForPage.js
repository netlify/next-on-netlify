const { copySync } = require("fs-extra");
const { join } = require("path");
const {
  NEXT_DIST_DIR,
  TEMPLATES_DIR,
  FUNCTION_TEMPLATE_PATH,
} = require("../config");
const getNetlifyFunctionName = require("./getNetlifyFunctionName");

// Create a Netlify Function for the page with the given file path
const setupNetlifyFunctionForPage = ({ filePath, functionsPath }) => {
  // Set function name based on file path
  const functionName = getNetlifyFunctionName(filePath);
  const functionDirectory = join(functionsPath, functionName);

  // Copy function template
  const functionTemplateCopyPath = join(
    functionDirectory,
    `${functionName}.js`
  );
  copySync(FUNCTION_TEMPLATE_PATH, functionTemplateCopyPath, {
    overwrite: false,
    errorOnExist: true,
  });

  // Copy function helpers
  const functionHelpers = [
    "renderNextPage.js",
    "createRequestObject.js",
    "createResponseObject.js",
  ];
  functionHelpers.forEach((helper) => {
    copySync(join(TEMPLATES_DIR, helper), join(functionDirectory, helper), {
      overwrite: false,
      errorOnExist: true,
    });
  });

  // Copy page
  const nextPageCopyPath = join(functionDirectory, "nextPage.js");
  copySync(join(NEXT_DIST_DIR, "serverless", filePath), nextPageCopyPath, {
    overwrite: false,
    errorOnExist: true,
  });
};

module.exports = setupNetlifyFunctionForPage;
