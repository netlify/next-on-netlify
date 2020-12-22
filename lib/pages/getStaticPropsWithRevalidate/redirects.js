const { join } = require("path");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getDefaultLocaleRedirectForI18n = require("../../helpers/getDefaultLocaleRedirectForI18n");
const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const pages = require("./pages");
const nextConfig = require("../../helpers/getNextConfig")();

let redirects = [];

/** getStaticProps with revalidate pages
 *
 * Page params: {
 *    route -> '/getStaticProps', '/getStaticProps/3'
 *    dataRoute -> '/_next/data/{BUILD_ID}/getStaticProps.json', '_next/data/{BUILD_ID}/getStaticProps/3.json'
 *    srcRoute -> null, /getStaticProps/[id]
 * }
 *
 * Page params in i18n {
 *    route -> '/getStaticProps', '/en/getStaticProps/3'
 *    dataRoute -> '/_next/data/{BUILD_ID}/getStaticProps.json', '_next/data/{BUILD_ID}/en/getStaticProps/3.json'
 *    srcRoute -> null, /getStaticProps/[id]
 * }
 **/

// Used for i18n to prevent added repeat srcRoute redirects
const i18nSrcRouteRedirectsAdded = [];
const dynamicLocaleSrcRoutesAdded = [];

pages.forEach(({ route, srcRoute, dataRoute }) => {
  const relativePath = getFilePathForRoute(srcRoute || route, "js");
  const filePath = join("pages", relativePath);
  const functionName = getNetlifyFunctionName(filePath);
  const target = `/.netlify/functions/${functionName}`;

  // Add one redirect for the page
  redirects.push({
    route,
    target,
  });

  // Add one redirect for the data route
  redirects.push({
    route: dataRoute,
    target,
  });

  // Add redirect for naked route -> target (if i18n)
  redirects = redirects.concat(
    getDefaultLocaleRedirectForI18n(route, null, target)
  );
});

module.exports = redirects;
