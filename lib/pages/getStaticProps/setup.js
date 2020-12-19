const { join } = require("path");
const { logTitle, logItem } = require("../../helpers/logger");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getDataRouteForRoute = require("../../helpers/getDataRouteForRoute");
const nextConfig = require("../../helpers/getNextConfig")();
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

    // If i18n, Next puts prerended files under a different path for each locale
    // i.e. pages/static -> .next/serverless/pages/{locale}/static
    // Dynamic routes in i18n, Next auto-prepends routes with locales
    // Static routes in i18n are missing locale so we set up a page per locale
    // Dynamic route example: /en/staticProps/10
    // Static route example: /static
    const isDynamic = !!srcRoute;
    if (nextConfig.i18n && !isDynamic) {
      const { locales = [] } = nextConfig.i18n;

      locales.forEach((locale) => {
        // Remove extra slash for static index route
        // This path will go from / -> /en or /some/path -> /en/some/path
        const route_ = route === "/" ? "" : route;

        const htmlPath = getFilePathForRoute(route_, "html", locale);
        setupStaticFileForPage({ inputPath: htmlPath, publishPath });

        const jsonPath = getFilePathForRoute(route_, "json", locale);
        // The provided dataRoutes (from prerender-manifest) for these page types
        // actually don't include the locale (unclear why Vercel did this)
        // BUT the actual path to the .json files DO include the locale
        // therefore we need to set up the .json pages in the locale loop and
        // ignore the dataRoute provided by the prerender-manifest
        const i18nDataRoute = getDataRouteForRoute(route, locale);
        setupStaticFileForPage({
          inputPath: jsonPath,
          outputPath: i18nDataRoute,
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
