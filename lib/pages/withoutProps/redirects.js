const getDefaultLocaleRedirectForI18n = require("../../helpers/getDefaultLocaleRedirectForI18n");
const isDynamicRoute = require("../../helpers/isDynamicRoute");
const pages = require("./pages");

let redirects = [];

/** withoutProps pages
 *
 * Page params {
const getDefaultLocaleRedirectForI18n = require("../../helpers/getDefaultLocaleRedirectForI18n");
 *    route -> '/about', '/initial/[id]'
 *    filePath -> 'pages/about.html', 'pages/initial[id].html'
 * }
 *
 * Page params in i18n {
 *    route -> '/en/about', '/fr/initial/[id]'
 *    filePath -> 'pages/en/about.html', 'pages/fr/initial[id].html'
 * }
 **/

pages.forEach(({ route, filePath }) => {
  const target = filePath.replace(/pages/, "");

  // Add redirect for naked route -> `${defaultLocale}/redirect` (if i18n)
  redirects = redirects.concat(
    getDefaultLocaleRedirectForI18n(route, null, target)
  );

  // Only create normal redirects for pages with dynamic routing
  if (!isDynamicRoute(route)) return;

  redirects.push({
    route,
    target: filePath.replace(/pages/, ""),
  });
});

module.exports = redirects;
