const { relative } = require("path");
const isDynamicRoute = require("../../helpers/isDynamicRoute");
const pages = require("./pages");

// Pages with getStaticProps do not need redirects, unless they are using
// fallback: true or a revalidation interval. Both are handled by other files.
const redirects = [];

module.exports = redirects;
