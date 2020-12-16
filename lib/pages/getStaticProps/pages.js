const getPrerenderManifest = require("../../helpers/getPrerenderManifest");

// Collect pages
const pages = [];

// Get pages using getStaticProps
const { routes, dynamicRoutes } = getPrerenderManifest();

const isFallbackRoute = (srcRoute) => {
  return dynamicRoutes[srcRoute] && !!dynamicRoutes[srcRoute].fallback;
};

// Parse static pages
Object.entries(routes).forEach(
  ([route, { dataRoute, initialRevalidateSeconds, srcRoute }]) => {
    // Ignore pages with revalidate, these will need to be SSRed
    if (initialRevalidateSeconds) return;
    // Exclude routes with fallback, this is handled in getStaticPropsWithFallback
    if (isFallbackRoute(srcRoute)) return;

    pages.push({
      route,
      dataRoute,
      srcRoute,
    });
  }
);

module.exports = pages;
