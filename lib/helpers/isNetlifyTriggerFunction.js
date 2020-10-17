// Return true if the function is a Netlify Event Trigger Function
const { NETLIFY_TRIGGER_FUNCTIONS } = require("../config");
const isNetlifyTriggerRoute = (route) => {
  return NETLIFY_TRIGGER_FUNCTIONS.includes(route);
};

module.exports = isNetlifyTriggerRoute;
