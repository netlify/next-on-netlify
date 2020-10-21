const isFrameworkRoute = require("../../../lib/helpers/isFrameworkRoute");
const { NEXT_FRAMEWORK_ROUTES } = require("../../../lib/config");

describe("isFrameworkRoute", () => {
  test("returns true when is an Framework Route", () => {
    NEXT_FRAMEWORK_ROUTES.forEach((route) => {
      expect(isFrameworkRoute(route)).toBeTruthy();
    });
  });

  test("returns false when is not an Framework Route", () => {
    expect(isFrameworkRoute("/index")).toBeFalsy();
  });

  test("returns false when is not an Framework Route", () => {
    expect(isFrameworkRoute("/blog/[slug]")).toBeFalsy();
  });
});
