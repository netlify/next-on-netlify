const isDynamicRoute = require("../../helpers/isDynamicRoute");
const pages = require("./pages");

const redirects = [];

pages.forEach(({ route, filePath }) => {
  // Only create redirects for pages with dynamic routing
  if (!isDynamicRoute(route)) return;

  redirects.push({
    route,
    target: filePath.replace(/pages/, ""),
  });
});

module.exports = redirects;
