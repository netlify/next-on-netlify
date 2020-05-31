const path                                    = require('path')
const { join }                                = path
const { copySync, existsSync, readJSONSync }  = require('fs-extra')
const { NEXT_DIST_DIR, NETLIFY_PUBLISH_PATH } = require('./config')

// Identify all pages that have been pre-rendered and copy each one to the
// Netlify publish directory.
const setupHtmlPages = () => {
  console.log(`\x1b[1m🔥 Writing pre-rendered HTML pages to ${NETLIFY_PUBLISH_PATH}\x1b[22m`)

  // Read pages manifest that tells us which pages exist
  const pagesManifest = readJSONSync(
    join(NEXT_DIST_DIR, "serverless", "pages-manifest.json")
  )

  // Eliminate duplicates from pages manifest
  const files       = Object.values(pagesManifest)
  const uniqueFiles = [...new Set(files)]

  // Identify HTML pages
  const htmlFiles = uniqueFiles.filter(file => file.endsWith(".html"))

  // Copy each page to the Netlify publish directory
  htmlFiles.forEach(file => {
    console.log("  ", file)

    // The path to the file, relative to the pages directory
    const relativePath = path.relative("pages", file)

    copySync(
      join(NEXT_DIST_DIR,         "serverless", "pages",relativePath),
      join(NETLIFY_PUBLISH_PATH,  relativePath),
      {
        overwrite: false,
        errorOnExist: true
      }
    )
  })

  // Copy 404.html to directory root
  // This is a temporary workaround. Currenly, Netlify (deployed) expects the
  // 404.html file in the publish folder, while netlify-cli dev expects it at
  // the directory root. In order to cover both cases, we copy the 404.html to
  // both locations until this is fixed.
  if(existsSync(join(NETLIFY_PUBLISH_PATH, "404.html")))
    copySync(join(NETLIFY_PUBLISH_PATH, "404.html"), join(".", "404.html"))
}

module.exports = setupHtmlPages
