const getPrerenderManifest = require("./getPrerenderManifest");

const { dynamicRoutes } = getPrerenderManifest();

const isRouteWithFallback = (route) => {
  return dynamicRoutes[route] && dynamicRoutes[route].fallback;
};

module.exports = isRouteWithFallback;
