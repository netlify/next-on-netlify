const { join } = require("path");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getDataRouteForRoute = require("../../helpers/getDataRouteForRoute");
const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const getDefaultLocaleRedirectForI18n = require("../../helpers/getDefaultLocaleRedirectForI18n");
const pages = require("./pages");

// Pages with getStaticProps (without fallback or revalidation) only need
// redirects for i18n and handling preview mode
let redirects = [];

/** getStaticProps pages
 *
 * Page params {
 *    route -> '/getStaticProps', '/getStaticProps/3'
 *    dataRoute -> '/_next/data/{BUILD_ID}/getStaticProps.json', '_next/data/{BUILD_ID}/getStaticProps/3.json'
 *    srcRoute -> null, /getStaticProps/[id]
 * }
 *
 * Page params with i18n {
 *    route -> '/getStaticProps', '/en/getStaticProps/3'
 *    dataRoute -> '/_next/data/{BUILD_ID}/getStaticProps.json', '_next/data/{BUILD_ID}/en/getStaticProps/3.json'
 *    srcRoute -> null, /getStaticProps/[id]
 * }
 *
 **/

pages.forEach(({ route, dataRoute, srcRoute }) => {
  const relativePath = getFilePathForRoute(srcRoute || route, "js");
  const filePath = join("pages", relativePath);
  const functionName = getNetlifyFunctionName(filePath);

  // Preview mode conditions
  const conditions = ["Cookie=__prerender_bypass,__next_preview_data"];
  const target = `/.netlify/functions/${functionName}`;
  const previewModeRedirect = { conditions, force: true, target };

  // Add a preview mode redirect for the standard route
  redirects.push({
    route,
    ...previewModeRedirect,
  });

  // Add a preview mode redirect for the data route, same conditions
  redirects.push({
    route: dataRoute,
    ...previewModeRedirect,
  });

  const defaultLocaleRedirect = getDefaultLocaleRedirectForI18n(
    route,
    srcRoute
  );

  // Add preview mode redirect for the naked route (*must* precede defaultLocale redirect)
  redirects = redirects.concat(
    defaultLocaleRedirect.map((r) => ({
      route: r.route,
      ...previewModeRedirect,
    }))
  );

  // Add redirect for naked route -> `${defaultLocale}/redirect` (if i18n)
  redirects = redirects.concat(defaultLocaleRedirect);
});

module.exports = redirects;
