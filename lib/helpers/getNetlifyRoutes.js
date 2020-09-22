// Adapted from @sls-next/lambda-at-edge (v1.2.0-alpha.3)
// See: https://github.com/danielcondemarin/serverless-next.js/blob/57142970b08e6bc3faf0fc70749b3b0501ad7869/packages/lambda-at-edge/src/lib/expressifyDynamicRoute.ts#L4

const CATCH_ALL_REGEX = /\/\[\.{3}(.*)\](.json)?$/;
const OPTIONAL_CATCH_ALL_REGEX = /\/\[{2}\.{3}(.*)\]{2}(.json)?$/;
const DYNAMIC_PARAMETER_REGEX = /\/\[(.*?)\]/g;

// Convert dynamic NextJS routes into their Netlify-equivalent
// Note that file endings (.json) must be removed for catch-all and optional
// catch-all routes to work. That's why the regexes defined above include
// the (.json)? option
const getNetlifyRoutes = (nextRoute) => {
  let netlifyRoutes = [nextRoute];

  // If the route is an optional catch-all route, we need to add a second
  // Netlify route for the base path (when no parameters are present).
  // The file ending must be present!
  if (nextRoute.match(OPTIONAL_CATCH_ALL_REGEX)) {
    netlifyRoutes.push(nextRoute.replace(OPTIONAL_CATCH_ALL_REGEX, "$2"));
  }

  // Replace catch-all, e.g., [...slug]
  netlifyRoutes = netlifyRoutes.map((route) =>
    route.replace(CATCH_ALL_REGEX, "/:$1/*")
  );

  // Replace optional catch-all, e.g., [[...slug]]
  netlifyRoutes = netlifyRoutes.map((route) =>
    route.replace(OPTIONAL_CATCH_ALL_REGEX, "/*")
  );

  // Replace dynamic parameters, e.g., [id]
  netlifyRoutes = netlifyRoutes.map((route) =>
    route.replace(DYNAMIC_PARAMETER_REGEX, "/:$1")
  );

  return netlifyRoutes;
};

module.exports = getNetlifyRoutes;
