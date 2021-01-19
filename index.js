const { normalize } = require("path");
const prepareFolders = require("./lib/steps/prepareFolders");
const copyPublicFiles = require("./lib/steps/copyPublicFiles");
const copyNextAssets = require("./lib/steps/copyNextAssets");
const setupPages = require("./lib/steps/setupPages");
const setupImageFunction = require("./lib/steps/setupImageFunction");
const setupRedirects = require("./lib/steps/setupRedirects");
const setupHeaders = require("./lib/steps/setupHeaders");
const {
  NETLIFY_PUBLISH_PATH,
  NETLIFY_FUNCTIONS_PATH,
} = require("./lib/config");

/** options param:
 * {
 *   functionsDir: string to path
 *   publishDir: string to path
 * }
 */

const nextOnNetlify = (options = {}) => {
  const functionsPath = normalize(
    options.functionsDir || NETLIFY_FUNCTIONS_PATH
  );
  const publishPath = normalize(options.publishDir || NETLIFY_PUBLISH_PATH);

  const trackNextOnNetlifyFiles = prepareFolders({
    functionsPath,
    publishPath,
  });

  copyPublicFiles(publishPath);

  copyNextAssets(publishPath);

  setupPages({ functionsPath, publishPath });

  setupImageFunction(functionsPath);

  setupRedirects(publishPath);

  setupHeaders(publishPath);

  trackNextOnNetlifyFiles();
};

module.exports = nextOnNetlify;
