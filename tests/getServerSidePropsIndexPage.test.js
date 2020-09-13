// Test that next-on-netlify does not crash with a getServerSideProps index.js file.
// See: https://github.com/netlify/next-on-netlify/pull/39

const { parse, join } = require("path");
const {
  copySync,
  emptyDirSync,
  existsSync,
  readdirSync,
  readFileSync,
  readJsonSync,
} = require("fs-extra");
const npmRunBuild = require("./helpers/npmRunBuild");

// The name of this test file (without extension)
const FILENAME = parse(__filename).name;

// The directory which will be used for testing.
// We simulate a NextJS app within that directory, with pages, and a
// package.json file.
const PROJECT_PATH = join(__dirname, "builds", FILENAME);

// The directory that contains the fixtures, such as NextJS pages,
// NextJS config, and package.json
const FIXTURE_PATH = join(__dirname, "fixtures");

// Capture the output of `npm run build` to verify successful build
let BUILD_OUTPUT;

beforeAll(
  async () => {
    // Clear project directory
    emptyDirSync(PROJECT_PATH);
    emptyDirSync(join(PROJECT_PATH, "pages"));

    // Copy NextJS pages and config
    copySync(
      join(FIXTURE_PATH, "pages-with-gssp-index"),
      join(PROJECT_PATH, "pages")
    );
    copySync(
      join(FIXTURE_PATH, "next.config.js"),
      join(PROJECT_PATH, "next.config.js")
    );

    // Copy package.json
    copySync(
      join(FIXTURE_PATH, "package.json"),
      join(PROJECT_PATH, "package.json")
    );

    // Invoke `npm run build`: Build Next and run next-on-netlify
    const { stdout } = await npmRunBuild({ directory: PROJECT_PATH });
    BUILD_OUTPUT = stdout;
  },
  // time out after 180 seconds
  180 * 1000
);

describe("Next", () => {
  test("builds successfully", () => {
    // NextJS output
    expect(BUILD_OUTPUT).toMatch("Creating an optimized production build...");
    expect(BUILD_OUTPUT).toMatch("Finalizing page optimization...");
    expect(BUILD_OUTPUT).toMatch("First Load JS shared by all");

    // Next on Netlify output
    expect(BUILD_OUTPUT).toMatch("Next on Netlify");
    expect(BUILD_OUTPUT).toMatch("Success! All done!");
  });
});

describe("Routing", () => {
  test("it routes page and data route to Netlify Function", async () => {
    // Read _redirects file
    let contents = readFileSync(
      join(PROJECT_PATH, "out_publish", "_redirects")
    ).toString();

    // Replace non-persistent build ID with placeholder
    contents = contents.replace(
      /\/_next\/data\/[^\/]+\//g,
      "/_next/data/%BUILD_ID%/"
    );

    const redirects = contents.trim().split(/\n/);

    expect(redirects[0]).toEqual("# Next-on-Netlify Redirects");
    expect(redirects[1]).toEqual("/  /.netlify/functions/next_index  200");
    expect(redirects[2]).toEqual(
      "/_next/data/%BUILD_ID%/index.json  /.netlify/functions/next_index  200"
    );

    // Check that no other redirects are present
    expect(redirects).toHaveLength(3);
  });
});
