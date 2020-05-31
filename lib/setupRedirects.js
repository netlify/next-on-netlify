const path                                      = require('path')
const { join }                                  = path
const { copySync, readJSONSync, writeFileSync } = require('fs-extra')
const { default: isDynamicRoute }               = require("@sls-next/lambda-at-edge/dist/lib/isDynamicRoute")
const { getSortedRoutes }                       = require("@sls-next/lambda-at-edge/dist/lib/sortedRoutes")
const { NEXT_DIST_DIR, NETLIFY_PUBLISH_PATH }   = require('./config')
const getNetlifyRoute                           = require('./getNetlifyRoute')
const getNetlifyFunctionName                    = require('./getNetlifyFunctionName')

// Setup _redirects file that routes all requests to the appropriate location:
// Either the relevant Netlify function or one of the pre-rendered HTML pages.
const setupRedirects = () => {
  console.log("\x1b[1m🔀 Setting up redirects\x1b[22m")

  // Read pages manifest that tells us which pages exist
  const pagesManifest = readJSONSync(
    join(NEXT_DIST_DIR, "serverless", "pages-manifest.json")
  )

  // Sort routes: Static routes come first, then dynamic and catch-all routes,
  // so that more-specific routes precede less-specific routes
  const routes              = Object.keys(pagesManifest)
  const staticRoutes        = routes.filter(route => !isDynamicRoute(route))
  const dynamicRoutes       = routes.filter(route =>  isDynamicRoute(route))
  const sortedDynamicRoutes = getSortedRoutes(dynamicRoutes)
  const sortedRoutes        = [...staticRoutes, ...sortedDynamicRoutes]

  // Get sorted pages
  const sortedPages = sortedRoutes.map(route => ({
    route: route,
    file:  pagesManifest[route]
  }))

  // Remove framework pages, such as _app.js and _error.js
  const sortedPagesWithoutFrameworkPages = sortedPages.filter(({ file }) => (
    file !== "pages/_app.js"      &&
    file !== "pages/_document.js" &&
    file !== "pages/_error.js"
  ))

  // Generate redirects as array of objects { from: ..., to: ...}
  const redirects = sortedPagesWithoutFrameworkPages.map(({ route, file }) => {
    let to
    const from = getNetlifyRoute(route)

    // SSR pages
    if(file.endsWith('.js')) {
      to = `/.netlify/functions/${getNetlifyFunctionName(file)}`
    }
    // Pre-rendered HTML pages
    else if (file.endsWith('.html')) {
      to = `/${path.relative("pages", file)}`
    }
    // This should not happen!
    else {
      throw `Tried to generate redirect for ${file}, but could not identify type.`
    }

    // Assemble redirect
    const redirect = `${from}  ${to}  200`
    console.log("  ", redirect)

    return redirect
  })

  // Write redirects to _redirects file
  writeFileSync(
    join(NETLIFY_PUBLISH_PATH, "_redirects"),
    "# Next-on-Netlify Redirects" + "\n" +
    redirects.join("\n")
  )
}

module.exports = setupRedirects
