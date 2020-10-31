const { join } = require("path");
const getFilePathForRoute = require("../../helpers/getFilePathForRoute");
const getNetlifyFunctionName = require("../../helpers/getNetlifyFunctionName");
const pages = require("./pages");

// Pages with getStaticProps (without fallback or revalidation) only need
// redirects for handling preview mode.

const redirects = [];

pages.forEach(({ route, dataRoute, srcRoute }) => {
  const relativePath = getFilePathForRoute(srcRoute || route, "js");
  const filePath = join("pages", relativePath);
  const functionName = getNetlifyFunctionName(filePath);

  const conditions = ["Cookie=__prerender_bypass,__next_preview_data"];
  const target = `/.netlify/functions/${functionName}`;

  // Add one redirect for the page, but only when the NextJS
  // preview mode cookies are present
  redirects.push({
    route,
    target,
    force: true,
    conditions,
  });

  // Add one redirect for the data route, same conditions
  redirects.push({
    route: dataRoute,
    target,
    force: true,
    conditions,
  });
});

module.exports = redirects;
