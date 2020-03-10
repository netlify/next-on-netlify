// Copied from serverless-next.js (v1.8.0)
// https://github.com/danielcondemarin/serverless-next.js/blob/master/packages/serverless-nextjs-component/lib/expressifyDynamicRoute.js

// converts a nextjs dynamic route /[param]/ -> /:param
// also handles catch all routes /[...param]/ -> /:param*
module.exports = dynamicRoute => {
  // replace any catch all group first
  let expressified = dynamicRoute.replace(/\[\.\.\.(.*)]$/, ":$1*");

  // now replace other dynamic route groups
  return expressified.replace(/\[(.*?)]/g, ":$1");
};
