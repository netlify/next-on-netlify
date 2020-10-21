const isHtmlFile = require("../../../lib/helpers/isHtmlFile");

describe("isHtmlFile", () => {
  test("returns true when is an Html file", () => {
    expect(isHtmlFile("index.html")).toBeTruthy();
  });

  test("returns false when is not an Html file", () => {
    expect(isHtmlFile("/api/hello-world.js")).toBeFalsy();
  });

  test("returns false when is not an Html file", () => {
    expect(isHtmlFile("/blog/[slug].ts")).toBeFalsy();
  });
});
