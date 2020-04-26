// Adapted from serverless-next.js (v1.8.0)
// See original file in serverless-next.js folder.
// Changes:
// - Function is now collectNextjsPages (was prepareBuildManifests)
// - Function is now synchronous (used to be async)
// - Ignore API routes/pages
// - Public files are not tracked in manifest
// - Structure is an array of objects (was an object of objects)
// - Function now handles custom NextJS distDir

const readPagesManifest       = require('./readPagesManifest')
const getNetlifyRoute         = require('./getNetlifyRoute')
const isDynamicRoute          = require("./serverless-next.js/isDynamicRoute")
const expressifyDynamicRoute  = require("./serverless-next.js/expressifyDynamicRoute")
const pathToRegexStr          = require("./serverless-next.js/pathToRegexStr")

const isHtmlPage              = p => p.endsWith(".html");

function collectNextjsPages({ nextDistDir }) {
  const pagesManifest = readPagesManifest({ nextDistDir });

  const pages = Object.entries(pagesManifest)

  return pages.map(([route, pageFile]) => {

    // For each page, add an entry to our manifest
    const page = {
      // path to the page (/pages/about)
      file: pageFile,
      // whether the page includes dynamic URL parameters (/posts/[id])
      isDynamic: isDynamicRoute(route),
      // whether the page is HTML (does not use getInitialProps)
      isHTML: isHtmlPage(pageFile)
    }

    // Route to the page (/about)
    // If the page is dynamic, use url segments: /posts/[id] --> /posts/:id
    page.route = page.isDynamic ? getNetlifyRoute(route) :route

    // Regex for matching the page (/^\/about$/)
    // NOTE: This route is different than the Netlify route set above!
    //       They are very similar, but not the same. See getNetlifyRoute.js for
    //       more information.
    const _route = page.isDynamic ? expressifyDynamicRoute(route) : route
    page.regex = pathToRegexStr(_route)

    return page
  })
}

module.exports = collectNextjsPages
