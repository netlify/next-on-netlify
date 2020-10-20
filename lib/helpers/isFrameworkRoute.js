const { NEXT_FRAMEWORK_ROUTES } = require("../config");

// Return true if the route is one of the framework pages, such as _app or
// _error
const isFrameworkRoute = (route) => {
  return NEXT_FRAMEWORK_ROUTES.includes(route);
};

module.exports = isFrameworkRoute;
