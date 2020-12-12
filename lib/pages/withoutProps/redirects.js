const isDynamicRoute = require("../../helpers/isDynamicRoute");
const pages = require("./pages");
const nextConfig = require("../../helpers/getNextConfig")();

const redirects = [];

/** withoutProps pages
 *
 * Params:
 * route examples -> '/about', '/initial/[id]'
 * filePath examples -> 'pages/about.html', 'pages/initial[id].html'
 *
 * With i18n enabled:
 * route examples -> '/en/about', '/fr/initial/[id]'
 * filePath examples -> 'pages/en/about.html', 'pages/fr/initial[id].html'
 *
 **/

pages.forEach(({ route, filePath }) => {
  if (nextConfig.i18n) {
    // If i18n, need to direct "expected" route to defaultLocale-prepended route
    // because Next does not generate these "expected" routes in i18n
    // i.e. /about -> /en/about
    // i.e. /initial/:id -> /en/initial/:id
    const { defaultLocale } = nextConfig.i18n;
    if (defaultLocale) {
      const routeLocale = route.split("/")[1];
      // If the route is preprended with the defaultLocale
      // i.e. route is /en/about and defaultLocale is en
      if (routeLocale === defaultLocale) {
        const defaultLocaleRoute =
          route === `/${routeLocale}`
            ? "/"
            : route.replace(`/${routeLocale}`, "");
        redirects.push({
          route: defaultLocaleRoute,
          target: filePath.replace(/pages/, ""),
        });
      }
    }
  }

  // Only create redirects for pages with dynamic routing
  if (!isDynamicRoute(route)) return;

  redirects.push({
    route,
    target: filePath.replace(/pages/, ""),
  });
});

module.exports = redirects;
