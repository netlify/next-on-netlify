const getPrerenderManifest = require("./getPrerenderManifest");

const { dynamicRoutes } = getPrerenderManifest();

const isSourceRouteWithFallback = (srcRoute) => {
  return Object.entries(dynamicRoutes).some(
    ([route, { fallback }]) => route === srcRoute && fallback !== false
  );
};

module.exports = isSourceRouteWithFallback;
