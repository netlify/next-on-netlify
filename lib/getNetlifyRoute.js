// Adapted from @sls-next/lambda-at-edge (v1.2.0-alpha.3)
// See: https://github.com/danielcondemarin/serverless-next.js/blob/57142970b08e6bc3faf0fc70749b3b0501ad7869/packages/lambda-at-edge/src/lib/expressifyDynamicRoute.ts#L4
// Changes:
// - The function now turns catch-all routes from /[...params] into /:*
//   The original turned catch-all routes from /[...params] into /:params*
//   The original does not work with Netlify routing.

// converts a nextjs dynamic route /[param]/ -> /:param
// also handles catch all routes /[...param]/ -> /:*
module.exports = dynamicRoute => {
  // replace any catch all group first
  const expressified = dynamicRoute.replace(/\[\.\.\.(.*)](.json)?$/, "*");

  // now replace other dynamic route groups
  return expressified.replace(/\[(.*?)]/g, ":$1");
};
