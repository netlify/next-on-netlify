const { join }          = require('path')
const { readJSONSync }  = require('fs-extra')
const { NEXT_DIST_DIR } = require('./config')

// Return all NextJS pages with route, file, type, and any other params
const getAllPages = () => {
  const pages = []

  // Read pages manifest that tells us which SSR and HTML pages exist
  const ssrAndHtmlPages = readJSONSync(
    join(NEXT_DIST_DIR, "serverless", "pages-manifest.json")
  )

  // Read prerender manifest that tells us which SSG pages exist
  const { routes: ssgPages, dynamicRoutes: dynamicSsgPages } = readJSONSync(
    join(NEXT_DIST_DIR, "prerender-manifest.json")
  )

  // Parse SSR and HTML pages
  Object.entries(ssrAndHtmlPages).forEach(([route, filePath]) => {
    // Skip framework pages, such as _app and _error
    if(["/_app", "/_document", "/_error"].includes(route))
      return

    // Skip page if it is actually an SSG page
    if(route in ssgPages || route in dynamicSsgPages)
      return

    // Check if we already have a page pointing to this file
    // If so, just add the route
    const existingPage = pages.find(page => page.filePath == filePath)
    if(existingPage) {
      existingPage.alternativeRoutes.push(route)
      return
    }

    // Otherwise, create new page
    const type = filePath.endsWith(".html") ? "html" : "ssr"
    pages.push(new Page({ route, type, filePath }))
  })

  // Parse SSG pages
  Object.entries(ssgPages).forEach(([ route, { dataRoute }]) => {
    pages.push(new Page({ route, type: "ssg", dataRoute }))
  })

  return pages
}

// Represent a NextJS page
class Page {
  constructor({ route, type, ...otherParams }) {
    this.alternativeRoutes = []
    Object.assign(this, { route, type, ...otherParams })
  }

  isSsr() {
    return this.type === "ssr"
  }

  isHtml() {
    return this.type === "html"
  }

  isSsg() {
    return this.type === "ssg"
  }

  // Return route and alternative routes as array
  get routesAsArray() {
    return [this.route, ...this.alternativeRoutes]
  }
}

const allNextJsPages = getAllPages()

module.exports = allNextJsPages
