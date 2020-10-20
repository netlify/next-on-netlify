const isApiRoute = require("../../../lib/helpers/isApiRoute");

describe("isApiRoute", () => {
  test("returns true when is an Api Route", () => {
    expect(isApiRoute("/api/hello-world.js")).toBeTruthy();
  });

  test("returns false when is not an Api Route", () => {
    expect(isApiRoute("index.js")).toBeFalsy();
  });

  test("returns false when is not an Api Route", () => {
    expect(isApiRoute("/blog/[slug].js")).toBeFalsy();
  });
});
