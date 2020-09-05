const path                                    = require('path')
const { join }                                = path
const { copySync, existsSync }                = require('fs-extra')
const { NEXT_DIST_DIR, NETLIFY_PUBLISH_PATH } = require('./config')
const allNextJsPages                          = require('./allNextJsPages')

// Identify all pages that have been pre-rendered and copy each one to the
// Netlify publish directory.
const setupHtmlPages = () => {
  console.log(`\x1b[1m📝 Writing pre-rendered HTML pages to ${NETLIFY_PUBLISH_PATH}\x1b[22m`)

  // Get HTML pages
  const htmlPages = allNextJsPages.filter(page => page.isHtml())

  // Copy each page to the Netlify publish directory
  htmlPages.forEach(({ filePath }) => {
    console.log("  ", filePath)

    // The path to the file, relative to the pages directory
    const relativePath = path.relative("pages", filePath)

    copySync(
      join(NEXT_DIST_DIR,         "serverless", "pages", relativePath),
      join(NETLIFY_PUBLISH_PATH,  relativePath),
      {
        overwrite: false,
        errorOnExist: true
      }
    )
  })
}

module.exports = setupHtmlPages
