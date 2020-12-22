const i18n = require("./getI18n")();
const getDataRouteForRoute = require("./getDataRouteForRoute");

const getI18nDataRoute = (route, locale) => {
  return route === "/"
    ? getDataRouteForRoute(`/${locale}`)
    : getDataRouteForRoute(route, locale);
};

// In i18n projects, Next does not prepend static routes with locales
// so we have to do it manually
const getLocaleRoutesForI18n = ({ route, srcRoute }) => {
  // If no i18n or is dynamic route, skip
  if (!i18n.defaultLocale || !!srcRoute) return [];
  return i18n.locales.map((locale) => {
    return {
      route: `/${locale}${route}`,
      dataRoute: getI18nDataRoute(route, locale),
      nakedRoute: route,
    };
  });
};

module.exports = getLocaleRoutesForI18n;
