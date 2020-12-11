const { join } = require("path");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const pages = require("./pages");

const getNextConfig = require("../../helpers/getNextConfig");

const redirects = [];

const nextConfig = getNextConfig();

const srcRouteRedirectsAdded = [];
const dynamicLocalesAdded = [];

pages.forEach(({ route, srcRoute, dataRoute }) => {
  const relativePath = getFilePathForRoute(srcRoute || route, "js");
  const filePath = join("pages", relativePath);
  const functionName = getNetlifyFunctionName(filePath);
  const target = `/.netlify/functions/${functionName}`;

  if (nextConfig.i18n) {
    const { defaultLocale, locales } = nextConfig.i18n;
    const isNotDynamic = !srcRoute;
    if (isNotDynamic) {
      if (defaultLocale) {
        // lol... /reval -> /:function
        redirects.push({
          route,
          target,
        });
      }
      locales.forEach((locale) => {
        const pageRoute = `/${locale}${route}`;
        redirects.push({
          route: pageRoute,
          target,
        });
      });
      redirects.push({
        route: dataRoute,
        target,
      });
    } else {
      // Add a redirect for each srcRoute
      if (!srcRouteRedirectsAdded.includes(srcRoute)) {
        redirects.push({
          route: srcRoute,
          target,
        });
        redirects.push({
          route: dataRoute,
          target,
        });
        srcRouteRedirectsAdded.push(srcRoute);
      }

      const routeLocale = route.split("/")[1];
      if (!dynamicLocalesAdded.includes(routeLocale)) {
        redirects.push({
          route: `/${routeLocale}${srcRoute}`,
          target,
        });
        dynamicLocalesAdded.push(routeLocale);
      }
    }
  } else {
    // Add one redirect for the page
    redirects.push({
      route,
      target,
    });

    // Add one redirect for the data route
    redirects.push({
      route: dataRoute,
      target,
    });
  }
});

module.exports = redirects;
