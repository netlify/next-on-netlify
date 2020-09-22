const { join } = require("path");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const pages = require("./pages");

const redirects = [];

pages.forEach(({ route, srcRoute, dataRoute }) => {
  const relativePath = getFilePathForRoute(srcRoute || route, "js");
  const filePath = join("pages", relativePath);
  const functionName = getNetlifyFunctionName(filePath);

  // Add one redirect for the page
  redirects.push({
    route,
    target: `/.netlify/functions/${functionName}`,
  });

  // Add one redirect for the data route
  redirects.push({
    route: dataRoute,
    target: `/.netlify/functions/${functionName}`,
  });
});

module.exports = redirects;
