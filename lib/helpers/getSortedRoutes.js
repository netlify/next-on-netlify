const {
  getSortedRoutes: getSortedRoutesFromSlsNext,
} = require("@sls-next/lambda-at-edge/dist/lib/sortedRoutes");

// Remove the file extension form the route
const removeFileExtension = (route) => route.replace(/\.[A-z]+$/, "");

// Return an array of routes sorted in order of specificity, i.e., more generic
// routes precede more specific ones
const getSortedRoutes = (routes) => {
  // The @sls-next getSortedRoutes does not correctly sort routes with file
  // endings (e.g., json), so we remove them before sorting and add them back
  // after sorting
  const routesWithoutExtensions = routes.map((route) =>
    removeFileExtension(route)
  );

  // Sort the "naked" routes
  const sortedRoutes = getSortedRoutesFromSlsNext(routesWithoutExtensions);

  // Return original routes in the sorted order
  return routes.sort(
    (routeA, routeB) =>
      sortedRoutes.indexOf(removeFileExtension(routeA)) -
      sortedRoutes.indexOf(removeFileExtension(routeB))
  );
};

module.exports = getSortedRoutes;
