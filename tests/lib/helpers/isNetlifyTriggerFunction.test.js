const isNetlifyTriggerRoute = require("../../../lib/helpers/isNetlifyTriggerFunction");
const { NETLIFY_TRIGGER_FUNCTIONS } = require("../../../lib/config");

describe("isNetlifyTriggerRoute", () => {
  test("returns true when is a Netlify Event Trigger Function", () => {
    NETLIFY_TRIGGER_FUNCTIONS.forEach((trigger_event) => {
      expect(isNetlifyTriggerRoute(trigger_event)).toBeTruthy();
    });
  });
});
