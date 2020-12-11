const { join } = require("path");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getFilePathForRouteWithI18n = require("../../helpers/getFilePathForRouteWithI18n");
const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const getNextConfig = require("../../helpers/getNextConfig");
const pages = require("./pages");

// Pages with getStaticProps (without fallback or revalidation) only need
// redirects for handling preview mode.
const redirects = [];

const defaultLocaleRedirects = [];
const dynamicLocalesAdded = [];

pages.forEach(({ route, dataRoute, srcRoute }) => {
  const relativePath = getFilePathForRoute(srcRoute || route, "js");
  const filePath = join("pages", relativePath);
  const functionName = getNetlifyFunctionName(filePath);

  const conditions = ["Cookie=__prerender_bypass,__next_preview_data"];
  const target = `/.netlify/functions/${functionName}`;

  const nextConfig = getNextConfig();
  if (nextConfig.i18n) {
    const { defaultLocale, locales } = nextConfig.i18n;
    const isNotDynamic = !srcRoute;
    if (isNotDynamic) {
      if (defaultLocale) {
        redirects.push({
          route,
          target: `/${defaultLocale}${route}`,
        });
      }
      locales.forEach((locale) => {
        const pageRoute = `/${locale}${route}`;
        redirects.push({
          route: pageRoute,
          target,
          force: true,
          conditions,
        });
      });
      // Data routes are consistent across locale so it can be outside of the loop
      redirects.push({
        route: dataRoute,
        target,
        force: true,
        conditions,
      });
    } else {
      if (defaultLocale && !defaultLocaleRedirects.includes(srcRoute)) {
        // Add redirect for /normal/:id -> /defaultLocale/normal/:id
        redirects.push({
          route: srcRoute,
          target: `/${defaultLocale}${srcRoute
            .replace("[", ":")
            .replace("]", "")}`,
        });
        defaultLocaleRedirects.push(srcRoute);
      }
      const routeLocale = route.split("/")[1];
      const srcRouteWithLocale = `/${routeLocale}${srcRoute}`;
      if (!dynamicLocalesAdded.includes(srcRouteWithLocale)) {
        // Add one redirect for the page, but only when the NextJS
        // preview mode cookies are present
        redirects.push({
          route: srcRouteWithLocale,
          target,
          force: true,
          conditions,
        });

        dynamicLocalesAdded.push(srcRouteWithLocale);
      }

      // Add one redirect for the data route, same conditions
      redirects.push({
        route: dataRoute,
        target,
        force: true,
        conditions,
      });
    }
  } else {
    // Add one redirect for the page, but only when the NextJS
    // preview mode cookies are present
    redirects.push({
      route,
      target,
      force: true,
      conditions,
    });

    // Add one redirect for the data route, same conditions
    redirects.push({
      route: dataRoute,
      target,
      force: true,
      conditions,
    });
  }
});

module.exports = redirects;
