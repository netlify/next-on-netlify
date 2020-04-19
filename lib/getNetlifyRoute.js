// Adapted from serverless-next.js (v1.9.10)
// https://github.com/danielcondemarin/serverless-next.js/blob/master/packages/serverless-nextjs-component/lib/expressifyDynamicRoute.js
// The original turns catch-all routes from /[...params] into /:params*
// This adaptation turns catch-all routes from /[...params] into /:*
// This is necessary for it to work with Netlify routing.

// converts a nextjs dynamic route /[param]/ -> /:param
// also handles catch all routes /[...param]/ -> /:*
module.exports = dynamicRoute => {
  // replace any catch all group first
  let expressified = dynamicRoute.replace(/\[\.\.\.(.*)]$/, "*");

  // now replace other dynamic route groups
  return expressified.replace(/\[(.*?)]/g, ":$1");
};
