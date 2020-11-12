// Next apps with i18n have statically generated html for/under each locale
const getFilePathForRoute = require("./getFilePathForRoute");

const getFilePathForRouteWithI18n = (route, extension, locale) => {
  return `${locale}${getFilePathForRoute(route, extension)}`;
};

module.exports = getFilePathForRouteWithI18n;
