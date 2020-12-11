const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const getDataRouteForRoute = require("../../helpers/getDataRouteForRoute");
const pages = require("./pages");
const getNextConfig = require("../../helpers/getNextConfig");

const redirects = [];

const nextConfig = getNextConfig();

pages.forEach(({ route, filePath }) => {
  const functionName = getNetlifyFunctionName(filePath);

  // If i18n, need to accommodate for locales
  if (nextConfig.i18n) {
    const { locales } = nextConfig.i18n;
    // Add redirects for each locale
    locales.forEach((locale) => {
      redirects.push({
        route: `/${locale}${route}`,
        target: `/.netlify/functions/${functionName}`,
      });
    });
  }

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
