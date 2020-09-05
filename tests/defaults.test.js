// Test default next-on-netlify configuration
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
    copySync(join(FIXTURE_PATH, "pages"), join(PROJECT_PATH, "pages"));
    copySync(
      join(FIXTURE_PATH, "next.config.js"),
      join(PROJECT_PATH, "next.config.js")
    );

    // Copy package.json
    copySync(
      join(FIXTURE_PATH, "package.json"),
      join(PROJECT_PATH, "package.json")
    );

    // Copy image.png to public folder
    copySync(
      join(FIXTURE_PATH, "image.png"),
      join(PROJECT_PATH, "public", "image.png")
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
    expect(BUILD_OUTPUT).toMatch("Copying public/ folder to out_publish/");
    expect(BUILD_OUTPUT).toMatch(
      "Copying static NextJS assets to out_publish/"
    );
    expect(BUILD_OUTPUT).toMatch(
      "Setting up SSR pages and SSG pages with fallback as Netlify Functions in out_functions/"
    );
    expect(BUILD_OUTPUT).toMatch(
      "Copying pre-rendered SSG pages to out_publish/ and JSON data to out_publish/_next/data/"
    );
    expect(BUILD_OUTPUT).toMatch(
      "Writing pre-rendered HTML pages to out_publish/"
    );
    expect(BUILD_OUTPUT).toMatch("Setting up redirects");
    expect(BUILD_OUTPUT).toMatch("Success! All done!");
  });
});

describe("SSR Pages", () => {
  const functionsDir = join(PROJECT_PATH, "out_functions");

  test("creates a Netlify Function for each SSR page", () => {
    expect(existsSync(join(functionsDir, "next_index", "next_index.js"))).toBe(
      true
    );
    expect(
      existsSync(join(functionsDir, "next_shows_id", "next_shows_id.js"))
    ).toBe(true);
    expect(
      existsSync(
        join(functionsDir, "next_shows_params", "next_shows_params.js")
      )
    ).toBe(true);
    expect(
      existsSync(
        join(
          functionsDir,
          "next_getServerSideProps_static",
          "next_getServerSideProps_static.js"
        )
      )
    ).toBe(true);
    expect(
      existsSync(
        join(
          functionsDir,
          "next_getServerSideProps_id",
          "next_getServerSideProps_id.js"
        )
      )
    ).toBe(true);
  });
});

describe("API Pages", () => {
  const functionsDir = join(PROJECT_PATH, "out_functions");

  test("creates a Netlify Function for each API endpoint", () => {
    expect(
      existsSync(join(functionsDir, "next_api_static", "next_api_static.js"))
    ).toBe(true);
    expect(
      existsSync(
        join(functionsDir, "next_api_shows_id", "next_api_shows_id.js")
      )
    ).toBe(true);
    expect(
      existsSync(
        join(functionsDir, "next_api_shows_params", "next_api_shows_params.js")
      )
    ).toBe(true);
  });
});

describe("SSG Pages with getStaticProps", () => {
  test("creates pre-rendered HTML file in output directory", () => {
    const OUTPUT_PATH = join(PROJECT_PATH, "out_publish");

    expect(existsSync(join(OUTPUT_PATH, "getStaticProps", "static.html"))).toBe(
      true
    );
    expect(existsSync(join(OUTPUT_PATH, "getStaticProps", "1.html"))).toBe(
      true
    );
    expect(existsSync(join(OUTPUT_PATH, "getStaticProps", "2.html"))).toBe(
      true
    );
    expect(
      existsSync(join(OUTPUT_PATH, "getStaticProps", "withFallback", "3.html"))
    ).toBe(true);
    expect(
      existsSync(join(OUTPUT_PATH, "getStaticProps", "withFallback", "4.html"))
    ).toBe(true);
    expect(
      existsSync(
        join(
          OUTPUT_PATH,
          "getStaticProps",
          "withFallback",
          "my",
          "path",
          "1.html"
        )
      )
    ).toBe(true);
    expect(
      existsSync(
        join(
          OUTPUT_PATH,
          "getStaticProps",
          "withFallback",
          "my",
          "path",
          "2.html"
        )
      )
    ).toBe(true);
  });

  test("creates data .json file in /_next/data/ directory", () => {
    // Get path to data files
    const dirs = readdirSync(
      join(PROJECT_PATH, "out_publish", "_next", "data")
    );
    expect(dirs.length).toBe(1);
    const dataDir = join(PROJECT_PATH, "out_publish", "_next", "data", dirs[0]);

    expect(existsSync(join(dataDir, "getStaticProps", "static.json"))).toBe(
      true
    );
    expect(existsSync(join(dataDir, "getStaticProps", "1.json"))).toBe(true);
    expect(existsSync(join(dataDir, "getStaticProps", "2.json"))).toBe(true);
    expect(
      existsSync(join(dataDir, "getStaticProps", "withFallback", "3.json"))
    ).toBe(true);
    expect(
      existsSync(join(dataDir, "getStaticProps", "withFallback", "4.json"))
    ).toBe(true);
    expect(
      existsSync(
        join(dataDir, "getStaticProps", "withFallback", "my", "path", "1.json")
      )
    ).toBe(true);
    expect(
      existsSync(
        join(dataDir, "getStaticProps", "withFallback", "my", "path", "2.json")
      )
    ).toBe(true);
  });

  test("creates Netlify Functions for pages with fallback", () => {
    const functionPath1 =
      "next_getStaticProps_withFallback_id/next_getStaticProps_withFallback_id.js";
    expect(existsSync(join(PROJECT_PATH, "out_functions", functionPath1))).toBe(
      true
    );

    const functionPath2 =
      "next_getStaticProps_withFallback_slug/next_getStaticProps_withFallback_slug.js";
    expect(existsSync(join(PROJECT_PATH, "out_functions", functionPath2))).toBe(
      true
    );
  });
});

describe("Static Pages", () => {
  test("copies static pages to output directory", () => {
    const OUTPUT_PATH = join(PROJECT_PATH, "out_publish");

    expect(existsSync(join(OUTPUT_PATH, "static.html"))).toBe(true);
    expect(existsSync(join(OUTPUT_PATH, "static/[id].html"))).toBe(true);
  });

  test("copies static assets to out_publish/_next/ directory", () => {
    const dirs = readdirSync(
      join(PROJECT_PATH, "out_publish", "_next", "static")
    );

    expect(dirs.length).toBe(2);
    expect(dirs).toContain("chunks");
  });
});

describe("404 Page", () => {
  test("copies 404.html to output directory", () => {
    const OUTPUT_PATH = join(PROJECT_PATH, "out_publish");

    expect(existsSync(join(OUTPUT_PATH, "404.html"))).toBe(true);
  });
});

describe("Public assets", () => {
  test("copies public files to output directory", () => {
    const OUTPUT_PATH = join(PROJECT_PATH, "out_publish");

    expect(existsSync(join(OUTPUT_PATH, "image.png"))).toBe(true);
  });
});

describe("Routing", () => {
  test("creates Netlify redirects", async () => {
    // Read _redirects file
    const contents = readFileSync(
      join(PROJECT_PATH, "out_publish", "_redirects")
    );
    let redirects = contents.toString();

    // Replace non-persistent build ID with placeholder
    redirects = redirects.replace(
      /\/_next\/data\/[^\/]+\//g,
      "/_next/data/%BUILD_ID%/"
    );

    // Check that redirects match
    expect(redirects).toMatchSnapshot();
  });
});
