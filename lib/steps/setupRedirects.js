const { join } = require("path");
const { existsSync, readFileSync, writeFileSync } = require("fs-extra");
const { logTitle, logItem } = require("../helpers/logger");
const { NETLIFY_PUBLISH_PATH, CUSTOM_REDIRECTS_PATH } = require("../config");
const getSortedRoutes = require("../helpers/getSortedRoutes");
const getNetlifyRoutes = require("../helpers/getNetlifyRoutes");

// Setup _redirects file that routes all requests to the appropriate location,
// such as one of the Netlify functions or one of the static files.
const setupRedirects = () => {
  logTitle("🔀 Setting up redirects");

  // Collect custom redirects defined by the user
  const redirects = [];
  if (existsSync(CUSTOM_REDIRECTS_PATH)) {
    logItem("# Prepending custom redirects");
    redirects.push(readFileSync(CUSTOM_REDIRECTS_PATH));
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

  // Assemble redirects for each route
  sortedRoutes.forEach((route) => {
    const nextRedirect = nextRedirects.find(
      (redirect) => redirect.route === route
    );

    // One route may map to multiple Netlify routes: e.g., catch-all pages
    // require two Netlify routes in the _redirects file
    getNetlifyRoutes(route).map((netlifyRoute) => {
      const redirect = `${netlifyRoute}  ${nextRedirect.target}  200`;
      logItem(redirect);
      redirects.push(redirect);
    });
  });

  // Write redirects to _redirects file
  writeFileSync(join(NETLIFY_PUBLISH_PATH, "_redirects"), redirects.join("\n"));
};

module.exports = setupRedirects;
