// Copied from serverless-next.js (v1.8.0)
// https://github.com/danielcondemarin/serverless-next.js/blob/master/packages/serverless-nextjs-component/lib/expressifyDynamicRoute.js

// converts a nextjs dynamic route /[param]/ to express style /:param/
module.exports = dynamicRoute => {
  return dynamicRoute.replace(/\[(?<param>.*?)]/g, ":$<param>");
};
