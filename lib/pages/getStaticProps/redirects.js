const { join } = require("path");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getDataRouteForRoute = require("../../helpers/getDataRouteForRoute");
const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const nextConfig = require("../../helpers/getNextConfig")();
const getPrerenderManifest = require("../../helpers/getPrerenderManifest");
const pages = require("./pages");

// Pages with getStaticProps (without fallback or revalidation) only need
// redirects for handling preview mode
const redirects = [];

/** getStaticProps pages
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

// Used for i18n to prevent adding repeat srcRoute redirects
const dynamicDefaultLocaleRedirectsAdded = [];
const dynamicLocaleSrcRoutesAdded = [];

const { dynamicRoutes } = getPrerenderManifest();
const isFallbackRoute = (srcRoute) => {
  return dynamicRoutes[srcRoute] && !!dynamicRoutes[srcRoute].fallback;
};

pages.forEach(({ route, dataRoute, srcRoute }) => {
  const relativePath = getFilePathForRoute(srcRoute || route, "js");
  const filePath = join("pages", relativePath);
  const functionName = getNetlifyFunctionName(filePath);

  const conditions = ["Cookie=__prerender_bypass,__next_preview_data"];
  const target = `/.netlify/functions/${functionName}`;

  if (nextConfig.i18n) {
    const { defaultLocale, locales = [] } = nextConfig.i18n;
    const isDynamic = !!srcRoute;
    if (!isDynamic) {
      // Preview mode redirect for standard route (no locale)
      redirects.push({
        route,
        target,
        force: false, // force FALSE to allow collision with defaultLocale redirect below
        conditions,
      });
      // Add a redirect for "expected" route to the defaultLocale-prepended route
      // i.e. /getStaticProps -> /en/getStaticProps
      redirects.push({
        route,
        target: `/${defaultLocale}${route}`,
      });
      // Add a preview mode redirect for every locale
      locales.forEach((locale) => {
        const pageRoute = `/${locale}${route}`;
        redirects.push({
          route: pageRoute,
          target,
          force: true,
          conditions,
        });
        redirects.push({
          route: getDataRouteForRoute(route, locale),
          target,
          force: true,
          conditions,
        });
      });
    } else {
      // This is where it gets unfortunately messy:
      // Dynamic routes for this page type still need a defaultLocale redirect
      // i.e. /getStaticProps/23 -> /en/getStaticProps/23
      // BUT we only have to do this *once* per srcRoute (within this pages loop)
      // so we track the srcRoutes we've already added redirects for
      // Also skip fallback srcRoutes, not needed because getStaticPropsWithFallback
      // logic will add this redirect
      if (
        defaultLocale &&
        !dynamicDefaultLocaleRedirectsAdded.includes(srcRoute) &&
        !isFallbackRoute(srcRoute)
      ) {
        redirects.push({
          route: srcRoute,
          target,
          force: false, // force FALSE to allow collision with defaultLocale redirect below
          conditions,
        });
        const formattedSrcRoute = srcRoute.replace("[", ":").replace("]", "");
        const defaultLocaleTarget = `/${defaultLocale}${formattedSrcRoute}`;
        redirects.push({
          route: srcRoute,
          target: defaultLocaleTarget,
        });
        dynamicDefaultLocaleRedirectsAdded.push(srcRoute);
      }
      // Now we want to add a preview mode redirect but only once for each locale/srcRoute
      // For example, we may have multiple paths of the same dynamic route with the same locale
      // i.e. /en/getStaticProps/7, /en/getStaticProps/8, /fr/getStaticProps/1, /fr/getStaticProps/2
      // BUT we only need redirects in that example for:
      // /en/getStaticProps/:id -> target and /fr/getStaticProps/:id
      // The reason we can't loop over locales like in other page types is because
      // *only* locales specified in getStaticPaths for dynamic getStaticProps pages
      // are prerendered and included in this array of pages; that said, if we used
      // i18n.locales, we could be adding redirects for locales that aren't actually
      // defined in getStaticPaths and thus aren't actually prerendered
      const routeLocale = route.split("/")[1];
      const srcRouteWithLocale = `/${routeLocale}${srcRoute}`;
      if (!dynamicLocaleSrcRoutesAdded.includes(srcRouteWithLocale)) {
        redirects.push({
          route: srcRouteWithLocale,
          target,
          force: true,
          conditions,
        });

        if (!isFallbackRoute(srcRoute)) {
          redirects.push({
            route: getDataRouteForRoute(srcRoute, routeLocale),
            target,
            force: true,
            conditions,
          });
        }
        dynamicLocaleSrcRoutesAdded.push(srcRouteWithLocale);
      }
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
