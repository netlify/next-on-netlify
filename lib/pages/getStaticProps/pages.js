const getPrerenderManifest = require("../../helpers/getPrerenderManifest");

// Collect pages
const pages = [];

// Get pages using getStaticProps
const { routes } = getPrerenderManifest();

// Parse pages
Object.entries(routes).forEach(
  ([route, { dataRoute, initialRevalidateSeconds }]) => {
    // Ignore pages with revalidate, these will need to be SSRed
    if (initialRevalidateSeconds) return;

    pages.push({
      route,
      dataRoute,
    });
  }
);

module.exports = pages;
