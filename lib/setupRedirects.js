const path = require("path");
const { join } = path;
const { existsSync, readFileSync, writeFileSync } = require("fs-extra");
const {
  default: isDynamicRoute,
} = require("@sls-next/lambda-at-edge/dist/lib/isDynamicRoute");
const {
  getSortedRoutes,
} = require("@sls-next/lambda-at-edge/dist/lib/sortedRoutes");
const { logTitle, logItem } = require("./logger");
const { NETLIFY_PUBLISH_PATH, CUSTOM_REDIRECTS_PATH } = require("./config");
const allNextJsPages = require("./allNextJsPages");
const getNetlifyRoute = require("./getNetlifyRoute");
const getNetlifyFunctionName = require("./getNetlifyFunctionName");

// Setup _redirects file that routes all requests to the appropriate location:
// Either the relevant Netlify function or one of the pre-rendered HTML pages.
const setupRedirects = () => {
  logTitle("🔀 Setting up redirects");

  // Step 1: Collect custom redirects defined by the user
  const customRedirects = [];
  if (existsSync(CUSTOM_REDIRECTS_PATH)) {
    logItem("# Prepending custom redirects");
    customRedirects.push(readFileSync(CUSTOM_REDIRECTS_PATH));
  }

  // Step 2: Generate redirects for NextJS pages

  // Identify pages that require redirects:
  // If the page is statically routed and the page is HTML or SSG, we do not
  // need to add an entry to the redirects file. Netlify automatically routes to
  // these static pages.
  // See: https://github.com/netlify/next-on-netlify/issues/26
  const pagesNeedingRedirect = allNextJsPages.filter(
    (page) => isDynamicRoute(page.route) || page.isSsr() || page.isSsgFallback()
  );

  // Identify static and dynamically routed pages
  const staticPages = pagesNeedingRedirect.filter(
    ({ route }) => !isDynamicRoute(route)
  );
  const dynamicPages = pagesNeedingRedirect.filter(({ route }) =>
    isDynamicRoute(route)
  );

  // Sort dynamic pages by route: More-specific routes precede less-specific
  // routes
  const dynamicRoutes = dynamicPages.map((page) => page.route);
  const sortedDynamicRoutes = getSortedRoutes(dynamicRoutes);
  const sortedDynamicPages = dynamicPages.sort(
    (a, b) =>
      sortedDynamicRoutes.indexOf(a.route) -
      sortedDynamicRoutes.indexOf(b.route)
  );

  // Assemble sorted pages: static pages first, then sorted dynamic pages
  const sortedPages = [...staticPages, ...sortedDynamicPages];

  // Generate redirects for nextJS pages
  const nextOnNetlifyRedirects = [];
  sortedPages.forEach((page) => {
    // Generate redirect for each page route
    page.routesAsArray.forEach((route) => {
      let to;
      const from = getNetlifyRoute(route);

      // SSR pages
      if (page.isSsr()) {
        to = `/.netlify/functions/${getNetlifyFunctionName(page.filePath)}`;
      }
      // SSG pages
      else if (page.isSsg()) {
        to = page.htmlFile;
      }
      // SSG fallback pages (for non pre-rendered paths)
      else if (page.isSsgFallback()) {
        to = `/.netlify/functions/${getNetlifyFunctionName(page.filePath)}`;
      }
      // Pre-rendered HTML pages
      else if (page.isHtml()) {
        to = `/${path.relative("pages", page.filePath)}`;
      }

      // Assemble redirect
      const redirect = `${from}  ${to}  200`;
      logItem(redirect);

      nextOnNetlifyRedirects.push(redirect);
    });
  });

  // Step 3: Combine redirects into one single array
  const redirects = customRedirects;
  if (nextOnNetlifyRedirects.length)
    redirects.push("# Next-on-Netlify Redirects", ...nextOnNetlifyRedirects);

  // Write redirects to _redirects file
  writeFileSync(join(NETLIFY_PUBLISH_PATH, "_redirects"), redirects.join("\n"));
};

module.exports = setupRedirects;
