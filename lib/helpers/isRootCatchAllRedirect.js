// Return true if the redirect is a root level catch-all
// (e.g., /[[...slug]])
const isRootCatchAllRedirect = (redirect) => redirect.startsWith("/*");

module.exports = isRootCatchAllRedirect;
