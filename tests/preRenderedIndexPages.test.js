// Test that next-on-netlify does not crash when pre-rendering index.js file.
// See: https://github.com/FinnWoelm/next-on-netlify/issues/2#issuecomment-636415494

const { parse, join } = require('path')
const { copySync, emptyDirSync, existsSync,
        readdirSync, readFileSync, readJsonSync } = require('fs-extra')
const npmRunBuild = require("./helpers/npmRunBuild")

// The name of this test file (without extension)
const FILENAME = parse(__filename).name

// The directory which will be used for testing.
// We simulate a NextJS app within that directory, with pages, and a
// package.json file.
const PROJECT_PATH = join(__dirname, "builds", FILENAME)

// The directory that contains the fixtures, such as NextJS pages,
// NextJS config, and package.json
const FIXTURE_PATH = join(__dirname, "fixtures")

// Capture the output of `npm run build` to verify successful build
let BUILD_OUTPUT

beforeAll(
  async () => {
    // Clear project directory
    emptyDirSync(PROJECT_PATH)
    emptyDirSync(join(PROJECT_PATH, "pages"))

    // Copy NextJS pages and config
    copySync(
      join(FIXTURE_PATH, "pages-with-prerendered-index"),
      join(PROJECT_PATH, "pages")
    )
    copySync(
      join(FIXTURE_PATH, "next.config.js"),
      join(PROJECT_PATH, "next.config.js")
    )

    // Copy package.json
    copySync(
      join(FIXTURE_PATH, "package.json"),
      join(PROJECT_PATH, "package.json")
    )

    // Invoke `npm run build`: Build Next and run next-on-netlify
    const { stdout } = await npmRunBuild({ directory: PROJECT_PATH })
    BUILD_OUTPUT = stdout
  },
  // time out after 30 seconds
  30 * 1000
)

describe('Next', () => {
  test('builds successfully', () => {
    // NextJS output
    expect(BUILD_OUTPUT).toMatch("Creating an optimized production build...")
    expect(BUILD_OUTPUT).toMatch("Automatically optimizing pages...")
    expect(BUILD_OUTPUT).toMatch("First Load JS shared by all")

    // Next on Netlify output
    expect(BUILD_OUTPUT).toMatch("Next on Netlify")
    expect(BUILD_OUTPUT).toMatch("Preparing Netlify Function for SSR pages: functions/nextRouter")
    expect(BUILD_OUTPUT).toMatch("Writing pre-rendered HTML pages to out/")
    expect(BUILD_OUTPUT).toMatch("Copying static NextJS assets to out/")
    expect(BUILD_OUTPUT).toMatch("Setting up redirects")
    expect(BUILD_OUTPUT).toMatch("Success! All done!")
  })
})

describe('Static Pages', () => {
  test('copies static pages to output directory', () => {
    const OUTPUT_PATH = join(PROJECT_PATH, "out")

    expect(existsSync(join(OUTPUT_PATH, "index.html"))).toBe(true)
    expect(existsSync(join(OUTPUT_PATH, "shows.html"))).toBe(true)
  })

  test('copies static assets to out/_next/ directory', () => {
    const dirs = readdirSync(join(PROJECT_PATH, "out", "_next", "static"))

    expect(dirs.length).toBe(3)
    expect(dirs).toContain("chunks")
    expect(dirs).toContain("runtime")
  })
})

describe('404 Page', () => {
  test('copies 404.html to output directory', () => {
    const OUTPUT_PATH = join(PROJECT_PATH, "out")

    expect(existsSync(join(OUTPUT_PATH, "404.html"))).toBe(true)
  })

  // This is required for 404.html to work on netlify-dev
  test('copies 404.html to directory root', () => {
    expect(existsSync(join(PROJECT_PATH, "404.html"))).toBe(true)
  })
})

describe('Routing',() => {
  test('creates Netlify redirects', async () => {
    // Read _redirects file
    const contents = readFileSync(join(PROJECT_PATH, "out", "_redirects"))

    // Convert contents into an array, each line being one element
    const redirects = contents.toString().split("\n")

    // Check that routes are present
    expect(redirects).toContain("/  /index.html  200")
    expect(redirects).toContain("/index  /index.html  200")
    expect(redirects).toContain("/shows  /shows.html  200")
  })
})
