const { join } = require("path");
const { existsSync, readFileSync, writeFileSync } = require("fs-extra");
const { logTitle, logItem } = require("../helpers/logger");
const { CUSTOM_REDIRECTS_PATH } = require("../config");
const getSortedRoutes = require("../helpers/getSortedRoutes");
const getNetlifyRoutes = require("../helpers/getNetlifyRoutes");
const isRootCatchAllRedirect = require("../helpers/isRootCatchAllRedirect");

// Setup _redirects file that routes all requests to the appropriate location,
// such as one of the Netlify functions or one of the static files.
const setupRedirects = (publishPath) => {
  logTitle("🔀 Setting up redirects");

  // Collect custom redirects defined by the user
  const redirects = [];
  if (existsSync(CUSTOM_REDIRECTS_PATH)) {
    logItem("# Prepending custom redirects");
    redirects.push(readFileSync(CUSTOM_REDIRECTS_PATH, "utf8"));
  }

  // Collect redirects for NextJS pages
  const nextRedirects = [
    ...require("../pages/api/redirects"),
    ...require("../pages/getInitialProps/redirects"),
    ...require("../pages/getServerSideProps/redirects"),
    ...require("../pages/getStaticProps/redirects"),
    ...require("../pages/getStaticPropsWithFallback/redirects"),
    ...require("../pages/getStaticPropsWithRevalidate/redirects"),
    ...require("../pages/withoutProps/redirects"),
  ];

  // Add _redirect section heading
  if (nextRedirects.length >= 1) redirects.push("# Next-on-Netlify Redirects");

  // Sort routes: More-specific routes (e.g., static routing) precede
  // less-specific routes (e.g., catch-all)
  const sortedRoutes = getSortedRoutes(nextRedirects.map(({ route }) => route));

  // There may be several redirects with the same route but different targets
  const wasRedirectAdded = (redirect) => {
    return redirects.find((addedRedirect) => {
      const [route, target] = addedRedirect.split("  ");
      return redirect.route === route && redirect.target === target;
    });
  };

  // Assemble redirects for each route
  sortedRoutes.forEach((route) => {
    const nextRedirect = nextRedirects.find(
      (redirect) => redirect.route === route && !wasRedirectAdded(redirect)
    );

    // One route may map to multiple Netlify routes: e.g., catch-all pages
    // require two Netlify routes in the _redirects file
    getNetlifyRoutes(route).map((netlifyRoute) => {
      const {
        conditions = [],
        force = false,
        statusCode = "200",
        target,
      } = nextRedirect;
      const redirectPieces = [
        netlifyRoute,
        target,
        `${statusCode}${force ? "!" : ""}`,
        conditions.join("  "),
      ];
      const redirect = redirectPieces.join("  ").trim();
      logItem(redirect);
      redirects.push(redirect);
    });
  });

  // This takes care of this issue: https://github.com/netlify/next-on-netlify/issues/43
  // where the page chunk for a root level catch-all is served incorrectly to the client.
  // NOTE: Netlify is also investigating this issue internally.
  const hasRootCatchAll = redirects.some(isRootCatchAllRedirect);
  if (hasRootCatchAll) {
    const rootCatchAllIndex = redirects.findIndex(isRootCatchAllRedirect);
    // Add general "no-op" redirect before the root catch-all redirect
    redirects.splice(rootCatchAllIndex, 0, "/_next/*  /_next/:splat  200");
  }

  // Write redirects to _redirects file
  writeFileSync(join(publishPath, "_redirects"), redirects.join("\n"));
};

module.exports = setupRedirects;
