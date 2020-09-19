const { spawnSync } = require("child_process");

// Run the given npm command from the given directory
const npmRun = (command, fromDirectory) => {
  // Execute the command
  const results = spawnSync("npm", ["run", command], {
    cwd: fromDirectory,
    encoding: "utf-8",
  });

  // Catch errors
  if (results.status != 0) {
    console.log(results.stdout);
    console.log(results.stderr);
    throw `An error occurred during -npm run ${command}- in ${fromDirectory}`;
  }

  return results;
};

module.exports = npmRun;
