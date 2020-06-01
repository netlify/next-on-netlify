const path                                              = require('path')
const { join }                                          = path
const { copySync, existsSync, readJSONSync }            = require('fs-extra')
const { NEXT_DIST_DIR, NETLIFY_PUBLISH_PATH }           = require('./config')

// Identify all pages that require server-side rendering and create a separate
// Netlify Function for every page.
const setupSsgPages = () => {
  console.log(`\x1b[1m🔥 Setting up SSG pages\x1b[22m`)

  // Read prerender manifest that tells us which SSG pages exist
  const { routes } = readJSONSync(
    join(NEXT_DIST_DIR, "prerender-manifest.json")
  )

  // Copy pre-rendered SSG pages to Netlify publish folder
  console.log("  ", "1. Copying pre-rendered SSG pages to", NETLIFY_PUBLISH_PATH)

  Object.keys(routes).forEach(route => {
    const filePath = join("pages", `${route}.html`)
    console.log("  ", "  ", filePath)

    copySync(
      join(NEXT_DIST_DIR,         "serverless",     filePath),
      join(NETLIFY_PUBLISH_PATH,  `${route}.html`),
      {
        overwrite: false,
        errorOnExist: true
      }
    )
  })

  // Copy SSG page data to _next/data/ folder
  const nextDataFolder = join(NETLIFY_PUBLISH_PATH, "_next", "data/")
  console.log("  ", "2. Copying SSG page data to", nextDataFolder)

  Object.entries(routes).forEach(([route, { dataRoute }]) => {
    const dataPath = join("pages", `${route}.json`)
    console.log("  ", "  ", dataPath)

    copySync(
      join(NEXT_DIST_DIR,         "serverless", dataPath),
      join(NETLIFY_PUBLISH_PATH,  dataRoute),
      {
        overwrite: false,
        errorOnExist: true
      }
    )
  })
}

module.exports = setupSsgPages
