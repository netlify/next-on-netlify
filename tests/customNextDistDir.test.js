// Test next-on-netlify when a custom distDir is set in next.config.js

const buildNextApp = require("./helpers/buildNextApp");

// Capture the output to verify successful build
let buildOutput;

beforeAll(
  async () => {
    buildOutput = await buildNextApp()
      .forTest(__filename)
      .withPages("pages-with-gssp-index")
      .withNextConfig("next.config.js")
      .withPackageJson("package.json")
      .build();
  },
  // time out after 180 seconds
  180 * 1000
);

describe("next-on-netlify", () => {
  test("builds successfully", () => {
    expect(buildOutput).toMatch("Next on Netlify");
    expect(buildOutput).toMatch("Success! All done!");
  });
});
