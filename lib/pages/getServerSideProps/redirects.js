const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const getDataRouteForRoute = require("../../helpers/getDataRouteForRoute");
const pages = require("./pages");
const nextConfig = require("../../helpers/getNextConfig")();

const redirects = [];

/** getServerSideProps pages
 *
 * Params:
 * route examples -> '/ssr', '/ssr/[id]'
 * filePath examples -> 'pages/ssr.js', 'pages/ssr/[id].js'
 *
 * With i18n enabled:
 * route and filePath formats are the same as above
 *
 **/

pages.forEach(({ route, filePath }) => {
  const functionName = getNetlifyFunctionName(filePath);
  const target = `/.netlify/functions/${functionName}`;

  // If i18n, need to add extra redirects for each locale
  // i.e. /en/ssr -> /${target}
  if (nextConfig.i18n) {
    const { locales = [] } = nextConfig.i18n;
    locales.forEach((locale) => {
      redirects.push({
        route: `/${locale}${route}`,
        target,
      });
    });
  }

  // Add one redirect for the default page/route
  // i.e. /ssr
  redirects.push({
    route,
    target,
  });

  // Add one redirect for the data route
  // Next doesn't provide the dataRoute out of the box for us so we
  // construct it ourselves with getDataRouteForRoute
  redirects.push({
    route: getDataRouteForRoute(route),
    target,
  });
});

module.exports = redirects;
