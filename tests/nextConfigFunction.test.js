// Test next-on-netlify when config is set from a function in next.config.js
// See: https://github.com/netlify/next-on-netlify/issues/25

const buildNextApp = require("./helpers/buildNextApp");

// Capture the output to verify successful build
let buildOutput;

beforeAll(
  async () => {
    buildOutput = await buildNextApp()
      .forTest(__filename)
      .withPages("pages-simple")
      .withNextConfig("next.config.js-with-function.js")
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
