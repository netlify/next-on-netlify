// Copied from serverless-next.js (v1.8.0)
// https://github.com/danielcondemarin/serverless-next.js/blob/master/packages/serverless-nextjs-component/lib/pathToRegexStr.js

const pathToRegexp = require("path-to-regexp");

module.exports = path =>
  pathToRegexp(path)
    .toString()
    .replace(/\/(.*)\/\i/, "$1");
