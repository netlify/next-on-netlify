const path                                              = require('path')
const { join }                                          = path
const { copySync, existsSync }                          = require('fs-extra')
const { NEXT_DIST_DIR, NETLIFY_FUNCTIONS_PATH,
        FUNCTION_TEMPLATE_PATH }                        = require('./config')
const allNextJsPages                                    = require('./allNextJsPages')
const getNetlifyFunctionName                            = require('./getNetlifyFunctionName')

// Identify all pages that require server-side rendering and create a separate
// Netlify Function for every page.
const setupSsrPages = () => {
  console.log(`\x1b[1m💫 Setting up SSR pages as Netlify Functions in ${NETLIFY_FUNCTIONS_PATH}\x1b[22m`)

  // Get SSR pages
  const ssrPages = allNextJsPages.filter(page => page.isSsr())

  // Create Netlify Function for every page
  ssrPages.forEach(({ filePath }) => {
    console.log("  ", filePath)

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

module.exports = setupSsrPages
