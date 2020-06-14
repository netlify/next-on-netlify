const path                                    = require('path')
const { join }                                = path
const { copySync, existsSync }                = require('fs-extra')
const { NEXT_DIST_DIR, NETLIFY_PUBLISH_PATH,
        NETLIFY_FUNCTIONS_PATH,
        FUNCTION_TEMPLATE_PATH }              = require('./config')
const allNextJsPages                          = require('./allNextJsPages')
const getNetlifyFunctionName                  = require('./getNetlifyFunctionName')

// Identify all pages that require server-side rendering and create a separate
// Netlify Function for every page.
const setupSsgPages = () => {
  console.log(`\x1b[1m🔥 Setting up SSG pages\x1b[22m`)

  // Get SSG pages
  const ssgPages = allNextJsPages.filter(page => page.isSsg())

  // Copy pre-rendered SSG pages to Netlify publish folder
  console.log("  ", "1. Copying pre-rendered SSG pages to", NETLIFY_PUBLISH_PATH)

  ssgPages.forEach(({ htmlFile }) => {
    const filePath = join("pages", htmlFile)
    console.log("  ", "  ", filePath)

    copySync(
      join(NEXT_DIST_DIR,         "serverless",     filePath),
      join(NETLIFY_PUBLISH_PATH,  htmlFile),
      {
        overwrite: false,
        errorOnExist: true
      }
    )
  })

  // Copy SSG page data to _next/data/ folder
  const nextDataFolder = join(NETLIFY_PUBLISH_PATH, "_next", "data/")
  console.log("  ", "2. Copying SSG page data to", nextDataFolder)

  ssgPages.forEach(({ jsonFile, dataRoute }) => {
    const dataPath = join("pages", jsonFile)
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

  // Set up Netlify Functions to handle fallbacks for SSG pages
  const ssgFallbackPages = allNextJsPages.filter(page => page.isSsgFallback())
  console.log("  ", "3. Setting up Netlify Functions for SSG pages with fallback: true")

  ssgFallbackPages.forEach(({ filePath }) => {
    console.log("  ", "  ", filePath)

    // Set function name based on file path
    const functionName      = getNetlifyFunctionName(filePath)
    const functionDirectory = join(NETLIFY_FUNCTIONS_PATH, functionName)

    // Copy function template
    copySync(
      FUNCTION_TEMPLATE_PATH,
      join(functionDirectory, `${functionName}.js`),
      {
        overwrite: false,
        errorOnExist: true
      }
    )

    // Copy page
    copySync(
      join(NEXT_DIST_DIR, "serverless", filePath),
      join(functionDirectory, "nextJsPage.js"),
      {
        overwrite: false,
        errorOnExist: true
      }
    )
  })
}

module.exports = setupSsgPages
