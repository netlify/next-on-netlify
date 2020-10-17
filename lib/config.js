const { join } = require("path");
const getNextDistDir = require("./helpers/getNextDistDir");

// This is where next-on-netlify will place all static files.
// The publish key in netlify.toml should point to this folder.
const NETLIFY_PUBLISH_PATH = join(".", "out_publish/");

// This is where next-on-netlify will place all Netlify Functions.
// The functions key in netlify.toml should point to this folder.
const NETLIFY_FUNCTIONS_PATH = join(".", "out_functions/");

// This is where static assets, such as images, can be placed. They will be
// copied as-is to the Netlify publish folder.
const PUBLIC_PATH = join(".", "public/");

// This is the file where NextJS can be configured
const NEXT_CONFIG_PATH = join(".", "next.config.js");

// This is the folder that NextJS builds to; default is .next
const NEXT_DIST_DIR = getNextDistDir({ nextConfigPath: NEXT_CONFIG_PATH });

// This is the Netlify Function template that wraps all SSR pages
const FUNCTION_TEMPLATE_PATH = join(
  __dirname,
  "templates",
  "netlifyFunction.js"
);

// Netlify watches for these functions that trigger from a variety of events
const NETLIFY_DEPLOY_FUNCTIONS = [
  "deploy-building",
  "deploy-succeeded",
  "deploy-failed",
  "deploy-locked",
  "deploy-unlocked",
];
const NETLIFY_SPLIT_TEST_FUNCTIONS = [
  "split-test-activated",
  "split-test-deactivated",
  "split-test-modified",
];
const NETLIFY_FORM_FUNCTIONS = ["submission-created"];
const NETLIFY_IDENTITY_FUNCTIONS = [
  "identity-validate",
  "identity-signup",
  "identity-login",
];
const NETLIFY_TRIGGER_FUNCTIONS = NETLIFY_DEPLOY_FUNCTIONS.concat(
  NETLIFY_SPLIT_TEST_FUNCTIONS,
  NETLIFY_FORM_FUNCTIONS,
  NETLIFY_IDENTITY_FUNCTIONS
);

// This is the file where custom redirects can be configured
const CUSTOM_REDIRECTS_PATH = join(".", "_redirects");

module.exports = {
  NETLIFY_PUBLISH_PATH,
  NETLIFY_FUNCTIONS_PATH,
  PUBLIC_PATH,
  NEXT_CONFIG_PATH,
  NEXT_DIST_DIR,
  FUNCTION_TEMPLATE_PATH,
  CUSTOM_REDIRECTS_PATH,
  NETLIFY_DEPLOY_FUNCTIONS,
  NETLIFY_SPLIT_TEST_FUNCTIONS,
  NETLIFY_FORM_FUNCTIONS,
  NETLIFY_IDENTITY_FUNCTIONS,
  NETLIFY_TRIGGER_FUNCTIONS,
};
