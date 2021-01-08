const { join } = require("path");
const {
  emptyDirSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  removeSync,
} = require("fs-extra");
const findCacheDir = require("find-cache-dir");
const { logTitle, log } = require("../helpers/logger");
const { NETLIFY_PUBLISH_PATH, NETLIFY_FUNCTIONS_PATH } = require("../config");

const TRACKING_FILE_SEPARATOR = "---";

// Clean existing publish and functions folders
const prepareFolders = ({ functionsPath, publishPath }) => {
  logTitle("🚀 Next on Netlify 🚀");

  if (functionsPath === NETLIFY_FUNCTIONS_PATH) {
    log("  ", "Functions directory: ", functionsPath);
  }
  if (publishPath === NETLIFY_PUBLISH_PATH) {
    log("  ", "Publish directory: ", publishPath);
  }
  if (
    functionsPath === NETLIFY_FUNCTIONS_PATH ||
    publishPath === NETLIFY_PUBLISH_PATH
  ) {
    log("  ", "Make sure these are set in your netlify.toml file.");
  }

  const cacheDir = findCacheDir({ name: "next-on-netlify", create: true });
  const trackingFilePath = join(cacheDir, ".nonfiletracking");
  const trackingFile = existsSync(trackingFilePath)
    ? readFileSync(trackingFilePath, "utf8")
    : "---";

  const [trackedFunctions, trackedPublish] = trackingFile.split("---");
  const isConfiguredPublishDir = publishPath !== NETLIFY_PUBLISH_PATH;
  const isConfiguredFunctionsDir = functionsPath !== NETLIFY_FUNCTIONS_PATH;

  if (isConfiguredPublishDir) {
    trackedPublish
      .trim()
      .split("\n")
      .forEach((file) => {
        const filePath = join(publishPath, file);
        if (existsSync(filePath) && file !== "") {
          removeSync(filePath);
        }
      });
  } else {
    emptyDirSync(publishPath);
  }
  if (isConfiguredFunctionsDir) {
    trackedFunctions
      .trim()
      .split("\n")
      .forEach((file) => {
        const filePath = join(functionsPath, file);
        if (existsSync(filePath) && file !== "") {
          removeSync(filePath);
        }
      });
  } else {
    emptyDirSync(functionsPath);
  }

  const functionsBeforeRun = existsSync(functionsPath)
    ? readdirSync(functionsPath)
    : [];
  const publishBeforeRun = existsSync(publishPath)
    ? readdirSync(publishPath)
    : [];

  // this callback will run at the end of nextOnNetlify()
  return () => {
    const functionsAfterRun = isConfiguredFunctionsDir
      ? readdirSync(functionsPath)
      : functionsBeforeRun;
    const publishAfterRun = isConfiguredPublishDir
      ? readdirSync(publishPath)
      : publishBeforeRun;
    const getDiff = (before, after) =>
      after.filter((filePath) => !before.includes(filePath));
    const functionsDiff = getDiff(functionsBeforeRun, functionsAfterRun);
    const publishDiff = getDiff(publishBeforeRun, publishAfterRun);

    const totalFilesDiff = [...functionsDiff, "---", ...publishDiff];
    writeFileSync(trackingFilePath, totalFilesDiff.join("\n"));
  };
};

module.exports = prepareFolders;
