// Original function from serverless-next.js (v1.8.0)
// https://github.com/danielcondemarin/serverless-next.js/blob/master/packages/serverless-nextjs-component/serverless.js
// This file is for reference purposes only.

async readPagesManifest(nextConfigPath) {
  const path = join(nextConfigPath, ".next/serverless/pages-manifest.json");
  const hasServerlessPageManifest = await fse.exists(path);

  if (!hasServerlessPageManifest) {
    return Promise.reject(
      "pages-manifest not found. Check if `next.config.js` target is set to 'serverless'"
    );
  }

  const pagesManifest = await fse.readJSON(path);
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
