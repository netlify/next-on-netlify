const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

// Run npm build in the provided directory
const npmRunBuild = async ({ directory }) => {
  return execAsync("npm run build", { cwd: directory });
};

module.exports = npmRunBuild;
