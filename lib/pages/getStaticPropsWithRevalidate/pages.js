const getPrerenderManifest = require("../../helpers/getPrerenderManifest");

// Collect pages
const pages = [];

// Get pages using getStaticProps
const { routes, dynamicRoutes } = getPrerenderManifest();

// Parse pages
Object.entries(routes).forEach(
  ([route, { dataRoute, srcRoute, initialRevalidateSeconds }]) => {
    // Skip pages without revalidate, these are handled by getStaticProps/pages
    if (!initialRevalidateSeconds) return;

    // Skip pages with fallback, these are handled by
    // getStaticPropsWithFallback/pages
    if (srcRoute && dynamicRoutes[srcRoute].fallback) return;

    // Add the page
    pages.push({
      route,
      srcRoute,
      dataRoute,
    });
  }
);

module.exports = pages;
