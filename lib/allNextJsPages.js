const { join } = require("path");
const { readFileSync, readJSONSync } = require("fs-extra");
const { NEXT_DIST_DIR } = require("./config");

// Return all NextJS pages with route, file, type, and any other params
const getAllPages = () => {
  const pages = [];

  // Read pages manifest that tells us which SSR and HTML pages exist
  const ssrAndHtmlPages = readJSONSync(
    join(NEXT_DIST_DIR, "serverless", "pages-manifest.json")
  );

  // Read prerender manifest that tells us which SSG pages exist
  const {
    routes: staticSsgPages,
    dynamicRoutes: dynamicSsgPages,
  } = readJSONSync(join(NEXT_DIST_DIR, "prerender-manifest.json"));

  // Read routes manifest that tells us which data routes should exist
  const routesManifest = readJSONSync(
    join(NEXT_DIST_DIR, "routes-manifest.json")
  );
  const dataRoutes = routesManifest.dataRoutes || [];

  // Get build ID that is used for data routes, e.g. /_next/data/BUILD_ID/...
  const fileContents = readFileSync(join(NEXT_DIST_DIR, "BUILD_ID"));
  const buildId = fileContents.toString();

  // Parse SSR and HTML pages
  Object.entries(ssrAndHtmlPages).forEach(([route, filePath]) => {
    // Skip framework pages, such as _app and _error
    if (["/_app", "/_document", "/_error"].includes(route)) return;

    // Skip page if it is actually an SSG page
    const normalizedRoute = route === "/index" ? "/" : route;
    if (normalizedRoute in staticSsgPages || normalizedRoute in dynamicSsgPages)
      return;

    // Check if we already have a page pointing to this file
    // If so, just add the route
    const existingPage = pages.find((page) => page.filePath == filePath);
    if (existingPage) {
      existingPage.alternativeRoutes.push(route);
      return;
    }

    // Otherwise, create new page
    const type = filePath.endsWith(".html") ? "html" : "ssr";
    const alternativeRoutes = [];

    // Check if we have a data route for this page
    // This is relevant only for pages with getServerSideProps.
    // We need to add a second route for redirecting requests for
    // the JSON data to the Netlify Function.
    const dataRoute = dataRoutes.find(({ page }) => page === route);
    if (dataRoute)
      alternativeRoutes.push(join("/_next/data", buildId, `${route}.json`));

    pages.push(new Page({ route, type, filePath, alternativeRoutes }));
  });

  // Parse SSG pages
  Object.entries(staticSsgPages).forEach(([route, { dataRoute }]) => {
    pages.push(
      new Page({
        route,
        type: "ssg",
        dataRoute,
        alternativeRoutes: route === "/" ? ["/index"] : [],
      })
    );
  });
  Object.entries(dynamicSsgPages).forEach(
    ([route, { dataRoute, fallback }]) => {
      // Ignore pages without fallback, these are already handled by the
      // static SSG page block above
      if (fallback === false) return;

      const filePath = join("pages", `${route}.js`);
      pages.push(
        new Page({
          route,
          filePath,
          type: "ssg-fallback",
          alternativeRoutes: [dataRoute],
        })
      );
    }
  );

  return pages;
};

// Represent a NextJS page
class Page {
  constructor({ route, type, ...otherParams }) {
    this.alternativeRoutes = [];
    Object.assign(this, { route, type, ...otherParams });
  }

  isSsr() {
    return this.type === "ssr";
  }

  isHtml() {
    return this.type === "html";
  }

  isSsg() {
    return this.type === "ssg";
  }

  isSsgFallback() {
    return this.type === "ssg-fallback";
  }

  routeFile(ext) {
    return `${this.route.replace(/^\/$/, "/index")}${ext}`;
  }

  get htmlFile() {
    return this.routeFile(".html");
  }

  get jsonFile() {
    return this.routeFile(".json");
  }

  // Return route and alternative routes as array
  get routesAsArray() {
    return [this.route, ...this.alternativeRoutes];
  }
}

const allNextJsPages = getAllPages();

module.exports = allNextJsPages;
