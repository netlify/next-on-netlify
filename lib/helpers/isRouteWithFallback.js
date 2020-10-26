const getPrerenderManifest = require("./getPrerenderManifest");

const { dynamicRoutes } = getPrerenderManifest();

const isRouteWithFallback = (route) => {
  return route && dynamicRoutes[route].fallback;
};

module.exports = isRouteWithFallback;
