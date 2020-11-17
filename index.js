const prepareFolders = require("./lib/steps/prepareFolders");
const copyPublicFiles = require("./lib/steps/copyPublicFiles");
const copyNextAssets = require("./lib/steps/copyNextAssets");
const setupPages = require("./lib/steps/setupPages");
const setupRedirects = require("./lib/steps/setupRedirects");
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
  const functionsPath = options.functionsDir || NETLIFY_FUNCTIONS_PATH;
  const publishPath = options.publishDir || NETLIFY_PUBLISH_PATH;

  prepareFolders({ functionsPath, publishPath });

  copyPublicFiles(publishPath);

  copyNextAssets(publishPath);

  setupPages({ functionsPath, publishPath });

  setupRedirects(publishPath);
};

module.exports = nextOnNetlify;
