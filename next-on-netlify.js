#!/usr/bin/env node

const { copySync, emptyDirSync,
        existsSync, readFileSync,
        writeFileSync, writeJsonSync } = require('fs-extra')
const { join, relative }               = require('path')
const collectNextjsPages               = require('./lib/collectNextjsPages')
const getNextDistDir                   = require('./lib/getNextDistDir')

// Configuration: Input Paths
// Path to the NextJS config file
const NEXT_CONFIG_PATH      = join(".", "next.config.js")
// Path to the folder that NextJS builds to
const NEXT_DIST_DIR         = getNextDistDir({ nextConfigPath: NEXT_CONFIG_PATH })
// Path to Netlify functions folder
const FUNCTIONS_PATH        = join(".", "functions/")
// Path to output folder (same as `next export`)
// This is where next-on-netlify will place all static files.
// The publish key in netlify.toml should point to this folder.
const OUTPUT_PATH           = join(".", "out/")
// Path to public folder
const PUBLIC_PATH           = join(".", "public/")
// Path to user-defined redirects
const USER_REDIRECTS_PATH   = join(PUBLIC_PATH, "_redirects")
// Path to the router template
const ROUTER_TEMPLATE_PATH  = join(__dirname, "lib", "routerTemplate.js")

// Configuration: Outputs
// The folder name of the NextRouter Netlify function
const ROUTER_FUNCTION_NAME  = "nextRouter"


// 1. Get a collection of our NextJS pages
// For each page, evaluate:
// - path to file (/pages/posts/[id])
// - route (/posts/:id)
// - regex (/posts/([^\/]+)/)
// - isHTML (whether it is a static file)
// - isDynamic (whether it contains dynamic URL segments)
const pages = collectNextjsPages({ nextDistDir: NEXT_DIST_DIR })

// We ignore app.js and document.js, since NextJS has already included them in
// all of the pages.
const filteredPages = pages.filter(({ file }) => (
  file !== "pages/_app.js" && file !== "pages/_document.js"
))

// Identify SSR and HTML pages
const ssrPages  = filteredPages.filter(({ isHTML }) => !isHTML)
const htmlPages = filteredPages.filter(({ isHTML }) =>  isHTML)


// 2. SSR Setup

// 2.1 SSR Setup: Clean existing Netlify function folder
emptyDirSync(
  join(FUNCTIONS_PATH, ROUTER_FUNCTION_NAME)
)

// 2.2 SSR Setup: Create nextRouter Netlify function
copySync(
  join(ROUTER_TEMPLATE_PATH),
  join(FUNCTIONS_PATH,  ROUTER_FUNCTION_NAME, `${ROUTER_FUNCTION_NAME}.js`)
)

// 2.3 SSR Setup: Copy SSR pages to functions/_next/pages
// From there, they can be served by our nextRouter Netlify function.
ssrPages.forEach(({ file }) => {
  copySync(
    join(NEXT_DIST_DIR,   "serverless",         file),
    join(FUNCTIONS_PATH,  ROUTER_FUNCTION_NAME, file)
  )
})

// 2.4 SSR Setup: Create routes.json in functions/_next/
// Our nextRouter will use this to identify which page to render. We only need
// file and regex here.
const ssrRoutes = ssrPages.map(({ file, regex }) => ({ file, regex }))
writeJsonSync(
  join(FUNCTIONS_PATH, ROUTER_FUNCTION_NAME, "routes.json"),
  { routes: ssrRoutes },
  { spaces: 2 }
)

// 2.5 SSR Setup: Create allPages.js file in functions/_next/
// allPage.js has a bunch of require-statements for each of our pages. The
// nextRouter will require this file. This tells Netlify to bundle all pages
// into our nextRouter function bundle and make them available for render.
const requireSsrPages = ssrPages.map(({ file }) => `require("./${file}")`)
writeFileSync(
  join(FUNCTIONS_PATH, ROUTER_FUNCTION_NAME, "allPages.js"),
  requireSsrPages.join("\n")
)


// 3. HTML Setup

// 3.1 HTML Setup: Clean existing output folder
emptyDirSync(OUTPUT_PATH)

// 3.2 HTML Setup: Copy files from public folder to output path
if(existsSync(PUBLIC_PATH))
  copySync(PUBLIC_PATH, OUTPUT_PATH)

// 3.3 HTML Setup: Copy HTML pages to the output folder
// These are static, so they do not need to be handled by our nextRouter.
htmlPages.forEach(({ file }) => {
  // The path to the file, relative to the pages directory
  const relativePath = relative("pages", file)

  copySync(
    join(NEXT_DIST_DIR, "serverless", "pages",relativePath),
    join(OUTPUT_PATH,   relativePath),
    {
      overwrite: false,
      errorOnExist: true
    }
  )
})


// 4. Prepare NextJS static assets
// Copy the NextJS' static assets from /.next/static to /out/_next/static.
// These need to be available for NextJS to work.
copySync(
  join(NEXT_DIST_DIR, "static"),
  join(OUTPUT_PATH,   "_next",  "static"),
  {
    overwrite: false,
    errorOnExist: true
  }
)


// 5. Generate the _redirects file
// These redirects route all requests to the appropriate location: Either the
// nextRouter Netlify function or one of our static HTML pages. They are merged
// with the _redirects file from the public/ folder, so you can still define
// your custom redirects.
const htmlRedirects = htmlPages.map(({ route, file }) => {
  // The path to the file, relative to the pages directory
  const relativePath = relative("pages", file)

  return `${route}  /${relativePath}  200`
})
const ssrRedirects = ssrPages.map(({ route }) => (
  `${route}  /.netlify/functions/${ROUTER_FUNCTION_NAME}  200`
))
const nextjsRedirects = [...htmlRedirects, ...ssrRedirects].join("\n")

// Read user-defined redirects
let userRedirects = ""
if(existsSync(USER_REDIRECTS_PATH)) {
  userRedirects = readFileSync(USER_REDIRECTS_PATH)
}

writeFileSync(
  join(OUTPUT_PATH, "_redirects"),
  userRedirects         + "\n\n"  +
  "# Next-on-Netlify Redirects"  + "\n"    +
  nextjsRedirects
)
