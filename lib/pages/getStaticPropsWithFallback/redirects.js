const { join } = require("path");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const getDataRouteForRoute = require("../../helpers/getDataRouteForRoute");
const nextConfig = require("../../helpers/getNextConfig")();
const pages = require("./pages");

const { i18n } = nextConfig;

const redirects = [];

pages.forEach(({ route, dataRoute }) => {
  const relativePath = getFilePathForRoute(route, "js");
  const filePath = join("pages", relativePath);
  const functionName = getNetlifyFunctionName(filePath);

  // Add one redirect for the page
  redirects.push({
    route,
    target: `/.netlify/functions/${functionName}`,
  });

  // Add one redirect for the data route
  // If i18n, the dataRoute is under the defaultLocale
  redirects.push({
    route: i18n ? getDataRouteForRoute(route, i18n.defaultLocale) : dataRoute,
    target: `/.netlify/functions/${functionName}`,
  });
});

module.exports = redirects;
