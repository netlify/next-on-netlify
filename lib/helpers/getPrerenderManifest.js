const { join } = require("path");
const { readJSONSync } = require("fs-extra");
const { NEXT_DIST_DIR } = require("../config");
const nextConfig = require("./getNextConfig")();
const getDataRouteForRoute = require("./getDataRouteForRoute");

const transformManifestForI18n = (manifest) => {
  const { routes, dynamicRoutes } = manifest;
  const { defaultLocale, locales } = nextConfig.i18n;
  const newRoutes = {};
  Object.entries(routes).forEach(
    ([route, { dataRoute, initialRevalidateSeconds, srcRoute }]) => {
      const isDynamicRoute = !!srcRoute;
      if (isDynamicRoute) {
        newRoutes[route] = routes[route];
      } else {
        locales.forEach((locale) => {
          const routeWithPrependedLocale = `/${locale}${route}`;
          newRoutes[routeWithPrependedLocale] = {
            dataRoute: getDataRouteForRoute(route, locale),
            srcRoute: route,
            initialRevalidateSeconds: false,
          };
        });
      }
    }
  );
  const newDynamicRoutes = {};
  Object.entries(dynamicRoutes).forEach(([route, { dataRoute, fallback }]) => {
    newDynamicRoutes[route] = {
      route,
      dataRoute: getDataRouteForRoute(route, defaultLocale),
      fallback,
    };
  });

  return { ...manifest, routes: newRoutes, dynamicRoutes: newDynamicRoutes };
};

const getPrerenderManifest = () => {
  const manifest = readJSONSync(join(NEXT_DIST_DIR, "prerender-manifest.json"));
  if (nextConfig.i18n) return transformManifestForI18n(manifest);
  return manifest;
};

module.exports = getPrerenderManifest;
