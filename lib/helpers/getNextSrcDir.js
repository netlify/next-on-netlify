const { join } = require("path");

const getNextSrcDirs = () => {
  return ["pages", "src/pages", "public", "styles"].map((dir) =>
    join(".", dir)
  );
};

module.exports = getNextSrcDirs;
