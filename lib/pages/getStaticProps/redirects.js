const { join } = require("path");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getFilePathForRouteWithI18n = require("../../helpers/getFilePathForRouteWithI18n");
const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const getNextConfig = require("../../helpers/getNextConfig");
const pages = require("./pages");

// Pages with getStaticProps (without fallback or revalidation) only need
// redirects for handling preview mode.
const redirects = [];

pages.forEach(({ route, dataRoute, srcRoute }) => {
  const relativePath = getFilePathForRoute(srcRoute || route, "js");
  const filePath = join("pages", relativePath);
  const functionName = getNetlifyFunctionName(filePath);

  const conditions = ["Cookie=__prerender_bypass,__next_preview_data"];
  const target = `/.netlify/functions/${functionName}`;

  const nextConfig = getNextConfig();
  if (nextConfig.i18n) {
    const { locales } = nextConfig.i18n;
    locales.forEach((locale) => {
      const pageRoute = srcRoute ? route : `${locale}${route}`;
      const dataRoute_ = srcRoute ? dataRoute : `${locale}${dataRoute}`;
      redirects.push({
        route: pageRoute,
        target,
        force: true,
        conditions,
      });
      redirects.push({
        route: dataRoute_,
        target,
        force: true,
        conditions,
      });
    });
  } else {
    // Add one redirect for the page, but only when the NextJS
    // preview mode cookies are present
    redirects.push({
      route,
      target,
      force: true,
      conditions,
    });

    // Add one redirect for the data route, same conditions
    redirects.push({
      route: dataRoute,
      target,
      force: true,
      conditions,
    });
  }
});

module.exports = redirects;
