// Return true if the route uses dynamic routing (e.g., [id] or [...slug])
const isDynamicRoute = (route) => {
  return /\/\[[^\/]+?](?=\/|$)/.test(route);
};

module.exports = isDynamicRoute;
