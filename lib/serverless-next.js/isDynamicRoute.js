// Copied from serverless-next.js (v1.8.0)
// https://github.com/danielcondemarin/serverless-next.js/blob/master/packages/serverless-nextjs-component/lib/isDynamicRoute.js

module.exports = route => {
  // Identify /[param]/ in route string
  return /\/\[[^\/]+?\](?=\/|$)/.test(route);
};
