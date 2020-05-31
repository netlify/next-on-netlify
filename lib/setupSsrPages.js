const path                                              = require('path')
const { join }                                          = path
const { copySync, existsSync, readJSONSync }            = require('fs-extra')
const { NEXT_DIST_DIR, NETLIFY_FUNCTIONS_PATH,
        FUNCTION_TEMPLATE_PATH }                        = require('./config')
const getNetlifyFunctionName                            = require('./getNetlifyFunctionName')

// Identify all pages that require server-side rendering and create a separate
// Netlify Function for every page.
const setupSsrPages = () => {
  console.log(`\x1b[1m💫 Setting up SSR pages as Netlify Functions in ${NETLIFY_FUNCTIONS_PATH}\x1b[22m`)

  // Read pages manifest that tells us which pages exist
  const pagesManifest = readJSONSync(
    join(NEXT_DIST_DIR, "serverless", "pages-manifest.json")
  )

  // Eliminate duplicates from pages manifest
  const files       = Object.values(pagesManifest)
  const uniqueFiles = [...new Set(files)]

  // Identify SSR pages
  const ssrFiles = uniqueFiles.filter(file => (
    file.endsWith(".js")          &&
    file !== "pages/_app.js"      &&
    file !== "pages/_document.js" &&
    file !== "pages/_error.js"
  ))

  // Create Netlify Function for every page
  ssrFiles.forEach(file => {
    console.log("  ", file)

    // Set function name based on file path
    const functionName      = getNetlifyFunctionName(file)
    const functionDirectory = join(NETLIFY_FUNCTIONS_PATH, functionName)

    // Verify that the function name does not exist yet
    if(existsSync(functionDirectory))
      throw `A Netlify Function named ${functionName} already exists.`

    // Copy function template
    copySync(
      FUNCTION_TEMPLATE_PATH,
      join(functionDirectory, `${functionName}.js`)
    )

    // Copy page
    copySync(
      join(NEXT_DIST_DIR, "serverless", file),
      join(functionDirectory, "nextJsPage.js")
    )
  })
}

module.exports = setupSsrPages
