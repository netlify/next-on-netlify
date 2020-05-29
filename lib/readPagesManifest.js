// Adapted from @sls-next/lambda-at-edge (v1.2.0-alpha.3)
// See: https://github.com/danielcondemarin/serverless-next.js/blob/e6732895da50d11dcd296da39d35671b1bd6a33b/packages/lambda-at-edge/src/build.ts
// Changes:
// - The function is now synchronous (it used to by async)
// - The function now handles custom NextJS distDir

const { join }                      = require("path")
const fse                           = require("fs-extra")
const { default: isDynamicRoute }   = require("@sls-next/lambda-at-edge/dist/lib/isDynamicRoute")
const { getSortedRoutes }  = require("@sls-next/lambda-at-edge/dist/lib/sortedRoutes")

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
