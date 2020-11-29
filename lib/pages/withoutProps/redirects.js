const isDynamicRoute = require("../../helpers/isDynamicRoute");
const pages = require("./pages");
const getNextConfig = require("../../helpers/getNextConfig");

const redirects = [];

const nextConfig = getNextConfig();

pages.forEach(({ route, filePath }) => {
  // If i18n, need to accommodate for defaultLocale
  if (nextConfig.i18n) {
    const { defaultLocale } = nextConfig.i18n;
    // For example, '/en/some/path -> 'en'
    const routeLocale = route.split("/")[1];
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

  // Only create redirects for pages with dynamic routing
  if (!isDynamicRoute(route)) return;

  redirects.push({
    route,
    target: filePath.replace(/pages/, ""),
  });
});

module.exports = redirects;
