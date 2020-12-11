const { join } = require("path");
const { readFileSync } = require("fs-extra");
const { NEXT_DIST_DIR } = require("../config");
const getFilePathForRoute = require("./getFilePathForRoute");

// Get build ID that is used for data routes, e.g. /_next/data/BUILD_ID/...
const fileContents = readFileSync(join(NEXT_DIST_DIR, "BUILD_ID"));
const buildId = fileContents.toString();

// Return the data route for the given route
const getDataRouteForRoute = (route, locale) => {
  const filePath = getFilePathForRoute(route, "json");

  if (locale) return `/_next/data/${buildId}/${locale}${filePath}`;
  return `/_next/data/${buildId}${filePath}`;
};

module.exports = getDataRouteForRoute;
