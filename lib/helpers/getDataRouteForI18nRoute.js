const { join } = require("path");
const { readFileSync } = require("fs-extra");
const { NEXT_DIST_DIR } = require("../config");
const getFilePathForRoute = require("./getFilePathForRoute");

// TO-DO: make more DRY with other getDataRoute helper

// Get build ID that is used for data routes, e.g. /_next/data/BUILD_ID/...
const fileContents = readFileSync(join(NEXT_DIST_DIR, "BUILD_ID"));
const buildId = fileContents.toString();

// Return the data route for the given route
const getDataRouteForI18nRoute = (route, locale) => {
  const filePath = getFilePathForRoute(route, "json");

  return join("/_next", "data", buildId, locale, filePath);
};

module.exports = getDataRouteForI18nRoute;
