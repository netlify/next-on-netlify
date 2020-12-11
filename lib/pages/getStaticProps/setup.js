const { join } = require("path");
const { logTitle, logItem } = require("../../helpers/logger");
const getDataRouteForI18nRoute = require("../../helpers/getDataRouteForI18nRoute");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getFilePathForRouteWithI18n = require("../../helpers/getFilePathForRouteWithI18n");
const getNextConfig = require("../../helpers/getNextConfig");
const isRouteWithFallback = require("../../helpers/isRouteWithFallback");
const setupStaticFileForPage = require("../../helpers/setupStaticFileForPage");
const setupNetlifyFunctionForPage = require("../../helpers/setupNetlifyFunctionForPage");
const pages = require("./pages");

// Copy pre-rendered SSG pages
const setup = ({ functionsPath, publishPath }) => {
  logTitle(
    "🔥 Copying pre-rendered pages with getStaticProps and JSON data to",
    publishPath
  );

  // Keep track of the functions that have been set up, so that we do not set up
  // a function for the same file path twice
  const filePathsDone = [];

  pages.forEach(({ route, dataRoute, srcRoute }) => {
    logItem(route);

    const nextConfig = getNextConfig();

    // If an app is using i18n, Next will put statically
    // generated files under a different path for each different locale
    // i.e. pages/static -> pages/{locale}/static
    if (nextConfig.i18n) {
      const { locales = [] } = nextConfig.i18n;

      // For dynamic routes in i18n, Next auto-prepends with locale
      // in prerender-manifest; static routes are missing locale so
      // we need to manually accommodate
      const isNotDynamic = !srcRoute;
      if (isNotDynamic) {
        locales.forEach((locale) => {
          // Copy pre-rendered HTML page
          const route_ = route === "/" ? "" : route;
          const htmlPath = getFilePathForRouteWithI18n(route_, "html", locale);
          setupStaticFileForPage({ inputPath: htmlPath, publishPath });

          const jsonPath = getFilePathForRouteWithI18n(route_, "json", locale);

          // the actual route to the json is under pages/{locale}
          // but the dataRoutes are the same for all locales according to
          // prerender-manifest..
          const realJsonDataRoute = getDataRouteForI18nRoute(route, locale);
          setupStaticFileForPage({
            inputPath: jsonPath,
            outputPath: realJsonDataRoute,
            publishPath,
          });
        });
      } else {
        // Copy pre-rendered HTML page
        const htmlPath = getFilePathForRoute(route, "html");
        setupStaticFileForPage({ inputPath: htmlPath, publishPath });

        // Copy page's JSON data
        const jsonPath = getFilePathForRoute(route, "json");
        setupStaticFileForPage({
          inputPath: jsonPath,
          outputPath: dataRoute,
          publishPath,
        });
      }
      // TO-DO combine these conditions
    } else {
      // Copy pre-rendered HTML page
      const htmlPath = getFilePathForRoute(route, "html");
      setupStaticFileForPage({ inputPath: htmlPath, publishPath });

      // Copy page's JSON data
      const jsonPath = getFilePathForRoute(route, "json");
      setupStaticFileForPage({
        inputPath: jsonPath,
        outputPath: dataRoute,
        publishPath,
      });
    }

    // // Set up the Netlify function (this is ONLY for preview mode)
    const relativePath = getFilePathForRoute(srcRoute || route, "js");
    const filePath = join("pages", relativePath);

    // Skip if we have already set up a function for this file
    // or if the source route has a fallback (handled by getStaticPropsWithFallback)
    if (filePathsDone.includes(filePath) || isRouteWithFallback(srcRoute))
      return;

    logItem(filePath);
    setupNetlifyFunctionForPage({ filePath, functionsPath });
    filePathsDone.push(filePath);
  });
};

module.exports = setup;
