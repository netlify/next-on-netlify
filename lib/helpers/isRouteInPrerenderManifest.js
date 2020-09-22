const getPrerenderManifest = require("./getPrerenderManifest");

const { routes, dynamicRoutes } = getPrerenderManifest();

// Return true if the route is defined in the prerender manifest
const isRouteInPrerenderManifest = (route) => {
  return route in routes || route in dynamicRoutes;
};

module.exports = isRouteInPrerenderManifest;
