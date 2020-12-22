const i18n = require("./getI18n")();
const { defaultLocale } = i18n;

// In i18n projects, we need to create redirects from the "naked" route
// to the defaultLocale-prepended route i.e. /static -> /en/static
// Note: there can only one defaultLocale, but we put it in an array to simplify
// logic in redirects.js files via concatenation
const getDefaultLocaleRedirectForI18n = (route, srcRoute, target) => {
  // If no i18n, skip
  if (!defaultLocale) return [];

  const routePieces = route.split("/");
  const routeLocale = routePieces[1];
  if (routeLocale === defaultLocale) {
    const nakedRoute =
      route === `/${routeLocale}` ? "/" : route.replace(`/${routeLocale}`, "");
    // const nakedRoute = routePieces.slice(2, routePieces.length).join("/");
    return [
      {
        route: nakedRoute,
        target: target || route,
      },
    ];
  }

  return [];
};

module.exports = getDefaultLocaleRedirectForI18n;
