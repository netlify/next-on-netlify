const getDataRouteForRoute = require("./getDataRouteForRoute");

// Return the data route for the given route with the correct locale
const getDataRouteForI18nRoute = (route, locale) => {
  return getDataRouteForRoute(route, locale);
};

module.exports = getDataRouteForI18nRoute;
