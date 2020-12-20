const { join } = require("path");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getDataRouteForRoute = require("../../helpers/getDataRouteForRoute");
const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const pages = require("./pages");
const nextConfig = require("../../helpers/getNextConfig")();

const redirects = [];

/** getStaticProps with revalidate pages
 *
 * Params:
 * route examples -> '/getStaticProps', '/getStaticProps/3'
 * dataRoute examples -> '/_next/data/{BUILD_ID}/getStaticProps.json', '_next/data/{BUILD_ID}/getStaticProps/3.json'
 * srcRoute examples -> null, /getStaticProps/[id]
 *
 * With i18n enabled:
 * route examples -> '/getStaticProps', '/en/getStaticProps/3'
 * dataRoute examples -> '/_next/data/{BUILD_ID}/getStaticProps.json', '_next/data/{BUILD_ID}/en/getStaticProps/3.json'
 * srcRoute examples -> null, /getStaticProps/[id]
 *
 **/

// Used for i18n to prevent added repeat srcRoute redirects
const i18nSrcRouteRedirectsAdded = [];
const dynamicLocaleSrcRoutesAdded = [];

pages.forEach(({ route, srcRoute, dataRoute }) => {
  const relativePath = getFilePathForRoute(srcRoute || route, "js");
  const filePath = join("pages", relativePath);
  const functionName = getNetlifyFunctionName(filePath);
  const target = `/.netlify/functions/${functionName}`;

  if (nextConfig.i18n) {
    const { defaultLocale, locales = [] } = nextConfig.i18n;
    const isDynamic = !!srcRoute;
    if (!isDynamic) {
      // As explained in getStaticProps/setup.js, these page types that are not
      // dynamic don't include the locale by default, so we can add this redirect normally
      // as the "default"; if we were doing ISR correctly, this target might point to the
      // defaultLocale/htmlPath instead of the function, but we're not yet, so, rip
      redirects.push({
        route,
        target,
      });
      // Add a redirect for each locale
      locales.forEach((locale) => {
        const localePreprendedRoute = `/${locale}${route}`;
        redirects.push({
          route: localePreprendedRoute,
          target,
        });
        // Add a redirect for each dataRoute per locale
        redirects.push({
          route:
            route === "/"
              ? getDataRouteForRoute(`/${locale}`)
              : getDataRouteForRoute(route, locale),
          target,
        });
      });
    } else {
      // We only want to add a redirect once per srcRoute (instead of adding a
      // redirect for every single prerendered id/slug
      if (!i18nSrcRouteRedirectsAdded.includes(srcRoute)) {
        redirects.push({
          route: srcRoute,
          target,
        });
        redirects.push({
          route: getDataRouteForRoute(srcRoute, defaultLocale),
          target,
        });
        i18nSrcRouteRedirectsAdded.push(srcRoute);
      }

      // Add a redirect but only ONCE per locale/srcRoute
      // i.e. for routes /en/reval/7, /en/reval/8, we only need
      // one redirect from /en/reval/:id -> target
      const routeLocale = route.split("/")[1];
      const srcRouteWithLocale = `/${routeLocale}${srcRoute}`;
      if (!dynamicLocaleSrcRoutesAdded.includes(srcRouteWithLocale)) {
        redirects.push({
          route: srcRouteWithLocale,
          target,
        });
        dynamicLocaleSrcRoutesAdded.push(srcRouteWithLocale);
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
