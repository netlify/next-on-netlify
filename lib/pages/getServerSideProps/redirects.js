const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const getDataRouteForRoute = require("../../helpers/getDataRouteForRoute");
const pages = require("./pages");

const redirects = [];

pages.forEach(({ route, filePath }) => {
  const functionName = getNetlifyFunctionName(filePath);

  // Add one redirect for the page
  redirects.push({
    route,
    target: `/.netlify/functions/${functionName}`,
  });

  // Add one redirect for the data route
  redirects.push({
    route: getDataRouteForRoute(route),
    target: `/.netlify/functions/${functionName}`,
  });
});

module.exports = redirects;
