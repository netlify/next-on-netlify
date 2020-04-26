// Adapted from serverless-next.js (v1.8.0)
// See original file in serverless-next.js folder.
// Changes:
// - The function is now synchronous (it used to by async)
// - The function now handles custom NextJS distDir

const { join }        = require("path")
const fse             = require("fs-extra")
const isDynamicRoute  = require("./serverless-next.js/isDynamicRoute")
const getSortedRoutes = require("./serverless-next.js/sortedRoutes")


function readPagesManifest({ nextDistDir }) {
  const path = join(nextDistDir, "/serverless/pages-manifest.json");
  const hasServerlessPageManifest = fse.existsSync(path);

  if (!hasServerlessPageManifest) {
    throw "pages-manifest not found. Check if `next.config.js` target is set to 'serverless'"
  }

  const pagesManifest = fse.readJSONSync(path);
  const pagesManifestWithoutDynamicRoutes = Object.keys(pagesManifest).reduce(
    (acc, route) => {
      if (isDynamicRoute(route)) {
        return acc;
      }

      acc[route] = pagesManifest[route];
      return acc;
    },
    {}
  );

  const dynamicRoutedPages = Object.keys(pagesManifest).filter(
    isDynamicRoute
  );
  const sortedDynamicRoutedPages = getSortedRoutes(dynamicRoutedPages);

  const sortedPagesManifest = pagesManifestWithoutDynamicRoutes;

  sortedDynamicRoutedPages.forEach(route => {
    sortedPagesManifest[route] = pagesManifest[route];
  });

  return sortedPagesManifest;
}

module.exports = readPagesManifest
