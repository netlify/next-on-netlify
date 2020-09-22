const path = require("path");

// Generate the Netlify Function name for the given file path.
// The file path will be pages/directory/subdirectory/[id].js
// The function name will be next_directory_subdirectory_[id]
// We do this because every function needs to be at the top-level, i.e.
// nested functions are not allowed.
const getNetlifyFunctionName = (filePath) => {
  // Remove pages/ from file path:
  // pages/directory/page.js > directory/page.js
  const relativeFilePath = path.relative("pages", filePath);

  // Extract directory path and file name without extension
  const { dir: directoryPath, name } = path.parse(relativeFilePath);

  // Combine next, directory path, and file name:
  // next/directory/page
  const filePathWithoutExtension = path.join("next", directoryPath, name);

  // Replace slashes with underscores:
  // next/directory/page > next_directory_page
  let functionName = filePathWithoutExtension.split(path.sep).join("_");

  // Netlify Function names may not contain periods or square brackets.
  // To be safe, we keep only alphanumeric characters and underscores.
  // See: https://community.netlify.com/t/failed-to-upload-functions-file-function-too-large/3549/8
  functionName = functionName.replace(/[^\w\d]/g, "");

  return functionName;
};

module.exports = getNetlifyFunctionName;
