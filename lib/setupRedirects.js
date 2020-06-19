const path                        = require('path')
const { join }                    = path
const { existsSync, readFileSync,
        writeFileSync }           = require('fs-extra')
const { default: isDynamicRoute } = require("@sls-next/lambda-at-edge/dist/lib/isDynamicRoute")
const { getSortedRoutes }         = require("@sls-next/lambda-at-edge/dist/lib/sortedRoutes")
const { NETLIFY_PUBLISH_PATH,
        CUSTOM_REDIRECTS_PATH }   = require('./config')
const allNextJsPages              = require('./allNextJsPages')
const getNetlifyRoute             = require('./getNetlifyRoute')
const getNetlifyFunctionName      = require('./getNetlifyFunctionName')

// Setup _redirects file that routes all requests to the appropriate location:
// Either the relevant Netlify function or one of the pre-rendered HTML pages.
const setupRedirects = () => {
  console.log("\x1b[1m🔀 Setting up redirects\x1b[22m")

  // Identify static and dynamically routed pages
  const staticPages   = allNextJsPages.filter(({ route }) => !isDynamicRoute(route))
  const dynamicPages  = allNextJsPages.filter(({ route }) =>  isDynamicRoute(route))

  // Sort dynamic pages by route: More-specific routes precede less-specific
  // routes
  const dynamicRoutes       = dynamicPages.map(page => page.route)
  const sortedDynamicRoutes = getSortedRoutes(dynamicRoutes)
  const sortedDynamicPages  = dynamicPages.sort((a, b) => (
    sortedDynamicRoutes.indexOf(a.route) - sortedDynamicRoutes.indexOf(b.route)
  ))

  // Assemble sorted pages: static pages first, then sorted dynamic pages
  const sortedPages = [...staticPages, ...sortedDynamicPages]

  // Generate redirects as array
  const redirects = []
  if(existsSync(CUSTOM_REDIRECTS_PATH)) {
    console.log("  ", "# Prepending custom redirects")
    redirects.push(readFileSync(CUSTOM_REDIRECTS_PATH))
  }
  redirects.push("# Next-on-Netlify Redirects")

  sortedPages.forEach(page => {
    // Generate redirect for each page route
    page.routesAsArray.forEach(route => {
      let to
      const from = getNetlifyRoute(route)

      // SSR pages
      if(page.isSsr()) {
        to = `/.netlify/functions/${getNetlifyFunctionName(page.filePath)}`
      }
      // SSG pages
      else if (page.isSsg()) {
        to = page.htmlFile
      }
      // SSG fallback pages (for non pre-rendered paths)
      else if (page.isSsgFallback()) {
        to = `/.netlify/functions/${getNetlifyFunctionName(page.filePath)}`
      }
      // Pre-rendered HTML pages
      else if (page.isHtml()) {
        to = `/${path.relative("pages", page.filePath)}`
      }

      // Assemble redirect
      const redirect = `${from}  ${to}  200`
      console.log("  ", redirect)

      redirects.push(redirect)
    })
  })

  // Write redirects to _redirects file
  writeFileSync(
    join(NETLIFY_PUBLISH_PATH, "_redirects"),
    redirects.join("\n")
  )
}

module.exports = setupRedirects
