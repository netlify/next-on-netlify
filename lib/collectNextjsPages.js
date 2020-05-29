// Adapted from @sls-next/lambda-at-edge (v1.8.0)
// See: https://github.com/danielcondemarin/serverless-next.js/blob/e6732895da50d11dcd296da39d35671b1bd6a33b/packages/lambda-at-edge/src/build.ts
// Changes:
// - Function is now collectNextjsPages (was prepareBuildManifests)
// - Function is now synchronous (used to be async)
// - Ignore API routes/pages
// - Public files are not tracked in manifest
// - Structure is an array of objects (was an object of objects)
// - Function now handles custom NextJS distDir

const readPagesManifest                   = require('./readPagesManifest')
const getNetlifyRoute                     = require('./getNetlifyRoute')
const { default: isDynamicRoute }         = require("@sls-next/lambda-at-edge/dist/lib/isDynamicRoute")
const { default: expressifyDynamicRoute } = require("@sls-next/lambda-at-edge/dist/lib/expressifyDynamicRoute")
const { default: pathToRegexStr }         = require("@sls-next/lambda-at-edge/dist/lib/pathToRegexStr")
const isHtmlPage                          = p => p.endsWith(".html");

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
