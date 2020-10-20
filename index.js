const prepareFolders = require("./lib/steps/prepareFolders");
const copyPublicFiles = require("./lib/steps/copyPublicFiles");
const copyNextAssets = require("./lib/steps/copyNextAssets");
const setupPages = require("./lib/steps/setupPages");
const setupRedirects = require("./lib/steps/setupRedirects");

const nextOnNetlify = () => {
  prepareFolders();

  copyPublicFiles();

  copyNextAssets();

  setupPages();

  setupRedirects();
};

module.exports = nextOnNetlify;
